from django.http import HttpResponse
from string import Template
from django.views.decorators.csrf import csrf_exempt
import json, time, sys, urllib.request

from . import settings
sys.path.append(settings.BASE_DIR)
import llatb
from llatb import GameData, Live, DefaultLive, TeamBuilder, html_view, live_basic_data, update_data
from llatb.framework.live import live_basic_data

author_memo = '''
<p style="text-align:left">
<img src="http://pic.xiami.net/images/avatar_new/49/2486368_1419132611.jpeg@1e_1c_0i_1o_100Q_200w.jpg" height=60 style="display:inline;vertical-align: middle;">
Nyan~ 欢迎使用网页版LLSIF-AutoTeamBuilder全自动组卡器，目前已帮助大家成功组卡{0}队
<br/><br/>
网页版LLSIF-AutoTeamBuilder考虑到运算量以及稳定性，预设所有吻宝石为9，预备卡组大小为12，使用1-suboptimal DP算法。
<br/>
在以上设定下<span style="color:red">并不能保证找到最优解</span>，但是期望得分大多数情况只比最优解少1000分以内。
<br/>
寻求更优解请移步<a href="https://github.com/Joshua1989/LLSIF-AutoTeamBuilder">Github源码</a>自行尝试，算法细节请参考<a href="doc">Love Live SIF 卡组强度导论</a>。
<br/><br/>
使用方法: 1.选择歌曲; 2.从<a href="http://stats.llsif.win/">SIFStats(日服)</a> 或者 <a href="http://pll.sokka.cn/user">LLproxy(国服)</a> 粘贴社员信息卡组Json; 3: 点击calulate按钮
<br/>
如果发现疑似bug请到<a href="https://tieba.baidu.com/p/5212387940">贴吧发布帖</a>进行反馈，说明具体问题并注明组卡时的<span style="color:red">所有设置</span>。
<br/><br/>
Remark 1: 在极端情况下（各种宝石都很少）计算可能会比较慢，请耐心等待。
<br/>
Remark 2: 由于美服并没有类似数据站，Github代码提供了虽然从tshark抓包导入用户卡组的功能，但是由于抓包中<span style="color:red">含有账户信息</span>所以考虑到安全问题网页版暂不支持该格式。
</p>
'''

html_template = Template('''
<title>LLSIF-AutoTeamBuilder</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="shortcut icon" href="/static/favicon.ico">
<link rel="apple-touch-icon" href="/static/apple-touch-icon.png" />
$author_memo
<form method="post" action="/">
	<table>
	<tbody>
		<tr>
			<td>
				Live:
			    <select name="live" style="width: 200px;" onchange="submit(this)">
			    	<option value="Default">默认谱面</option>
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

				<br/>
				购买应援:
				$boost

				<span style="display:inline-block; width: 30px;"></span>
				预设P率:
				$perfect_rate

				<br/>
				用户卡组信息 JSON:
				<br/>
				$profile

				<br/><br/>
				<input type="submit" name="calculate" value="calculate" />
				<span style="display:inline-block; width: 30px;"></span>
				$timing
			</td>
			<td> 
				$live_info 
			</td>
		</div>
		</tr>
		<tr>
			$result
		</tr>
		$output_file
	</tbody>
	</table>
</form>''')


