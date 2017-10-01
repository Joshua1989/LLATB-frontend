from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import time, sys, urllib.request, json, pygeoip, html
from mysite import settings
sys.path.append(settings.BASE_DIR)
from llatb import GameData, Live, DefaultLive, MFLive, SMLive, TeamBuilder, html_view
from llatb.skill import CenterSkill

from my_log.models import Counter

GEOIP = pygeoip.GeoIP(settings.BASE_DIR+"/static/GeoLiteCity.dat", pygeoip.MEMORY_CACHE)
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        # print("returning FORWARDED_FOR")
        ip = x_forwarded_for.split(',')[-1].strip()
    elif request.META.get('HTTP_X_REAL_IP'):
        # print("returning REAL_IP")
        ip = request.META.get('HTTP_X_REAL_IP')
    else:
        # print("returning REMOTE_ADDR")
        ip = request.META.get('REMOTE_ADDR')
    try:
    	res = GEOIP.record_by_addr(str(ip))
    	return '{0} {1} {2}'.format(str(ip), res['city'], res['country_name'])
    except:
    	return str(ip)

# Create your views here.
def index(request):
	context = { 'count': Counter.objects.get_or_create()[0].TeamCount }
	return render(request, 'build_team.html', context)

# Create your views here.
def build_team_en(request):
	context = { 'count': Counter.objects.get_or_create()[0].TeamCount }
	return render(request, 'build_team_en.html', context)

