from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import time, sys, urllib.request, json
from mysite import settings
sys.path.append(settings.BASE_DIR)
from llatb import GameData, Live, DefaultLive, MFLive, TeamBuilder, Team, html_view
from llatb.advanced.team_builder import GemAllocator
from llatb.common.global_var import gem_skill_id_dict
from llatb.skill import CenterSkill

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
	return render(request, 'team_strength.html', context)

def edit_team(request):
	return render(request, 'edit_team.html')

@csrf_exempt
def calculate(request):
    strings = {
        'CN': {
            'DEFAULT': '默认谱面',
            'ERR_LIVE': '载入谱面信息失败...',
            'ERR_PROFILE': '载入用户卡组信息失败...',
            'ERR_AUTOSIS': '自动配宝石失败，请检查卡组是否有与谱面同色的卡牌...',
            'ERR_TEAM': '构造组队失败...',
            'ERR_EXCOND': '应用附加条件失败...',
            'ERR_SOLVE': '求解最佳卡组失败，请检查该色是否有13张卡',
            'ERR_EXPORT': '导出文件失败...',
            'SUCCESS': '队伍强度计算成功，共耗时{0:.2f}秒',
            'SUCCESS_AUTO': '#{0} 宝石分配成功，共耗时{1:.2f}秒',
            'ERR_NONAJAX': '服务器接收请求不是AJAX'
        },
        'EN': {
            'DEFAULT': 'Default',
            'ERR_LIVE': 'Failed to load live notes...',
            'ERR_PROFILE': 'Failed to read user profile...',
            'ERR_AUTOSIS': 'Fail to allocate SIS, team must have at least one card that matches live attribute.',
            'ERR_TEAM': 'Failed to construct team...',
            'ERR_EXCOND': 'Failed to apply extra condition...',
            'ERR_SOLVE': 'Failed to solve optimal SIS allocation...',
            'ERR_EXPORT': 'Failed to export result into other formats...',
            'SUCCESS': 'Team strength calculated, used {0:.2f} secs',
            'SUCCESS_AUTO': '#{0} optimal SIS allocated, used {1:.2f} secs',
            'ERR_NONAJAX': 'The request is not AJAX'
        }
    }
    lang = request.POST['lang']
    if request.is_ajax():
        start_time = time.time()
        song_list, PR = eval(request.POST['song_list']), float(request.POST['perfect_rate'])
        group, attr, diff = [request.POST[x] for x in ['group', 'attribute', 'difficulty']]
        score_up, skill_up = 0.1*float(request.POST['score_up']=='true'), 0.1*float(request.POST['skill_up']=='true')
        unlimit_gem, extra_cond = bool(request.POST['unlimit_gem']=='true'), request.POST['extra_cond']
        auto_mode, json_str = request.POST['auto_mode']=='true', request.POST['user_profile']

        user_info  = 'User IP Address: {0} from {1} page\n'.format(str(get_client_ip(request)), lang)
        user_info += 'Live Info: {0} {1} {2} {3}, P Rate={4}\n'.format(song_list, group, attr, diff, PR)
        user_info += 'ScoreUp={0}, SkillUp={1}, GemUnlimited={2}, ExtraCond={3}, AutoMode={4}'.format(score_up, skill_up, unlimit_gem, extra_cond, auto_mode)
        print(user_info)

        # Load live
        try:
            if strings[lang]['DEFAULT'] not in song_list[0]:
                live = MFLive(song_list, diff, local_dir=settings.BASE_DIR+'/static/live_json/', perfect_rate=PR)
            else:
                song_name = song_list[0].replace(strings[lang]['DEFAULT'], 'Default')
                live = DefaultLive(song_name, diff, perfect_rate=float(PR))
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
        # Solve for optimal SIS allocation or compute the team strength
        try:
            guest_center = request.POST.get('guest_center', 'None')
            if guest_center == 'None':
                guest_cskill = None
            else:
                main_attr = guest_center.split(': ')[0]
                params = guest_center.split(': ')[1].split(' ')
                print(guest_center, params)
                base_attr, main_ratio = params[0], int(params[1][:-1])
                bonus_range, bonus_ratio = ' '.join(params[3:-1]), int(params[-1][:-1])
                guest_cskill = CenterSkill(guest_center, main_attr, base_attr, main_ratio, bonus_range, bonus_ratio)
            opt = {'score_up_bonus':score_up, 'skill_up_bonus':skill_up, 'guest_cskill':guest_cskill}
            tb = TeamBuilder(live, user_profile, opt=opt)

            # Choose alloc method wisely
            temp_dict = dict()
            for x in [live.attr]: 
                temp_dict[x+' Perfume'] = user_profile.owned_gem[x+' Perfume']
                temp_dict[x+' Aura'] = user_profile.owned_gem[x+' Aura']
                temp_dict[x+' Veil'] = user_profile.owned_gem[x+' Veil']
                for y in ['(1st)', '(2nd)', '(3rd)']:
                    temp_dict[x+' Ring '+y] = user_profile.owned_gem[x+' Ring '+y]
                    temp_dict[x+' Cross '+y] = user_profile.owned_gem[x+' Cross '+y]
            for x in ['Princess', 'Angel', 'Empress']:
                temp_dict[x+' Charm'] = user_profile.owned_gem[x+' Charm']
                temp_dict[x+' Heal'] = user_profile.owned_gem[x+' Heal']
                temp_dict[x+' Trick'] = user_profile.owned_gem[x+' Trick']
            alloc_method = 'DC' if min(temp_dict.values()) >= 6 else 'DP'

            if auto_mode:
                try:
                    tb.build_team(K=8, method='1-suboptimal', alloc_method=alloc_method)
                    result = tb.view_result(show_cost=True, lang=lang).data.replace('http:','').replace('https:','')
                except:
                    print('Failed to achieve auto SIS allocation.')
                    message = {'complete':False, 'msg':strings[lang]['ERR_AUTOSIS']}
                    return JsonResponse(message)
            else:
                # Construct team by placing the given SIS
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
                result = tb.team_strength_detail(input_team, show_cost=True).data.replace('http:','').replace('https:','')
                print('Successfully computed team strength details.')
        except:
            print('Failed to compute team strength details.')
            message = {'complete':False, 'msg':strings[lang]['ERR_SOLVE']}
            return JsonResponse(message)
        # Covert result to LL Helper and SIFStats
        try:
            if auto_mode:
                sd_file, ieb_file = tb.best_team.to_LLHelper(None), tb.best_team.to_ieb(None)
            else:
                sd_file, ieb_file = input_team.to_LLHelper(None), input_team.to_ieb(None)
        except:
            print('Failed to export file.')
            message = {'complete':False, 'msg':strings[lang]['ERR_EXPORT']}
            return JsonResponse(message)
        elapsed_time = time.time() - start_time

        if auto_mode:
            counter, _ = Counter.objects.get_or_create()
            counter.TeamCount += 1
            counter.save()
            success_msg = strings[lang]['SUCCESS_AUTO'].format(counter.TeamCount, elapsed_time)
            print('This is the {0}-th built team, computation takes {1:.2f} seconds'.format(counter.TeamCount, elapsed_time))
        else:
            success_msg = strings[lang]['SUCCESS'].format(elapsed_time)

        message = {
            'complete': True,
            'sd_file': sd_file,
            'ieb_file': ieb_file,
            'result': result,
            'msg': success_msg
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
        user_info  = 'User IP Address: {0} from {1} page\n'.format(str(get_client_ip(request)), lang)
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