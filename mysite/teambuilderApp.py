from django.http import HttpResponse
from string import Template
from django.views.decorators.csrf import csrf_exempt
import json, time, sys

from . import settings
sys.path.append(settings.BASE_DIR)
from llatb import GameData, Live, DefaultLive, TeamBuilder, html_view, live_basic_data, update_data
from llatb.framework.live import live_basic_data

author_memo = '''
网页版LLSIF-TeamBuilder考虑到运算量以及稳定性，预设所有吻宝石为9，预备卡组大小为12，使用1-suboptimal DP算法<br/>
寻求更优解请移步<a href="https://github.com/Joshua1989/LLSIF-AutoTeamBuilder">Github源码</a>自行尝试，算法细节请参考<a href="doc">Love Live SIF 卡组强度导论</a>
<br/>
使用方法：1.选择歌曲; 2.从<a href="http://stats.llsif.win/">SIFStats(日服)</a> 或者 <a href="http://pll.sokka.cn/user">LLproxy(国服)</a> 粘贴社员信息卡组Json; 3: 点击calulate按钮
<br/>
注意：在极端情况下（各种宝石都很少）计算可能会比较慢，请耐心等待
'''

html_template = Template('''
$author_memo
<br/><br/>
<form method="post" action="/">
	<div style="position:relative;">
		<div style="position:absolute; left:0%; width:50%;">
			Live:
		    <select name="live" style="width: 200px;" onchange="submit(this)">
			    $live
			</select>
		    <select title="group" name="group" onchange="submit(this)">
		    	$group
			</select>

			<select name="attribute" onchange="submit(this)">
				$attr
			</select>

			<select name="difficulty" onchange="submit(this)">
				$diff
			</select>

			&nbsp;&nbsp;
			Extra Support:
			$boost

			<br/><br/>
			user profile JSON:
			$profile

			<br/><br/>
			<input type="submit" name="calculate" value="calculate" />
		</div>
		<div style="position:absolute; left:60%; width:40%;"> 
			$live_info 
		</div>
	</div>
	<div style="position:absolute; top:70%; left:0%; width:40%;">
		$result
	</div>
</form>''')


@csrf_exempt
def index(request):
	result, live, live_info = '', '', ''
	if 'group' in request.POST and 'attribute' in request.POST and 'difficulty' in request.POST:
		print(request.POST.get('live', 'nolive'))
		group_sel, attr_sel, diff_sel = request.POST['group'], request.POST['attribute'], request.POST['difficulty']
		df_live = live_basic_data[live_basic_data.apply(lambda x: x.group==group_sel and x.attr==attr_sel and x.diff_level==diff_sel, axis=1)]
		group = '\n'.join(['<option value="{0}" {1}>{0}</option>'.format(x, 'selected'*(x==group_sel)) for x in ["μ's", 'Aqours']])
		attr = '\n'.join(['<option value="{0}" {1}>{0}</option>'.format(x, 'selected'*(x==attr_sel)) for x in ['Smile', 'Pure', 'Cool']])
		diff = '\n'.join(['<option value="{0}" {1}>{0}</option>'.format(x, 'selected'*(x==diff_sel)) for x in ['Easy', 'Normal', 'Hard', 'Expert', 'Master']])
		score_up, skill_up = float(request.POST.get('score_up', 0)), float(request.POST.get('skill_up', 0))
		boost = '\n'.join(['<input type="checkbox" name="{0}" value=0.1 {1}> {2}'.format(name.replace(' ','_'), 'checked'*(value>0), name) 
				 			for name, value in zip(['score up', 'skill up'], [score_up, skill_up])])
		profile = '<textarea name="profile" cols="120" rows="20">{0}</textarea>'.format(request.POST['profile'])
		if 'live' in request.POST and request.POST['live'] in df_live['name'].values:
			try:
				live_sel = request.POST['live']
				live = '\n'.join(['<option value="{0}" {1}>{0}</option>'.format(x['name'], 'selected'*(x['name']==live_sel)) for i, x in df_live.iterrows() ])
				live_obj = Live(live_sel, diff_sel, local_dir=settings.BASE_DIR+'/static/live_json/')
				live_info += html_view(live_obj).data
			except:
				print('Did not found live')
		else:
			try:
				live = '\n'.join(['<option value="{0}">{0}</option>'.format(x['name']) for i, x in df_live.iterrows() ])
				live_obj = Live(df_live.iloc[0]['name'], diff_sel, local_dir=settings.BASE_DIR+'/static/live_json/')
				live_info += html_view(live_obj).data
			except:
				print('Did not found live')
		if 'calculate' in request.POST:
			json_str = request.POST['profile']
			try:
				start_time = time.time()
				if 'detail' in json_str:
					user_profile = GameData(json_str, file_type='sokka', string_input=True)
				else:
					user_profile = GameData(json_str, file_type='ieb', string_input=True)
				for x in ['Smile', 'Pure', 'Cool']: user_profile.owned_gem[x+' Kiss'] = 9
				print('finish loading user profile')
				opt = {'score_up_bonus':score_up, 'skill_up_bonus':skill_up, 'guest_cskill':None}
				tb = TeamBuilder(live_obj, user_profile, opt=opt)
				tb.build_team(K=12, method='1-suboptimal', alloc_method='DC')
				elapsed_time = time.time() - start_time
				result += 'Computation takes {0:.2f} seconds'.format(elapsed_time) + tb.view_result(show_cost=True).data
			except:
				print('Error in calculation')
	else:
		group = '\n'.join(['<option value="{0}">{0}</option>'.format(x) for x in ["μ's", 'Aqours']])
		attr = '\n'.join(['<option value="{0}">{0}</option>'.format(x) for x in ['Smile', 'Pure', 'Cool']])
		diff = '\n'.join(['<option value="{0}">{0}</option>'.format(x) for x in ['Easy', 'Normal', 'Hard', 'Expert', 'Master']])
		boost = '\n'.join(['<input type="checkbox" name="{0}" value=0.1> {1}'.format(name.replace(' ','_'), name) for name in ['score up', 'skill up']])
		profile = '<textarea name="profile" cols="120" rows="20"></textarea>'
	return HttpResponse(html_template.substitute(author_memo=author_memo, live=live, group=group, attr=attr, 
												 diff=diff, boost=boost, profile=profile, live_info=live_info, result=result))