@csrf_exempt
def calculate(request):
	strings = {
		'CN': {
			'DEFAULT': '默认谱面',
			'ERR_LIVE': '载入谱面信息失败...',
			'ERR_PROFILE': '载入用户卡组信息失败...',
			'ERR_EXCOND': '应用附加条件失败...',
			'ERR_SOLVE': '求解最佳卡组失败，请检查该色是否有13张卡',
			'ERR_EXPORT': '导出文件失败...',
			'IMCOMPLETE': '由于服务器响应时间限制，返回算法中断前最优结果，算法完成度 {0}/{1}，请尝试<button id="recalculate" class="w3-green w3-hover-yellow roundBtn" style="height:25px" onclick="calculate(true)"><b>继续未完成计算</b></button>。<br>可能是你的宝石太少了，您也可以尝试开启无限宝石看你需要哪些并抓紧时间收集。',
			'SUCCESS': '#{0} 组队成功，共耗时{1:.2f}秒',
			'ERR_NONAJAX': '服务器接收请求不是AJAX'
		},
		'EN': {
			'DEFAULT': 'Default',
			'ERR_LIVE': 'Failed to load live notes...',
			'ERR_PROFILE': 'Failed to read user profile...',
			'ERR_EXCOND': 'Failed to apply extra condition...',
			'ERR_SOLVE': 'Failed to solve optimal team, please check whether there are at least 13 cards have current attribute',
			'ERR_EXPORT': 'Failed to export result into other formats...',
			'IMCOMPLETE': 'Due to server response time limit, algorithm terminated with progress {0}/{1}, please try to <button id="recalculate" class="w3-green w3-hover-yellow roundBtn" style="height:25px" onclick="calculate(true)"><b>continue</b></button> the computation.',
			'SUCCESS': '#{0} Team builded, used {1:.2f} secs',
			'ERR_NONAJAX': 'The request is not AJAX'
		}
	}
	lang = request.POST.get('lang', 'EN')
	if request.is_ajax():
		start_time = time.time()
		song_list, PR = eval(request.POST['song_list']), float(request.POST['perfect_rate'])
		group, attr, diff = [request.POST[x] for x in ['group', 'attribute', 'difficulty']]
		score_up, skill_up = float(request.POST.get('score_up',0)), float(request.POST.get('skill_up',0))
		unlimit_gem, extra_cond, json_str = bool(request.POST['unlimit_gem']=='true'), request.POST['extra_cond'], request.POST['user_profile']
		is_sm, is_random = bool(request.POST.get('is_sm', 'false')=='true'), bool(request.POST.get('is_random', 'false')=='true')
		pin_index = [int(x) for x in json.loads(request.POST.get('pin_index', '[]'))]
		exclude_index = [int(x) for x in json.loads(request.POST.get('exclude_index', '[]'))]
		next_cskill_index, prev_max_cskill_index = int(request.POST.get('next_cskill_index', 0)), int(request.POST.get('prev_max_cskill_index', 0))

		user_info  = 'User Information: {0} from {1} team building page\n'.format(str(get_client_ip(request)), lang)
		if not is_sm:
			user_info += 'Live Info: {0} {1} {2} {3}, P Rate={4}, {5}/{6} pinned cards\n'.format(song_list, group, attr, diff, PR, len(pin_index), len(exclude_index))
		else:
			user_info += 'Live Info: {5} {0} {1} {2} {3}, P Rate={4}, {6}/{7} pinned cards\n'.format(song_list, group, attr, diff, PR, 'SM'+' random'*is_random, len(pin_index), len(exclude_index))
		user_info += 'ScoreUp={0}, SkillUp={1}, GemUnlimited={2}, ExtraCond={3}, start from case {4}, previous best case is at {5}'.format(score_up, skill_up, unlimit_gem, extra_cond, next_cskill_index, prev_max_cskill_index)
		print(user_info)

		# Load live
		try:
			if strings[lang]['DEFAULT'] not in song_list[0] and not is_sm:
				live = MFLive(song_list, diff, local_dir=settings.BASE_DIR+'/static/live_json/', perfect_rate=PR)
				live_stats, note_list = html_view(live, lang=lang).data, json.dumps(live.web_note_list)
			elif is_sm:
				live = SMLive(song_list, diff, local_dir=settings.BASE_DIR+'/static/live_json/', perfect_rate=PR, is_random=is_random)
				live_stats, note_list = 'NA', '{}'
			else:
				song_name = song_list[0].replace(strings[lang]['DEFAULT'], 'Default')
				live = DefaultLive(song_name, diff, perfect_rate=PR)
				live_stats, note_list = 'NA', '{}'
			print('Successfully loaded live.')
		except:
			print('Failed to load live.')
			message = {'complete':False, 'msg':strings[lang]['ERR_LIVE']}
			return JsonResponse(message)
		# Load user profile
		try:
			if 'detail' in json_str:
				user_profile = GameData(json_str, file_type='pll', string_input=True)
			else:
				user_profile = GameData(json_str, file_type='ieb', string_input=True)
			print('Successfully loaded user profile.')
		except:
			print('Failed to load user profile.')
			message = {'complete':False, 'msg':strings[lang]['ERR_PROFILE']}
			return JsonResponse(message)
		# Solve for optimal team
		try:
			guest_center = request.POST.get('guest_center', 'None')
			guest_cskill = None if guest_center == 'None' else CenterSkill.fromStr(guest_center)
			if guest_cskill != None: print('Guest skill specified to be', str(guest_cskill))
			opt = {'score_up_bonus':score_up, 'skill_up_bonus':skill_up, 'guest_cskill':guest_cskill}
			tb = TeamBuilder(live, user_profile, opt=opt, unlimited_SIS=unlimit_gem, extra_cond=extra_cond)
			
			# Choose alloc method wisely
			_, (num_calc, num_total, prev_max_cskill_index) = tb.build_team(K=12, method='1-suboptimal', alloc_method='auto', time_limit=24, pin_index=pin_index, exclude_index=exclude_index, next_cskill_index=next_cskill_index, prev_max_cskill_index=prev_max_cskill_index)
			result = ''
			if num_calc < num_total:
				result += '<p style="text-align:center; color:red"><b>{0}</b></p>'.format(strings[lang]['IMCOMPLETE'].format(num_calc, num_total))
			result += tb.view_result(show_cost=True, lang=lang).data.replace('http:','').replace('https:','')
		except:
			print('Failed to compute optimal team.')
			message = {'complete':False, 'msg':strings[lang]['ERR_SOLVE']}
			return JsonResponse(message)
		# Covert result to LL Helper and SIFStats
		try:
			sd_file, ieb_file = tb.best_team.to_LLHelper(None), tb.best_team.to_ieb(None)
			simul_base_info = json.dumps(tb.best_team.prepare_simulation(opt))
		except:
			print('Failed to export file.')
			message = {'complete':False, 'msg':strings[lang]['ERR_EXPORT']}
			return JsonResponse(message)
		elapsed_time = time.time() - start_time

		counter, _ = Counter.objects.get_or_create()
		counter.TeamCount += 1
		counter.save()
		print('This is the {0}-th built team, computation takes {1:.2f} seconds'.format(counter.TeamCount, elapsed_time))
		message = {
			'complete': True,
			'counter': counter.TeamCount,
			'sd_file': sd_file,
			'ieb_file': ieb_file,
			'live_stats': live_stats,
			'result': result,
			'note_list': note_list,
			'simul_base_info': simul_base_info,
			'next_cskill_index': num_calc+1,
			'prev_max_cskill_index': prev_max_cskill_index,
			'msg': strings[lang]['SUCCESS'].format(counter.TeamCount, elapsed_time)
		}
	else:
		message = {'complete':False, 'msg':strings[lang]['ERR_NONAJAX']}
	return JsonResponse(message)

