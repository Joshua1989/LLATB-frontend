from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import time, sys, urllib.request, json, pygeoip, html
from mysite import settings
sys.path.append(settings.BASE_DIR)
from llatb import GameData, Live, DefaultLive, MFLive, SMLive, TeamBuilder, Team, html_view
from llatb.advanced.team_builder import GemAllocator
from llatb.common.global_var import gem_skill_id_dict
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
	print('User location: {0}'.format(str(get_client_ip(request))))
	return redirect("http://llatb-v2.herokuapp.com/simulation/")
	context = { 'count': Counter.objects.get_or_create()[0].TeamCount }
	return render(request, 'advanced_simul.html', context)

def edit_team(request):
	context = { 'back_url': '/advanced_simul/' }
	return render(request, 'edit_team.html', context)

@csrf_exempt
def calculate(request):
	strings = {
		'CN': {
			'DEFAULT': '默认谱面',
			'ERR_LIVE': '载入谱面信息失败...',
			'ERR_PROFILE': '载入用户卡组信息失败...',
			'ERR_TEAM': '构造组队失败...',
			'ERR_EXCOND': '应用附加条件失败...',
			'ERR_PREPARE': '仿真预处理失败, 可能是缺少技能槽信息，请尝试进入手动编辑界面点击保存再返回仿真',
			'ERR_EXPORT': '导出文件失败...',
			'SUCCESS': '队伍强度计算成功，共耗时{0:.2f}秒',
			'SUCCESS_AUTO': '#{0} 宝石分配成功，共耗时{1:.2f}秒',
			'ERR_NONAJAX': '服务器接收请求不是AJAX'
		},
		'EN': {
			'DEFAULT': 'Default',
			'ERR_LIVE': 'Failed to load live notes...',
			'ERR_PROFILE': 'Failed to read user profile...',
			'ERR_TEAM': 'Failed to construct team...',
			'ERR_EXCOND': 'Failed to apply extra condition...',
			'ERR_PREPARE': 'Failed to finish preprocessing of advanced simulation, please go to manual edit page to save and return again',
			'ERR_EXPORT': 'Failed to export result into other formats...',
			'SUCCESS': 'Team strength calculated, used {0:.2f} secs',
			'SUCCESS_AUTO': '#{0} optimal SIS allocated, used {1:.2f} secs',
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

		user_info  = 'User Information: {0} from {1} page\n'.format(str(get_client_ip(request)), lang)
		user_info += 'Live Info: {0} {1} {2} {3}, P Rate={4}\n'.format(song_list, group, attr, diff, PR)
		user_info += 'ScoreUp={0}, SkillUp={1}, ExtraCond={2}'.format(score_up, skill_up, extra_cond)
		print(user_info)

		# Load live
		try:
			live = MFLive(song_list, diff, local_dir=settings.BASE_DIR+'/static/live_json/', perfect_rate=PR)
			note_list = json.dumps(live.web_note_list)
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
		# Solve for optimal SIS allocation or compute the team strength
		try:
			guest_center = request.POST.get('guest_center', 'None')
			guest_cskill = None if guest_center == 'None' else CenterSkill.fromStr(guest_center)
			if guest_cskill != None: print('Guest skill specified to be', str(guest_cskill))
			opt = {'score_up_bonus':score_up, 'skill_up_bonus':skill_up, 'guest_cskill':guest_cskill}
			tb = TeamBuilder(live, user_profile, opt=opt, extra_cond=extra_cond)

			try:
				adv_card_list = sorted(tb.cards, key=lambda x: x.index)
				for card, info in zip(adv_card_list, json.loads(json_str)['unit_info']):
					gems = [gem_skill_id_dict[x] for x in info['removable']]
					card.equip_gem(gems)
				print('Successfully equipped team.')
			except:
				print('Failed to equip team.')
				message = {'complete':False, 'msg':strings[lang]['ERR_TEAM']}
				return JsonResponse(message)
			input_team = Team(adv_card_list)
			print('Successfully finished preparation for advanced simulation.')
		except:
			print('Failed to compute team strength details. Perhaps lack of slot number information, please try manual edit team first.')
			message = {'complete':False, 'msg':strings[lang]['ERR_PREPARE']}
			return JsonResponse(message)
		# Covert result to LL Helper and SIFStats
		try:
			sd_file, ieb_file = input_team.to_LLHelper(None), input_team.to_ieb(None)
			simul_base_info = json.dumps(input_team.prepare_simulation(opt))
		except:
			print('Failed to export file.')
			message = {'complete':False, 'msg':strings[lang]['ERR_EXPORT']}
			return JsonResponse(message)
		elapsed_time = time.time() - start_time
		message = {
			'complete': True,
			'sd_file': sd_file,
			'ieb_file': ieb_file,
			'note_list': note_list,
			'simul_base_info': simul_base_info,
			'msg': strings[lang]['SUCCESS'].format(elapsed_time)
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
		song_list, diff, PR = eval(request.POST['song_list']), request.POST['difficulty'], request.POST['perfect_rate']
		user_info  = 'User Information: {0} from {1} advanced simulation page\n'.format(str(get_client_ip(request)), lang)
		user_info += 'View Live Info: {0} {1}'.format(song_list, diff)
		print(user_info)

		try:
			live = MFLive(song_list, diff, local_dir=settings.BASE_DIR+'/static/live_json/', perfect_rate=float(PR))
			live_stats = html_view(live, lang=lang).data.replace('http:','').replace('https:','')
			print('Successfully loaded live.')
		except:
			print('Failed to load live.')
			message = {'complete':False, 'msg':strings[lang]['ERR_LIVE']}
			return JsonResponse(message)

		message = {
			'complete': True,
			'live_stats': live_stats,
			'msg': '{0} {1} {2}'.format(strings[lang]['SUCCESS'], song_list, diff)
		}
	else:
		message = {'complete':False, 'msg':strings[lang]['ERR_NONAJAX']}
	return JsonResponse(message)