@csrf_exempt
def index(request):
	result, live, live_info, timing, output_file = '', '', '', '', llatb.config.html_template.format('')
	count = open(settings.BASE_DIR+'/static/count.txt').read()
	if 'group' in request.POST and 'attribute' in request.POST and 'difficulty' in request.POST:
		group_sel, attr_sel, diff_sel = request.POST['group'], request.POST['attribute'], request.POST['difficulty']
		df_live = live_basic_data[live_basic_data.apply(lambda x: x.group==group_sel and x.attr==attr_sel and x.diff_level==diff_sel, axis=1)]
		group = '\n'.join(['<option value="{0}" {1}>{0}</option>'.format(x, 'selected'*(x==group_sel)) for x in ["μ's", 'Aqours']])
		attr = '\n'.join(['<option value="{0}" {1}>{0}</option>'.format(x, 'selected'*(x==attr_sel)) for x in ['Smile', 'Pure', 'Cool']])
		diff = '\n'.join(['<option value="{0}" {1}>{0}</option>'.format(x, 'selected'*(x==diff_sel)) for x in ['Easy', 'Normal', 'Hard', 'Expert', 'Master']])
		score_up, skill_up = float(request.POST.get('score_up', 0)), float(request.POST.get('skill_up', 0))
		boost = '\n'.join(['<input type="checkbox" name="{0}" value=0.1 {1}> {2}'.format(name, 'checked'*(value>0), string) 
				 			for name, value, string in zip(['score_up', 'skill_up'], [score_up, skill_up], ['得分+10%', '技能+10%'])])
		PR = request.POST['perfect_rate']
		perfect_rate = '<input name="perfect_rate" type="number" min="0.01" max="1" step="0.01" value="{0}" />'.format(PR)
		profile = '<textarea name="profile" cols="80" rows="20">{0}</textarea>'.format(request.POST['profile'])

		print('User choice:', request.POST.get('live', 'NO_LIVE'), group_sel, attr_sel, diff_sel, score_up, skill_up)
		if 'live' in request.POST and request.POST['live'] in df_live['name'].values:
			try:
				live_sel = request.POST['live']
				live = '\n'.join(['<option value="{0}" {1}>{0}</option>'.format(x['name'], 'selected'*(x['name']==live_sel)) for i, x in df_live.iterrows() ])
				try:
					live_obj = Live(live_sel, diff_sel, local_dir=settings.BASE_DIR+'/static/live_json/', perfect_rate=float(PR))
				except:
					url = live_basic_data[live_basic_data.apply(lambda x: x['name']==live_sel and x['diff_level']==diff_sel, axis=1)].iloc[0]['file_dir']
					print(live_sel, diff_sel, 'not exists, download from', url)
					opener = urllib.request.URLopener()
					opener.addheader('User-Agent', 'whatever')
					opener.retrieve(url, settings.BASE_DIR+'/static/live_json/'+url.split('/')[-1])
					live_obj = Live(live_sel, diff_sel)
				live_info = html_view(live_obj, lang='CN').data
			except:
				print('Did not find live', live_sel, diff_sel)
				result += 'Did not find live {0} {1}'.format(live_sel, diff_sel)
		else:
			try:
				live = '\n'.join(['<option value="{0}">{0}</option>'.format(x['name']) for i, x in df_live.iterrows() ])
				live_sel = 'Default {0} {1}'.format(group_sel, attr_sel)
				live_obj = DefaultLive(live_sel, diff_sel, perfect_rate=float(PR))
			except:
				print('Did not find live', live_sel, diff_sel)
				result += 'Did not find live {0} {1}'.format(live_sel, diff_sel)
		if 'calculate' in request.POST:
			json_str = request.POST['profile']
			# try:
			start_time = time.time()
			if 'detail' in json_str:
				user_profile = GameData(json_str, file_type='sokka', string_input=True)
			else:
				user_profile = GameData(json_str, file_type='ieb', string_input=True)
			for x in ['Smile', 'Pure', 'Cool']: user_profile.owned_gem[x+' Kiss'] = 9
			print('Finished loading user profile')
			opt = {'score_up_bonus':score_up, 'skill_up_bonus':skill_up, 'guest_cskill':None}
			tb = TeamBuilder(live_obj, user_profile, opt=opt)
			tb.build_team(K=12, method='1-suboptimal', alloc_method='DP')
			elapsed_time = time.time() - start_time

			output_files_template = '''
			</table><table border="1" class="dataframe">
		  	<tbody>
		  		<tr>
			      <td>LL Helper 队伍信息sd文件</td>
			      <td>SIFStats 队伍Json文件</td>
		  		</tr>
			    <tr>
			      <td><textarea name="LLHelper" cols="80" rows="10">{0}</textarea></td>
			      <td><textarea name="SIFState" cols="80" rows="10">{1}</textarea></td>
			    </tr>
			</tbody>
			</table>
		  	'''
			timing += 'Computation takes {0:.2f} seconds. <br/>'.format(elapsed_time) 
			result += tb.view_result(show_cost=True, lang='CN').data
			output_file += output_files_template.format(tb.best_team.to_LLHelper(None), tb.best_team.to_ieb(None))

			count = str(int(count)+1)
			with open(settings.BASE_DIR+'/static/count.txt', 'w') as fp:
				fp.write(count)
	else:
		group = '\n'.join(['<option value="{0}">{0}</option>'.format(x) for x in ["μ's", 'Aqours']])
		attr = '\n'.join(['<option value="{0}">{0}</option>'.format(x) for x in ['Smile', 'Pure', 'Cool']])
		diff = '\n'.join(['<option value="{0}">{0}</option>'.format(x) for x in ['Easy', 'Normal', 'Hard', 'Expert', 'Master']])
		boost = '\n'.join(['<input type="checkbox" name="{0}" value=0.1> {1}'.format(name, string) for name, string in zip(['score_up', 'skill_up'], ['得分+10%', '技能+10%'])])
		perfect_rate = '<input name="perfect_rate" type="number" min="0.01" max="1" step="0.01" value="0.95" />'
		profile = '<textarea name="profile" cols="80" rows="20"></textarea>'
	return HttpResponse(html_template.substitute(author_memo=author_memo.format(count), live=live, group=group, attr=attr, diff=diff, boost=boost, perfect_rate=perfect_rate, 
												 profile=profile, live_info=live_info, timing=timing, result=result, output_file=output_file))