@csrf_exempt
def live_stats(request):
	strings = {
		'CN': {
			'ERR_LIVE': '载入谱面信息失败...',
			'SUCCESS': '成功获取谱面详细信息',
			'ERR_NONAJAX': '服务器接收请求不是AJAX'
		},
		'EN': {
			'ERR_LIVE': 'Failed to load live notes...',
			'SUCCESS': 'Successfully fetched detailed live stats',
			'ERR_NONAJAX': 'The request is not AJAX'
		}
	}
	lang = request.POST.get('lang', 'EN')
	if request.is_ajax():
		song_name, diff, PR = html.unescape(request.POST['song_name']), request.POST['difficulty'], request.POST['perfect_rate']
		user_info  = 'User Information: {0} from {1} live stats page\n'.format(str(get_client_ip(request)), lang)
		user_info += 'View Live Info: {0} {1}'.format(song_name, diff)
		print(user_info)

		try:
			live = Live(song_name, diff, local_dir=settings.BASE_DIR+'/static/live_json/', perfect_rate=float(PR))
			live_stats = html_view(live, lang=lang).data.replace('http:','').replace('https:','')
			print('Successfully loaded live.')
		except:
			print('Failed to load live.')
			message = {'complete':False, 'msg':strings[lang]['ERR_LIVE']}
			return JsonResponse(message)

		message = {
			'complete': True,
			'live_stats': live_stats,
			'msg': '{0} {1} {2}'.format(strings[lang]['SUCCESS'], song_name, diff)
		}
	else:
		message = {'complete':False, 'msg':strings[lang]['ERR_NONAJAX']}
	return JsonResponse(message)

@csrf_exempt
def minaraishi_convert(request):
	strings = {
		'CN': {
			'ERR_MINARAISHI': '转换minaraishi格式失败...',
			'SUCCESS': '成功转换minaraishi格式',
			'ERR_NONAJAX': '服务器接收请求不是AJAX'
		},
		'EN': {
			'ERR_MINARAISHI': 'Failed to convert from minaraishi\'s format...',
			'SUCCESS': 'Successfully convert from minaraishi\'s format',
			'ERR_NONAJAX': 'The request is not AJAX'
		}
	}

	lang = request.POST.get('lang', 'EN')
	if request.is_ajax():
		minaraishi_json_str = request.POST['minaraishi_json']
		user_info  = 'User Information: {0} from {1} minaraishi\'s convert page'.format(str(get_client_ip(request)), lang)
		print(user_info)
		try:
			user_profile = GameData(minaraishi_json_str, file_type='minaraishi', string_input=True)
			user_json = user_profile.to_WebATB()
		except:
			print('Failed to convert minaraishi format.')
			message = {'complete':False, 'msg':strings[lang]['ERR_MINARAISHI']}
			return JsonResponse(message)

		message = {
			'complete': True,
			'user_json': user_json,
			'msg': strings[lang]['SUCCESS']
		}
	else:
		message = {'complete':False, 'msg':strings[lang]['ERR_NONAJAX']}
	
	return JsonResponse(message)

