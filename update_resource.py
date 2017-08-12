from llatb import update_data
from llatb.common.config import card_archive_dir, live_archive_dir, unit_db_dir
from llatb.common.global_var import muse, Aqours
import sqlite3, json, urllib.request
update_data()
# card data
temp = json.loads(open(card_archive_dir).read())
card_info = dict()
for index, card in temp.items():
	if card['member_name'] in muse or card['member_name'] in Aqours:
		card_info[index] = card
		del card_info[index]['stats_list']
		if card_info[index]['skill'] is not None:
			del card_info[index]['skill']['odds_list']
			del card_info[index]['skill']['rewards_list']
with open('static/card_data_base.json', 'w') as fp:
	fp.write('card_info_data = \'{0}\''.format(json.dumps(card_info).replace("'","\\'")))
# uid cid data
uid_cid_dict = {str(k):str(v) for k,v in sqlite3.connect(unit_db_dir).cursor().execute("SELECT unit_id, unit_number FROM unit_m").fetchall()}
for i, x in enumerate(range(1243,1252),1): uid_cid_dict[str(x)] = str(2000+i)
with open('static/uid_cid_dict.json', 'w') as fp:
	fp.write('uid_cid_dict = \'{0}\''.format(json.dumps(uid_cid_dict)))
# live data
live_info = json.loads(open(live_archive_dir).read())
with open('static/live_data_base.json', 'w') as fp:
	fp.write('live_info_data = \'{0}\''.format(json.dumps(live_info).replace("'","\\'")))
# download live json
from pathlib import Path
for item in live_info:
	file_name = 'static/live_json/' + item['file_dir'].split('/')[-1]
	if not Path(file_name).exists():
		opener = urllib.request.URLopener()
		opener.addheader('User-Agent', 'whatever')
		opener.retrieve(item['file_dir'], file_name)