from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import time, sys, urllib.request
from mysite import settings
sys.path.append(settings.BASE_DIR)
from llatb import GameData, Live, DefaultLive, MFLive, TeamBuilder, html_view

from my_log.models import Counter

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
    return ip

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
			'SUCCESS': '组队成功，共耗时{0:.2f}秒',
			'ERR_NONAJAX': '服务器接收请求不是AJAX'
		},
		'EN': {
			'DEFAULT': 'Default',
			'ERR_LIVE': 'Failed to load live notes...',
			'ERR_PROFILE': 'Failed to read user profile...',
			'ERR_EXCOND': 'Failed to apply extra condition...',
			'ERR_SOLVE': 'Failed to solve optimal team, please check whether there are at least 13 cards have current attribute',
			'ERR_EXPORT': 'Failed to export result into other formats...',
			'SUCCESS': 'Team builded, used {0:.2f} secs',
			'ERR_NONAJAX': 'The request is not AJAX'
		}
	}
	lang = request.POST['lang']
	if request.is_ajax():
		start_time = time.time()
		song_list, PR = eval(request.POST['song_list']), float(request.POST['perfect_rate'])
		group, attr, diff = [request.POST[x] for x in ['group', 'attribute', 'difficulty']]
		score_up, skill_up = 0.1*float(request.POST['score_up']=='true'), 0.1*float(request.POST['skill_up']=='true')
		unlimit_gem, extra_cond, json_str = bool(request.POST['unlimit_gem']=='true'), request.POST['extra_cond'], request.POST['user_profile']

		user_info  = 'User IP Address: {0}\n'.format(str(get_client_ip(request)))
		user_info += 'Live Info: {0} {1} {2} {3}, P Rate={4}\n'.format(song_list, group, attr, diff, PR)
		user_info += 'ScoreUp={0}, SkillUp={1}, GemUnlimited={2}, ExtraCond={3}'.format(score_up, skill_up, unlimit_gem, extra_cond)
		print(user_info)

		# Load live
		try:
			if strings[lang]['DEFAULT'] not in song_list[0]:
				live = MFLive(song_list, diff, local_dir=settings.BASE_DIR+'/static/live_json/', perfect_rate=PR)
				live_stats = html_view(live, lang='CN').data
			else:
				song_name = song_list[0].replace(strings[lang]['DEFAULT'], 'Default')
				live = DefaultLive(song_name, diff, perfect_rate=float(PR))
				live_stats = 'NA'
			print('Successfully loaded live.')
		except:
			print('Failed to load live.')
			message = {'complete':False, 'msg':strings[lang]['ERR_LIVE']}
			return JsonResponse(message)
		# Load user profile
		try:
			if 'detail' in json_str:
				user_profile = GameData(json_str, file_type='sokka', string_input=True)
			else:
				user_profile = GameData(json_str, file_type='ieb', string_input=True)
			print('Successfully loaded user profile.')
		except:
			print('Failed to load user profile.')
			message = {'complete':False, 'msg':strings[lang]['ERR_PROFILE']}
			return JsonResponse(message)
		# Modify user profile
		try:
			if extra_cond == 'current_max':
				for i, card in user_profile.raw_card.items():
					card.idolize(idolized=card.idolized, reset_slot=False)
			elif extra_cond == 'idolized_max':
				for i, card in user_profile.raw_card.items():
					card.idolize(idolized=True, reset_slot=False)
			elif extra_cond == 'ultimate':
				for i, card in user_profile.raw_card.items():
					card.idolize(idolized=True)
					card.slot_num = card.max_slot_num
					if card.skill is not None:
						card.skill.level = 8
			if unlimit_gem:
				for x in list(user_profile.owned_gem.keys()):
					user_profile.owned_gem[x] = 9
			else:
				for x in ['Smile', 'Pure', 'Cool']: 
					user_profile.owned_gem[x+' Kiss'] = 9
			if extra_cond != 'default':
				print('Successfully applied extra condition.')
		except:
			print('Failed to apply extra condition.')
			message = {'complete':False, 'msg':strings[lang]['ERR_EXCOND']}
			return JsonResponse(message)
		# Solve for optimal team
		try:
			opt = {'score_up_bonus':score_up, 'skill_up_bonus':skill_up, 'guest_cskill':None}
			tb = TeamBuilder(live, user_profile, opt=opt)
			tb.build_team(K=12, method='1-suboptimal', alloc_method='DC' if unlimit_gem else 'DP')
			result = tb.view_result(show_cost=True, lang=lang).data
		except:
			print('Failed to compute optimal team.')
			message = {'complete':False, 'msg':strings[lang]['ERR_SOLVE']}
			return JsonResponse(message)
		# Covert result to LL Helper and SIFStats
		sd_file, ieb_file = tb.best_team.to_LLHelper(None), tb.best_team.to_ieb(None)
		try:
			sd_file, ieb_file = tb.best_team.to_LLHelper(None), tb.best_team.to_ieb(None)
		except:
			print('Failed to export file.')
			message = {'complete':False, 'msg':strings[lang]['ERR_EXPORT']}
			return JsonResponse(message)
		elapsed_time = time.time() - start_time

		counter, _ = Counter.objects.get_or_create()
		counter.TeamCount += 1
		counter.save()
		message = {
			'complete': True,
			'counter': counter.TeamCount,
			'sd_file': sd_file,
			'ieb_file': ieb_file,
			'live_stats': live_stats,
			'result': result,
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
	lang = request.POST['lang']
	if request.is_ajax():
		song_name, diff, PR = request.POST['song_name'], request.POST['difficulty'], request.POST['perfect_rate']
		user_info  = 'User IP Address: {0}\n'.format(str(get_client_ip(request)))
		user_info += 'View Live Info: {0} {1}'.format(song_name, diff)
		print(user_info)

		try:
			live = Live(song_name, diff, local_dir=settings.BASE_DIR+'/static/live_json/', perfect_rate=float(PR))
			live_stats = html_view(live, lang=lang).data
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

def receive_user_json(request):
	return render(request, 'receive_user_json.html')

def LLproxy_user_json(request):
	return render(request, 'LLproxy_user_json.html')