@csrf_exempt
def SIT_convert(request):
	strings = {
		'CN': {
			'ERR_SIT': '导入School Idol Tomodachi账户{0}失败...',
			'SUCCESS': '成功导入School Idol Tomodachi账户{0}',
			'ERR_NONAJAX': '服务器接收请求不是AJAX'
		},
		'EN': {
			'ERR_SIT': 'Failed import School Idol Tomodachi account {0}...',
			'SUCCESS': 'Successfully import School Idol Tomodachi account {0}',
			'ERR_NONAJAX': 'The request is not AJAX'
		}
	}

	lang = request.POST.get('lang', 'EN')
	if request.is_ajax():
		SIT_json_str, user_name, account_name = request.POST['SIT_json'], request.POST['username'], request.POST['account']
		user_info  = 'User Information: {0} from {1} SIT convert page\n'.format(str(get_client_ip(request)), lang)
		user_info += 'SIT username: {0}, SIT account: {1}'.format(user_name, account_name)
		print(user_info)
		try:
			user_profile = GameData(SIT_json_str, file_type='SIT', string_input=True)
			user_json = user_profile.to_WebATB()
		except:
			print('Failed to convert SIT format.')
			message = {'complete':False, 'msg':strings[lang]['ERR_SIT'].format(account_name)}
			return JsonResponse(message)

		message = {
			'complete': True,
			'user_json': user_json,
			'msg': strings[lang]['SUCCESS'].format(account_name)
		}
	else:
		message = {'complete':False, 'msg':strings[lang]['ERR_NONAJAX']}
	
	return JsonResponse(message)

@csrf_exempt
def LLH_convert(request):
	strings = {
		'CN': {
			'ERR_LLH': '导出至LL Helper sd格式失败...',
			'SUCCESS': '成功导出至LL Helper sd格式',
			'ERR_NONAJAX': '服务器接收请求不是AJAX'
		},
		'EN': {
			'ERR_LLH': 'Failed export to LL Helper sd format...',
			'SUCCESS': 'Successfully export to LL Helper sd format',
			'ERR_NONAJAX': 'The request is not AJAX'
		}
	}

	lang = request.POST.get('lang', 'EN')
	if request.is_ajax():
		user_json = request.POST['user_json']
		user_info  = 'User Information: {0} from {1} LLH convert page'.format(str(get_client_ip(request)), lang)
		print(user_info)
		try:
			user_profile = GameData(user_json, file_type='pll', string_input=True)
			user_json = user_profile.to_LLHelper(filename=None)
		except:
			print('Failed to convert LL Helper sd format.')
			message = {'complete':False, 'msg':strings[lang]['ERR_LLH']}
			return JsonResponse(message)

		message = {
			'complete': True,
			'user_json': user_json,
			'msg': strings[lang]['SUCCESS']
		}
	else:
		message = {'complete':False, 'msg':strings[lang]['ERR_NONAJAX']}
	return JsonResponse(message)

def receive_user_json(request):
	return render(request, 'receive_user_json.html')

def LLproxy_user_json(request):
	return render(request, 'LLproxy_user_json.html')

