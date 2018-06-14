from llatb import GameData

user_profile = GameData('packet.txt', file_type='packet')

# Card ID: 1320 is not supported
# Card ID: 1319 is not supported
# Card ID: 1318 is not supported
# Card ID: 1347 is not supported
# 1472: 上原歩夢 SR(t), Pure
# | Level: 80/80 | Bond: 500/500 | Slot: 2/[2-4] | Smile: 2580 | Pure: 4190 | Cool: 2880 | HP:4 |
# Skill - リズミカルチャーム lv1: 36% chance to add 200.0 score points. Triggers every 17 combo.
# Center Skill - ピュアハート: Raise the team's Pure by 6%. 
# Slot Number must be integer within valid range!
# Card ID: 1472 is not supported
# 1473: 宮下愛 SR(t), Smile
# | Level: 80/80 | Bond: 500/500 | Slot: 2/[2-4] | Smile: 4180 | Pure: 2910 | Cool: 2560 | HP:4 |
# Skill - トータルエール lv1: 36% chance to restore 1.0 stamina points. Triggers every 20 notes.
# Center Skill - スマイルハート: Raise the team's Smile by 6%. 
# Slot Number must be integer within valid range!
# Card ID: 1473 is not supported
# 1474: 優木せつ菜 SR(t), Cool
# | Level: 80/80 | Bond: 500/500 | Slot: 2/[2-4] | Smile: 2540 | Pure: 2880 | Cool: 4230 | HP:4 |
# Skill - トータルトリック lv1: 36% chance to slightly raise the accuracy judge for 2.0 seconds. Triggers every 20 notes.
# Center Skill - クールハート: Raise the team's Cool by 6%. 
# Slot Number must be integer within valid range!
# Card ID: 1474 is not supported
# 1473: 宮下愛 SR(t), Smile
# | Level: 80/80 | Bond: 500/500 | Slot: 2/[2-4] | Smile: 4180 | Pure: 2910 | Cool: 2560 | HP:4 |
# Skill - トータルエール lv1: 36% chance to restore 1.0 stamina points. Triggers every 20 notes.
# Center Skill - スマイルハート: Raise the team's Smile by 6%. 
# Slot Number must be integer within valid range!
# Traceback (most recent call last):
#   File "/Users/mengkelian/Documents/LLSIF-Tools/llsifteambuilder/packet_convert.py", line 3, in <module>
#     user_profile = GameData('packet.txt', file_type='packet')
#   File "/Users/mengkelian/Documents/LLSIF-Tools/llsifteambuilder/llatb/importer/game_data.py", line 65, in __init__
#     self.team_list = [ None if deck is None else Team([gen_card(c,equip=True) for c in deck]) for deck in deck_info ]
#   File "/Users/mengkelian/Documents/LLSIF-Tools/llsifteambuilder/llatb/importer/game_data.py", line 65, in <listcomp>
#     self.team_list = [ None if deck is None else Team([gen_card(c,equip=True) for c in deck]) for deck in deck_info ]
#   File "/Users/mengkelian/Documents/LLSIF-Tools/llsifteambuilder/llatb/importer/game_data.py", line 65, in <listcomp>
#     self.team_list = [ None if deck is None else Team([gen_card(c,equip=True) for c in deck]) for deck in deck_info ]
#   File "/Users/mengkelian/Documents/LLSIF-Tools/llsifteambuilder/llatb/importer/game_data.py", line 31, in gen_card
#     card.level_up(*[c[attr] for attr in ['skill_level', 'slot_num', 'level', 'bond']])
#   File "/Users/mengkelian/Documents/LLSIF-Tools/llsifteambuilder/llatb/framework/card.py", line 70, in level_up
#     raise
# RuntimeError: No active exception to reraise
# [Finished in 1.9s with exit code 1]
# [shell_cmd: python -u "/Users/mengkelian/Documents/LLSIF-Tools/llsifteambuilder/packet_convert.py"]
# [dir: /Users/mengkelian/Documents/LLSIF-Tools/llsifteambuilder]
# [path: /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/TeX/texbin:/opt/X11/bin:/Applications/Postgres.app/Contents/Versions/latest/bin]