@csrf_exempt
def filter_cards(request):
	strings = {
		'CN': {
			'DEFAULT': '默认谱面',
			'ERR_LIVE': '载入谱面信息失败...',
			'ERR_PROFILE': '载入用户卡组信息失败...',
			'ERR_EXCOND': '应用附加条件失败...',
			'ERR_TIER': '计算卡牌强度天梯失败...',
			'SUCCESS': '成功筛选卡牌',
			'ERR_NONAJAX': '服务器接收请求不是AJAX'
		},
		'EN': {
			'DEFAULT': 'Default',
			'ERR_LIVE': 'Failed to load live notes...',
			'ERR_PROFILE': 'Failed to read user profile...',
			'ERR_EXCOND': 'Failed to apply extra condition...',
			'ERR_TIER': 'Failed to compute card strength tier...',
			'SUCCESS': 'Successfully filter the cards',
			'ERR_NONAJAX': 'The request is not AJAX'
		}
	}

	lang = request.POST.get('lang', 'EN')
	if request.is_ajax():
		start_time = time.time()
		song_list, PR = eval(request.POST['song_list']), float(request.POST['perfect_rate'])
		group, attr, diff = [request.POST[x] for x in ['group', 'attribute', 'difficulty']]
		score_up, skill_up = float(request.POST.get('score_up',0)), float(request.POST.get('skill_up',0))
		extra_cond, json_str = request.POST['extra_cond'], request.POST['user_profile']
		is_sm, is_random = bool(request.POST.get('is_sm', 'false')=='true'), bool(request.POST.get('is_random', 'false')=='true')

		user_info  = 'User Information: {0} from {1} card filtering page\n'.format(str(get_client_ip(request)), lang)
		if not is_sm:
			user_info += 'Live Info: {0} {1} {2} {3}, P Rate={4}\n'.format(song_list, group, attr, diff, PR)
		else:
			user_info += 'Live Info: {5} {0} {1} {2} {3}, P Rate={4}\n'.format(song_list, group, attr, diff, PR, 'SM'+' random'*is_random)
		user_info += 'ScoreUp={0}, SkillUp={1}, ExtraCond={2}'.format(score_up, skill_up, extra_cond)
		print(user_info)

		# Load live
		try:
			if strings[lang]['DEFAULT'] not in song_list[0] and not is_sm:
				live = MFLive(song_list, diff, local_dir=settings.BASE_DIR+'/static/live_json/', perfect_rate=PR)
				live_stats, note_list = html_view(live, lang=lang).data, json.dumps(live.web_note_list)
			elif is_sm:
				live = SMLive(song_list, diff, local_dir=settings.BASE_DIR+'/static/live_json/', perfect_rate=PR, is_random=is_random)
				live_stats, note_list = 'NA', '{}'
			else:
				song_name = song_list[0].replace(strings[lang]['DEFAULT'], 'Default')
				live = DefaultLive(song_name, diff, perfect_rate=PR)
				live_stats, note_list = 'NA', '{}'
			print('Successfully loaded live.')
		except:
			print('Failed to load live.')
			message = {'complete':False, 'msg':strings[lang]['ERR_LIVE']}
			return JsonResponse(message)
		# Load user profile
		try:
			if 'detail' in json_str:
				user_profile = GameData(json_str, file_type='pll', string_input=True)
			else:
				user_profile = GameData(json_str, file_type='ieb', string_input=True)
			print('Successfully loaded user profile.')
		except:
			print('Failed to load user profile.')
			message = {'complete':False, 'msg':strings[lang]['ERR_PROFILE']}
			return JsonResponse(message)
		# Modify user profile
		try:
			guest_center = request.POST.get('guest_center', 'None')
			guest_cskill = None if guest_center == 'None' else CenterSkill.fromStr(guest_center)
			if guest_cskill != None: print('Guest skill specified to be', str(guest_cskill))
			opt = {'score_up_bonus':score_up, 'skill_up_bonus':skill_up, 'guest_cskill':guest_cskill}
			tb = TeamBuilder(live, user_profile, opt=opt, extra_cond=extra_cond)
			result = {k:v.data.replace('http:','').replace('https:','') for k, v in tb.show_rough_strength().items()}
		except:
			print('Failed to filter cards.')
			message = {'complete':False, 'msg':strings[lang]['ERR_TIER']}
			return JsonResponse(message)

		message = {
			'complete': True,
			'result': result,
			'msg': strings[lang]['SUCCESS']
		}
	else:
		message = {'complete':False, 'msg':strings[lang]['ERR_NONAJAX']}
	return JsonResponse(message)