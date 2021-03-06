function sortNumber(a, b) {
    return a - b;
}
// utility for string format
String.prototype.format = function() {
    a = this;
    for (k in arguments) {
        a = a.replace('{' + k + '}', arguments[k]);
    }
    return a;
}

window.ondragstart = function() { return false; }

var img_url = {
    Muse: '//r.llsif.win/assets/image/event/mission/ms_m_type_10.png',
    Aqours: '//r.llsif.win/assets/image/event/mission/ms_m_type_11.png',
    Smile: '//db.loveliv.es/static/img/icon/1.png',
    Pure: '//db.loveliv.es/static/img/icon/2.png',
    Cool: '//db.loveliv.es/static/img/icon/3.png',
    Idolized: '//r.llsif.win/assets/image/ui/common/com_etc_250.png',
};
var member_info = {
    Honoka: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_254.png',
        name: '高坂穂乃果',
        group: 'Muse',
        grade: 2
    },
    Eli: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_255.png',
        name: '絢瀬絵里',
        group: 'Muse',
        grade: 3
    },
    Kotori: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_256.png',
        name: '南ことり',
        group: 'Muse',
        grade: 2
    },
    Umi: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_257.png',
        name: '園田海未',
        group: 'Muse',
        grade: 2
    },
    Rin: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_258.png',
        name: '星空凛',
        group: 'Muse',
        grade: 1
    },
    Maki: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_259.png',
        name: '西木野真姫',
        group: 'Muse',
        grade: 1
    },
    Nozomi: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_260.png',
        name: '東條希',
        group: 'Muse',
        grade: 3
    },
    Hanayo: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_261.png',
        name: '小泉花陽',
        group: 'Muse',
        grade: 1
    },
    Nico: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_262.png',
        name: '矢澤にこ',
        group: 'Muse',
        grade: 3
    },
    Chika: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_105.png',
        name: '高海千歌',
        group: 'Aqours',
        grade: 2
    },
    Riko: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_106.png',
        name: '桜内梨子',
        group: 'Aqours',
        grade: 2
    },
    Kanan: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_107.png',
        name: '松浦果南',
        group: 'Aqours',
        grade: 3
    },
    Dia: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_108.png',
        name: '黒澤ダイヤ',
        group: 'Aqours',
        grade: 3
    },
    You: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_109.png',
        name: '渡辺曜',
        group: 'Aqours',
        grade: 2
    },
    Yoshiko: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_110.png',
        name: '津島善子',
        group: 'Aqours',
        grade: 1
    },
    Hanamaru: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_111.png',
        name: '国木田花丸',
        group: 'Aqours',
        grade: 1
    },
    Mari: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_112.png',
        name: '小原鞠莉',
        group: 'Aqours',
        grade: 3
    },
    Ruby: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_113.png',
        name: '黒澤ルビィ',
        group: 'Aqours',
        grade: 1
    }
}
var group_arr = {
    muse: 'μ\'s',
    Aqours: 'Aqours'
};
var attribute_arr = ['Smile', 'Pure', 'Cool'];
// Load all live basic information
var card_info = JSON.parse(card_info_data);
var rev_dict = {},
    card_bucket = {},
    promo_bucket = {},
    owned_bucket = {};
for (var x in member_info) {
    rev_dict[member_info[x]['name']] = x;
    card_bucket[x] = {};
    promo_bucket[x] = {};
    owned_bucket[x] = {};
    for (var y in attribute_arr) {
        card_bucket[x][attribute_arr[y]] = [];
        promo_bucket[x][attribute_arr[y]] = [];
        owned_bucket[x][attribute_arr[y]] = [];
    }
}
for (var cid in card_info) {
    var CI = card_info[cid];
    var key = rev_dict[CI['member_name']],
        attr = CI['main_attr'];
    if (CI['promo'] || CI['is_limit']) {
        promo_bucket[key][attr].push(cid);
    } else {
        card_bucket[key][attr].push(cid);
    }
}

// Load user team profile, if not create a new one
var default_user_json = '{"unit_info":[],"deck_info":[],"removable_info":{"equipment_info":{},"owning_info":[{"total_amount":9,"unit_removable_skill_id":1},{"total_amount":9,"unit_removable_skill_id":2},{"total_amount":9,"unit_removable_skill_id":3},{"total_amount":9,"unit_removable_skill_id":4},{"total_amount":9,"unit_removable_skill_id":5},{"total_amount":9,"unit_removable_skill_id":6},{"total_amount":9,"unit_removable_skill_id":7},{"total_amount":9,"unit_removable_skill_id":8},{"total_amount":9,"unit_removable_skill_id":9},{"total_amount":9,"unit_removable_skill_id":10},{"total_amount":9,"unit_removable_skill_id":11},{"total_amount":9,"unit_removable_skill_id":12},{"total_amount":9,"unit_removable_skill_id":13},{"total_amount":9,"unit_removable_skill_id":14},{"total_amount":9,"unit_removable_skill_id":15},{"total_amount":9,"unit_removable_skill_id":16},{"total_amount":9,"unit_removable_skill_id":17},{"total_amount":9,"unit_removable_skill_id":18},{"total_amount":9,"unit_removable_skill_id":19},{"total_amount":9,"unit_removable_skill_id":20},{"total_amount":9,"unit_removable_skill_id":21},{"total_amount":9,"unit_removable_skill_id":22},{"total_amount":9,"unit_removable_skill_id":23},{"total_amount":9,"unit_removable_skill_id":24},{"total_amount":9,"unit_removable_skill_id":25},{"total_amount":9,"unit_removable_skill_id":26},{"total_amount":9,"unit_removable_skill_id":27},{"total_amount":9,"unit_removable_skill_id":28},{"total_amount":9,"unit_removable_skill_id":29},{"total_amount":9,"unit_removable_skill_id":30},{"total_amount":9,"unit_removable_skill_id":31},{"total_amount":9,"unit_removable_skill_id":32},{"total_amount":9,"unit_removable_skill_id":33},{"total_amount":9,"unit_removable_skill_id":34},{"total_amount":9,"unit_removable_skill_id":35},{"total_amount":9,"unit_removable_skill_id":36},{"total_amount":9,"unit_removable_skill_id":37},{"total_amount":9,"unit_removable_skill_id":38},{"total_amount":9,"unit_removable_skill_id":39}]}}';
var user_json = JSON.parse(localStorage.getItem("user_json"));
if (user_json == null) {
    user_json = JSON.parse(default_user_json);
    localStorage.setItem("user_json", default_user_json)
}

var team_json = JSON.parse(localStorage.getItem("team_json"));
if (team_json == null) {
    team_json = [0]
    for (var x = 1; x <= 9; x++) {
        team_json.push({
            "level": 100,
            "love": 1000,
            "rank": 2,
            "removable": [],
            "unit_id": 987,
            "unit_skill_level": 1
        })
    }
}
var team_json_bucket = JSON.parse(localStorage.getItem("team_json_bucket"));
if (team_json_bucket == null) {
    team_json_bucket = {}
}

var temp_dict = JSON.parse(uid_cid_dict);
var U2C_dict = {},
    C2U_dict = {};
for (var uid in temp_dict) {
    var u = parseInt(uid),
        c = parseInt(temp_dict[uid]);
    U2C_dict[u] = c;
    C2U_dict[c] = u;
}

var max_level_dict = {
    // Normal unidolized
    false: {
        R: 40,
        SR: 60,
        SSR: 70,
        UR: 80
    },
    // Normal idolized
    true: {
        R: 60,
        SR: 80,
        SSR: 90,
        UR: 100
    }
}
var max_bond_dict = {
    // Unidolized
    false: {
        R: 100,
        SR: 250,
        SSR: 375,
        UR: 500
    },
    // Idolized
    true: {
        R: 200,
        SR: 500,
        SSR: 750,
        UR: 1000
    }
}
var slot_num_dict = {
    promoR: [1, 1],
    promoSR: [1, 1],
    promoUR: [2, 2],
    R: [1, 2],
    SR: [2, 4],
    SSR: [3, 6],
    UR: [4, 8]
}

var sis_cost = {
    Kiss: 1,
    Perfume: 2,
    Ring: 2,
    Cross: 3,
    Aura: 3,
    Veil: 4,
    Charm: 4,
    Heal: 4,
    Trick: 4
}

var gem_skill_id_dict = {
    1: 'Smile Kiss',
    2: 'Pure Kiss',
    3: 'Cool Kiss',
    4: 'Smile Perfume',
    5: 'Pure Perfume',
    6: 'Cool Perfume',
    7: 'Smile Ring (1st)',
    8: 'Pure Ring (1st)',
    9: 'Cool Ring (1st)',
    10: 'Smile Ring (2nd)',
    11: 'Pure Ring (2nd)',
    12: 'Cool Ring (2nd)',
    13: 'Smile Ring (3rd)',
    14: 'Pure Ring (3rd)',
    15: 'Cool Ring (3rd)',
    16: 'Smile Cross (1st)',
    17: 'Pure Cross (1st)',
    18: 'Cool Cross (1st)',
    19: 'Smile Cross (2nd)',
    20: 'Pure Cross (2nd)',
    21: 'Cool Cross (2nd)',
    22: 'Smile Cross (3rd)',
    23: 'Pure Cross (3rd)',
    24: 'Cool Cross (3rd)',
    25: 'Smile Aura',
    26: 'Pure Aura',
    27: 'Cool Aura',
    28: 'Smile Veil',
    29: 'Pure Veil',
    30: 'Cool Veil',
    31: 'Princess Charm',
    32: 'Princess Heal',
    33: 'Princess Trick',
    34: 'Angel Charm',
    35: 'Angel Heal',
    36: 'Angel Trick',
    37: 'Empress Charm',
    38: 'Empress Heal',
    39: 'Empress Trick'
}

var position = [null, 'L1', 'L2', 'L3', 'L4', 'C', 'R4', 'R3', 'R2', 'R1'];
var current_team = {},
    total_cost = Array(10).fill(0);

function init(team_json) {
    for (var x = 1; x <= 9; x++) {
        total_cost[x] = 0;
        var team_card = team_json[x];
        var CI = card_info[U2C_dict[team_card['unit_id']]];
        var rarity = CI['rarity'];
        var slot_limit = slot_num_dict[CI['promo'] ? 'promo' + CI['rarity'] : CI['rarity']];
        var slot_num = 0;
        for (var y in team_card['removable']) {
            var sis_type = gem_skill_id_dict[team_card['removable'][y]].split(' ')[1]
            slot_num += sis_cost[sis_type]
        }
        total_cost[x] = slot_num;
        current_team[x] = {
            level: team_card['level'],
            bond: team_card['love'],
            removable: team_card['removable'],
            unit_id: team_card['unit_id'],
            skill: team_card['unit_skill_level'],
            card_id: U2C_dict[team_card['unit_id']],
            idolized: team_card['rank'] == 2,
            promo: CI['promo'],
            is_limit: CI['is_limit'],
            rarity: CI['rarity'],
            main_attr: CI['main_attr'],
            member_name: CI['member_name']
        }
        if (team_card['unit_removable_skill_capacity'] == undefined) {
            if (slot_num < slot_limit[0]) {
                current_team[x]['slot'] = slot_limit[0];
            } else if (slot_num > slot_limit[1]) {
                current_team[x]['slot'] = slot_limit[1];
            } else {
                current_team[x]['slot'] = slot_num;
            }
        } else {
            current_team[x]['slot'] = team_card['unit_removable_skill_capacity'];
        }
    }
}
init(team_json);

// Info bar
$('#infoBox .exitBtn').click(function() {
    $('#infoBox').hide();
});

function updateInfo(msg, is_error) {
    $("#infoBox").removeClass('w3-pale-green');
    $("#infoBox").removeClass('w3-pale-red');
    if (is_error) {
        $("#infoBox").addClass('w3-pale-red');
    } else {
        $("#infoBox").addClass('w3-pale-green');

    }
    prefix = is_error ? 'ERROR - ' : 'INFO - '
    $("#infoBox span:last").html(prefix + msg);
}

// Member choose
var member_sel = 'Honoka';
$('#member').html("<img src='{0}' alt='{1}'>".format(member_info[member_sel]['url'], member_sel));
$('#member').click(function() {
    $('#chooseMember').show();
    $('body').addClass('modal-open');
});
$('#chooseMember .exitBtn').click(function() {
    $('body').removeClass('modal-open');
    $('#chooseMember').hide();
});
$('#chooseMuse').html("<img src='{0}'>".format(img_url['Muse']))
$('#chooseAqours').html("<img src='{0}'>".format(img_url['Aqours']))
var temp = '';
for (var x in member_info) {
    var group = member_info[x]['group'],
        url = member_info[x]['url'];
    temp += '<div id=\'{0}\' class=\'{1} member\'><img src=\'{2}\' ></div>'.format(x, group, url);
}
$('#chooseMember .w3-container').html(temp);
$('#chooseMember .Muse').show();
$('#chooseMember .Aqours').hide();
$('#chooseMuse').click(function() {
    $('#chooseMember .Muse').show();
    $('#chooseMember .Aqours').hide();
})
$('#chooseAqours').click(function() {
    $('#chooseMember .Muse').hide();
    $('#chooseMember .Aqours').show();
})
$('#chooseMember .member').click(function() {
    member_sel = this.id;
    $('#chooseMember').hide();
    $('#member').html("<img src='{0}' alt='{1}'>".format(member_info[member_sel]['url'], member_sel));
    updateInfo('Choose member as {0}'.format(member_info[member_sel]['name']));
    showCardPond();
    $('body').removeClass('modal-open');
})

// Display all filtered card
function icon_path(cid, idolized) {
    return '//gitcdn.xyz/repo/iebb/SIFStatic/master/icon/{0}/{1}.png'.format(idolized ? 'rankup' : 'normal', cid);
}

var CI_sel = undefined;

function showCardPond() {
    CI_sel = undefined;
    var id_list = []
    for (var x in card_bucket[member_sel][attr_sel]) {
        id_list.push(card_bucket[member_sel][attr_sel][x])
    }
    if (idolized_sel) {
        for (var x in promo_bucket[member_sel][attr_sel]) {
            id_list.push(promo_bucket[member_sel][attr_sel][x])
        }
    }
    // id_list.sort(sortNumber)
    var temp = ''
    for (var x in id_list) {
        var cid = id_list[x];
        temp += '<div class=\'icon\'><div class=\'stats_bar\'>{0}</div><img src=\'{1}\' alt=\'icon-{2}\'></div>'.format(cid, icon_path(cid, idolized_sel), cid)
    }
    $('#pond').html(temp);
    $("#pond .icon img").each(function(index) {
        $(this).on("click", function() {
            var cid = parseInt($(this).attr('alt').replace('icon-', ''));
            CI_sel = card_info[cid];
            CI_sel['idolized'] = idolized_sel;
            $('#pond .icon img').removeClass('selected')
            $(this).addClass('selected')
            updateInfo(' Select card {0} for replacement'.format(CI_sel['card_id']));
        })
    })
}

function showTeam(init) {
    var temp = '<td>Icon</td>'
    for (var x = 1; x <= 9; x++) {
        var CI = current_team[x];
        var stats_str = '{0}/{1}/{2}/{3}'.format(CI['slot'], CI['skill'], CI['level'], CI['bond']);
        temp += '<td><div class=\'icon\'><div class=\'stats_bar\'>{2}</div><img src=\'{0}\' alt=\'team-{1}\'></div></td>'.format(icon_path(CI['card_id'], CI['idolized']), x, stats_str);
    }
    temp += '<td>Icon</td>'
    $('#team-icon').html(temp);
    $("#team-icon img").each(function(index) {
        $(this).on("click", function() {
            $('#editCard').show();
            $('body').addClass('modal-open');
            var team_id = $(this).attr('alt').replace('team-', '');
            prepareEditModal(team_id);
        })
    })

    if (init) {
        for (var sis_type in sis_cost) {
            var temp = "<td>{0}</td>".format(sis_type)
            for (var x = 1; x <= 9; x++) {
                temp += "<td class='sis-check'><input type='checkbox' class='{0}'></td>".format('pos-' + x)
            }
            temp += "<td>{0}</td>".format(sis_type);
            $('#sis-' + sis_type).html(temp);
            for (var x = 1; x <= 9; x++) {
                for (var y in current_team[x]['removable']) {
                    var sis_type = gem_skill_id_dict[current_team[x]['removable'][y]].split(' ')[1];
                    $('#sis-' + sis_type + ' .pos-' + x).prop('checked', true);
                }
            }
        }
        $('.sis-check').click(function() {
            var checkbox = $(this).find("input"),
                sis_type = $(this).parent().attr('id').split('-')[1];
            var pos = checkbox.attr('class').split('-')[1];
            if (checkbox.prop("checked")) {
                total_cost[pos] -= sis_cost[sis_type];
            } else {
                total_cost[pos] += sis_cost[sis_type];
            }
            if (total_cost[pos] > current_team[pos]['slot']) {
                $('#header-' + pos).css('background-color', 'red');
            } else {
                $('#header-' + pos).css('background-color', 'grey');
            }
            checkbox.prop("checked", !checkbox.prop("checked"));
        }).children().click(function(e) {
            e.stopPropagation();
        });
        $('.sis-check input').click(function(e) {
            var checkbox = $(this),
                sis_type = $(this).parent().parent().attr('id').split('-')[1];
            var pos = checkbox.attr('class').split('-')[1];
            if (checkbox.prop("checked")) {
                total_cost[pos] += sis_cost[sis_type];
            } else {
                total_cost[pos] -= sis_cost[sis_type];
            }
            if (total_cost[pos] > current_team[pos]['slot']) {
                $('#header-' + pos).css('background-color', 'red');
            } else {
                $('#header-' + pos).css('background-color', 'grey');
            }
        })
        for (var pos = 1; pos <= 9; pos++) {
            if (total_cost[pos] > current_team[pos]['slot']) {
                $('#header-' + pos).css('background-color', 'red');
            } else {
                $('#header-' + pos).css('background-color', 'grey');
            }
        }
    }
}
showTeam(true);

// Edit card modal
temp = '';
for (var x = 1; x <= 8; x++) {
    temp += '<button id=\'slot-{0}\'>{1}</button>'.format(x, x);
}
$('#editSlotNum').html(temp);
temp = '';
for (var x = 1; x <= 8; x++) {
    temp += '<button id=\'skill-{0}\'>{1}</button>'.format(x, x);
}
$('#editSkillLevel').html(temp);

for (var x = 1; x <= 8; x++) {
    $('#slot-' + x).click(function() {
        for (var y = 1; y <= 8; y++) {
            $('#slot-' + y).removeClass('checked');
        }
        $(this).addClass('checked')
    })
    $('#skill-' + x).click(function() {
        for (var y = 1; y <= 8; y++) {
            $('#skill-' + y).removeClass('checked');
        }
        $(this).addClass('checked')
    })
}

function prepareEditModal(team_id) {
    var CI = current_team[team_id];
    $('#editTitle').text('cid: {0}, position: {1}'.format(CI['card_id'], position[team_id]));
    $('#editTitle').attr('alt', team_id);
    $('#editLevel').attr('max', max_level_dict[CI['idolized']][CI['rarity']]);
    $('#editLevel').val(CI['level']);
    $('#editBond').attr('max', max_bond_dict[CI['idolized']][CI['rarity']]);
    $('#editBond').val(CI['bond']);
    var slot_limit = slot_num_dict[CI['promo'] ? 'promo' + CI['rarity'] : CI['rarity']];
    for (var x = 1; x <= 8; x++) {
        $('#slot-' + x).show();
        $('#slot-' + x).removeClass('checked');
        if (x < slot_limit[0] || x > slot_limit[1]) {
            $('#slot-' + x).hide();
        }
        if (x == CI['slot']) {
            $('#slot-' + x).addClass('checked');
        }
    }
    for (var x = 1; x <= 8; x++) {
        $('#skill-' + x).show();
        $('#skill-' + x).removeClass('checked');
        if (x == CI['skill']) {
            $('#skill-' + x).addClass('checked');
        }
    }
    var temp_idolized = CI['idolized'];
    if (CI['idolized']) {
        $('#editIdolization').removeClass('w3-green');
        $('#editIdolization').addClass('w3-red');
        $('#editIdolization').text('Idolized');
    } else {
        $('#editIdolization').removeClass('w3-red');
        $('#editIdolization').addClass('w3-green');
        $('#editIdolization').text('Unidolized');
    }
    $('#editIdolization').click(function() {
        temp_idolized = !temp_idolized;
        $('#editLevel').attr('max', max_level_dict[temp_idolized][CI['rarity']]);
        $('#editLevel').val(max_level_dict[temp_idolized][CI['rarity']]);
        $('#editBond').attr('max', max_bond_dict[temp_idolized][CI['rarity']]);
        $('#editBond').val(max_bond_dict[temp_idolized][CI['rarity']]);
        if (temp_idolized) {
            $(this).removeClass('w3-green');
            $(this).addClass('w3-red');
            $(this).text('Idolized');
        } else {
            $(this).removeClass('w3-red');
            $(this).addClass('w3-green');
            $(this).text('Unidolized');
        }
    })
    $('#editOK').off('click').click(function() {
        if (!$('#editLevel').is(':valid') || !$('#editBond').is(':valid')) {
            alert('Lv or bond out of range.')
            return
        }
        var team_id = parseInt($('#editTitle').attr('alt'));
        var CI = current_team[team_id];
        CI['level'] = parseInt($('#editLevel').val());
        CI['bond'] = parseInt($('#editBond').val());
        CI['slot'] = parseInt($('button[id^=slot-][class=checked]').text());
        CI['skill'] = parseInt($('button[id^=skill-][class=checked]').text());
        CI['idolized'] = temp_idolized;
        $('#editCard').hide();
        $('body').removeClass('modal-open');
        showTeam();
        if (total_cost[team_id] > current_team[team_id]['slot']) {
            $('#header-' + team_id).css('background-color', 'red');
        } else {
            $('#header-' + team_id).css('background-color', 'grey');
        }
        var stats_str = '{0}/{1}/{2}/{3}'.format(CI['slot'], CI['skill'], CI['level'], CI['bond']);
        var idol_str = CI['idolized'] ? 'Idolized' : 'Unidolized';
        updateInfo('Position {1}: CID {0} change data to {2} {3}'.format(CI['card_id'], position[team_id], idol_str, stats_str));
    })
    $('#editCancel').click(function() {
        $('#editCard').hide();
        $('body').removeClass('modal-open');
    })
    $('#replaceCard').off('click').click(function(e) {
        if (CI_sel == undefined) {
            alert('You should select the card for replacement first.');
            return
        }
        var team_id = parseInt($('#editTitle').attr('alt'));
        var rarity = CI_sel['rarity'];
        var slot_limit = slot_num_dict[CI_sel['promo'] ? 'promo' + CI_sel['rarity'] : CI_sel['rarity']];
        var slot_num = 0;
        var CI = {
            level: max_level_dict[idolized_sel][CI_sel['rarity']],
            bond: max_bond_dict[idolized_sel][CI_sel['rarity']],
            removable: [],
            unit_id: C2U_dict[CI_sel['card_id']],
            skill: 1,
            slot: slot_limit[0],
            card_id: CI_sel['card_id'],
            idolized: idolized_sel,
            promo: CI_sel['promo'],
            rarity: CI_sel['rarity'],
            main_attr: CI_sel['main_attr'],
            member_name: CI_sel['member_name']
        }

        current_team[team_id] = CI;
        var stats_str = '{0}/{1}/{2}/{3}'.format(CI['slot'], CI['skill'], CI['level'], CI['bond']);
        var idol_str = CI['idolized'] ? 'Idolized' : 'Unidolized';
        $('#editCard').hide();
        $('body').removeClass('modal-open');
        showTeam();

        if (total_cost[team_id] > current_team[team_id]['slot']) {
            $('#header-' + team_id).css('background-color', 'red');
        } else {
            $('#header-' + team_id).css('background-color', 'grey');
        }
        updateInfo('Position {1}: replace to CID {0} {2} {3}'.format(CI['card_id'], position[team_id], idol_str, stats_str));
    })
}

// Swap card position
var swap_from_pos = undefined;
$("th[id^=\'header-\']").click(function() {
    if (swap_from_pos == undefined) {
        swap_from_pos = $(this).attr('id').split('-')[1];
        $(this).css('color', 'rgb(0,255,0)');
        updateInfo('Choose {0} to swap positions'.format(position[swap_from_pos]), false);
    } else {
        var swap_to_pos = $(this).attr('id').split('-')[1]
        $('#header-' + swap_from_pos).css('color', 'white')
        updateInfo('Swapped positions {0} and {1}'.format(position[swap_from_pos], position[swap_to_pos]), false);

        // Swap icons
        var from_icon = $('#team-icon .icon img[alt=team-{0}]'.format(swap_from_pos)).parent(),
            to_icon = $('#team-icon .icon img[alt=team-{0}]'.format(swap_to_pos)).parent();
        var temp = from_icon.html();
        from_icon.html(to_icon.html());
        to_icon.html(temp);

        // Swap alt of img
        from_icon = $('#team-icon .icon img[alt=team-{0}]'.format(swap_from_pos));
        to_icon = $('#team-icon .icon img[alt=team-{0}]'.format(swap_to_pos));
        from_icon.attr('alt', 'team-' + swap_to_pos)
        to_icon.attr('alt', 'team-' + swap_from_pos)

        // Swap SIS check boxes
        for (var sis_type in sis_cost) {
            var from_ckb = $('#sis-' + sis_type + ' .pos-' + swap_from_pos),
                to_ckb = $('#sis-' + sis_type + ' .pos-' + swap_to_pos);
            temp = from_ckb.is(':checked');
            from_ckb.prop('checked', to_ckb.is(':checked'));
            to_ckb.prop('checked', temp);
        }

        // Swap variables
        temp = current_team[swap_from_pos];
        current_team[swap_from_pos] = current_team[swap_to_pos];
        current_team[swap_to_pos] = temp;

        temp = total_cost[swap_from_pos];
        total_cost[swap_from_pos] = total_cost[swap_to_pos];
        total_cost[swap_to_pos] = temp;

        // Swap SIS warning status
        if (total_cost[swap_from_pos] > current_team[swap_from_pos]['slot']) {
            $('#header-' + swap_from_pos).css('background-color', 'red');
        } else {
            $('#header-' + swap_from_pos).css('background-color', 'grey');
        }

        if (total_cost[swap_to_pos] > current_team[swap_to_pos]['slot']) {
            $('#header-' + swap_to_pos).css('background-color', 'red');
        } else {
            $('#header-' + swap_to_pos).css('background-color', 'grey');
        }

        // Redefine click event for icons
        $("#team-icon img").each(function(index) {
            $(this).on("click", function() {
                $('#editCard').show();
                $('body').addClass('modal-open');
                var team_id = $(this).attr('alt').replace('team-', '');
                prepareEditModal(team_id);
            })
        })

        // Clear swap operation
        swap_from_pos = undefined;
    }
})

// Attribute switch
var attr_sel = 'Smile';
var idolized_sel = false;
for (var x in attribute_arr) {
    var attr = attribute_arr[x];
    $('#attr' + attr).html("<img src='{0}' alt='{1}'>".format(img_url[attr], group_arr[attr]));
}
$('#attrSmile').click(function() {
    switchColor('Smile');
});
$('#attrPure').click(function() {
    switchColor('Pure');
});
$('#attrCool').click(function() {
    switchColor('Cool');
});

function switchColor(attr, no_print) {
    for (var x in attribute_arr) {
        $('#attr' + attribute_arr[x] + ' img').addClass('w3-grayscale-max');
    }
    $('#attr' + attr + ' img').removeClass('w3-grayscale-max');
    attr_sel = attr;
    if (!no_print) {
        updateInfo('Choose attribute as {0}'.format(attr_sel), false);
    }
    showCardPond();
}
switchColor(attr_sel);

// Idolized switch
$('#idolized').html("<img src='{0}' alt='{1}' class='w3-grayscale-max'>".format(img_url['Idolized'], 'Idolized'));
$('#idolized').click(function() {
    idolized_sel = !idolized_sel;
    $('#idolized img').addClass('w3-grayscale-max');
    if (idolized_sel) {
        $('#idolized img').removeClass('w3-grayscale-max');
    }
    updateInfo('Choose idolization as {0}'.format(idolized_sel ? 'Idolized' : 'Unidolized'), false);
    showCardPond();
})

// Edit SIS owning info
var gem_EN = {
    Perfume: 'Perfume',
    Ring: 'Ring',
    Cross: 'Cross',
    Aura: 'Aura',
    Veil: 'Veil',
    Charm: 'Charm',
    Heal: 'Heal',
    Trick: 'Trick'
}
$('#editGem').click(function() {
    $('#editGemModal').show();
    $('body').addClass('modal-open');
})
$('#exitEditGem').click(function() {
    var is_valid = true;
    for (gem_id in gem_skill_id_dict) {
        if (gem_id > 3) {
            is_valid &= $('#gem-' + gem_id + ' input').is(':valid');
        }
    }
    if (!is_valid) {
        alert('SIS number should be a non-negative integer,')
        return
    }
    for (gem_id in gem_skill_id_dict) {
        if (gem_id > 3) {
            user_json['removable_info']['owning_info'][gem_id - 1] = {
                total_amount: parseInt($('#gem-' + gem_id + ' input').val()),
                unit_removable_skill_id: parseInt(gem_id)
            }
        } else {
            user_json['removable_info']['owning_info'][gem_id - 1] = {
                total_amount: 1,
                unit_removable_skill_id: parseInt(gem_id)
            }
        }
    }
    $('#editGemModal').hide();
    $('body').removeClass('modal-open');
    updateInfo('SIS owning number updated.')
})

var own_gem = {};
for (var gem_id = 4; gem_id <= 39; gem_id++) {
    var attr = gem_skill_id_dict[gem_id].split(' ')[0].replace('Princess', 'Smile').replace('Angel', 'Pure').replace('Empress', 'Cool');
    var subnames = gem_skill_id_dict[gem_id].split(' ').slice(1);
    var name = subnames.length == 1 ? gem_EN[subnames[0]] : gem_EN[subnames[0]] + ' ' + subnames[1]
    var number = 0;
    own_gem[gem_id] = "<div id='gem-{0}' class='gemNum {1}'><div>{2}</div><input class='w3-input' type='number' min='0' step='1' value='{3}' required='required'></div>".format(gem_id, attr, name, number);
}
for (var x in user_json['removable_info']['owning_info']) {
    var gem_id = user_json['removable_info']['owning_info'][x]['unit_removable_skill_id'];
    var number = user_json['removable_info']['owning_info'][x]['total_amount'];
    if (gem_id > 3) {
        var attr = gem_skill_id_dict[gem_id].split(' ')[0].replace('Princess', 'Smile').replace('Angel', 'Pure').replace('Empress', 'Cool');
        var subnames = gem_skill_id_dict[gem_id].split(' ').slice(1);
        var name = subnames.length == 1 ? gem_EN[subnames[0]] : gem_EN[subnames[0]] + ' ' + subnames[1]
        own_gem[gem_id] = "<div id='gem-{0}' class='gemNum {1}'><div>{2}</div><input class='w3-input' type='number' min='0' step='1' value='{3}' required='required'></div>".format(gem_id, attr, name, number);
    }
}
var temp = '';
for (var gem_id = 4; gem_id <= 39; gem_id++) {
    temp += own_gem[gem_id];
}
$('#editGemModal .w3-container').html(temp);

$('#editGemModal .w3-container').addClass('w3-red');
$('#editGemModal .Pure').hide();
$('#editGemModal .Cool').hide();
$('#smileGem').click(function() {
    $('#editGemModal .w3-container').removeClass('w3-green');
    $('#editGemModal .Pure').hide();
    $('#editGemModal .w3-container').removeClass('w3-blue');
    $('#editGemModal .Cool').hide();
    $('#editGemModal .w3-container').addClass('w3-red');
    $('#editGemModal .Smile').show();
})
$('#pureGem').click(function() {
    $('#editGemModal .w3-container').removeClass('w3-red');
    $('#editGemModal .Smile').hide();
    $('#editGemModal .w3-container').removeClass('w3-blue');
    $('#editGemModal .Cool').hide();
    $('#editGemModal .w3-container').addClass('w3-green');
    $('#editGemModal .Pure').show();
})
$('#coolGem').click(function() {
    $('#editGemModal .w3-container').removeClass('w3-red');
    $('#editGemModal .Smile').hide();
    $('#editGemModal .w3-container').removeClass('w3-green');
    $('#editGemModal .Pure').hide();
    $('#editGemModal .w3-container').addClass('w3-blue');
    $('#editGemModal .Cool').show();
})

var grade_dict = {},
    rev_sis_dict = {},
    grade_str = { 1: '(1st)', 2: '(2nd)', 3: '(3rd)' },
    attr2_dict = { Smile: 'Princess', Pure: 'Angel', Cool: 'Empress' };
for (var x in member_info) {
    grade_dict[member_info[x]['name']] = member_info[x]['grade'];
}
for (var x in gem_skill_id_dict) {
    rev_sis_dict[gem_skill_id_dict[x]] = x;
}

// Check validity of a team
function team_validation() {
    var total_cost = Array(10).fill(0);
    for (var x = 1; x <= 9; x++) {
        for (var sis_type in sis_cost) {
            if ($('#sis-' + sis_type + ' .pos-' + x).is(':checked')) {
                total_cost[x] += sis_cost[sis_type]
            }
        }
    }
    var invalid_pos = [];
    for (var x = 1; x <= 9; x++) {
        if (total_cost[x] > current_team[x]['slot']) {
            invalid_pos.push(position[x])
        }
    }
    if (invalid_pos.length > 0) {
        alert('SIS exceeds slot number for positions ' + invalid_pos.join(', '));
        return false;
    }
    var main_attr = current_team[5]['main_attr'];
    for (var x = 1; x <= 9; x++) {
        var equipped_sis = []
        for (var sis_type in sis_cost) {
            if ($('#sis-' + sis_type + ' .pos-' + x).is(':checked')) {
                var sis_name;
                if (sis_type == 'Kiss' | sis_type == 'Perfume' | sis_type == 'Aura' | sis_type == 'Veil') {
                    sis_name = main_attr + ' ' + sis_type;
                } else if (sis_type == 'Ring' | sis_type == 'Cross') {
                    sis_name = main_attr + ' ' + sis_type + ' ' + grade_str[grade_dict[current_team[x]['member_name']]];
                } else if (sis_type == 'Charm' | sis_type == 'Heal' | sis_type == 'Trick') {
                    sis_name = attr2_dict[current_team[x]['main_attr']] + ' ' + sis_type
                }
                equipped_sis.push(parseInt(rev_sis_dict[sis_name]))
            }
        }
        team_json[x] = {
            "level": current_team[x]['level'],
            "love": current_team[x]['bond'],
            "rank": 1 + current_team[x]['idolized'],
            "removable": equipped_sis,
            "unit_id": current_team[x]['unit_id'],
            "unit_skill_level": current_team[x]['skill'],
            "unit_removable_skill_capacity": current_team[x]['slot']
        }
    }
    return true;
}

// Save team
$('#saveTeam').click(function() {
    if (!team_validation()) return;
    localStorage.setItem('team_json', JSON.stringify(team_json));
    localStorage.setItem('team_json_bucket', JSON.stringify(team_json_bucket));
    localStorage.setItem('user_json', JSON.stringify(user_json));
    updateInfo('Saved current settings to user profile JSON', false);
});

// Update click event
function create_team_unit(team_name) {
    var $new_li = $("<li class='team-unit' data-name='{0}'></li>".format(team_name));
    var content = '<a href="javascript:;" class="team-name">{0}</a>'.format(team_name);
    content += '<a href="javascript:;" class="team-delete"><i class="material-icons">delete</i></a>';
    content += '<a href="javascript:;" class="team-update"><i class="material-icons">save</i></a>';
    $new_li.html(content);
    $('#team-units').prepend($new_li);

    $('.team-name').off('click').click(function() {
        var name = $(this).parent().attr('data-name');
        team_json = team_json_bucket[name];
        init(team_json);
        showTeam(true);
    });
    $('.team-update').off('click').click(function() {
        var name = $(this).parent().attr('data-name');
        if (!team_validation()) return;
        team_json_bucket[name] = team_json;
    });
    $('.team-delete').off('click').click(function() {
        var name = $(this).parent().attr('data-name');
        delete team_json_bucket[name];
        $(this).parent().detach();
    });
}

for (var x in team_json_bucket) {
    create_team_unit(x)
}

// Add new team
$('#add-team').click(function() {
    if (!team_validation()) return;
    var name = $('#new-team-name').val() == '' ? new Date().toLocaleString().replace(',', '') : $('#new-team-name').val();
    if (team_json_bucket[name] == undefined) {
        create_team_unit(name);
        team_json_bucket[name] = JSON.parse(JSON.stringify(team_json));
        updateInfo('Add new team {0}'.format(name), false);
    } else {
        team_json_bucket[name] = team_json;
        updateInfo('Update existing team {0}'.format(name), false);
    }
});

// Import team from screen shot
function showImageImportResult(image_team_info) {
    for (var x = 1; x <= 9; x++) {
        var card_id = image_team_info[x - 1].cardid,
            idolized = image_team_info[x - 1].mezame > 0;
        var CI = card_info[card_id];
        if (CI == undefined) {
            alert('There is an detection error, or there is N card in team');
            $("#fromImage").attr("disabled", false);
            return
        }
        var rarity = CI['rarity'];
        var slot_limit = slot_num_dict[CI['promo'] ? 'promo' + CI['rarity'] : CI['rarity']];
        var slot_num = 0;
        var CI = {
            level: max_level_dict[idolized][CI['rarity']],
            bond: max_bond_dict[idolized][CI['rarity']],
            removable: [],
            unit_id: C2U_dict[CI['card_id']],
            skill: 1,
            slot: slot_limit[0] + (!CI['promo'] & idolized),
            card_id: CI['card_id'],
            idolized: idolized,
            promo: CI['promo'],
            rarity: CI['rarity'],
            main_attr: CI['main_attr'],
            member_name: CI['member_name'],
        }

        current_team[x] = CI;
        total_cost[x] = 0;
        $('#header-' + x).css('background-color', 'grey');
    }
    showTeam(true);
    updateInfo('Successfully import team from screenshot', false);
}

function urltoFile(url, filename, mimeType) {
    return (fetch(url)
        .then(function(res) { return res.arrayBuffer(); })
        .then(function(buf) { return new File([buf], filename, { type: mimeType }); })
    );
}

$('#fromImage').change(function(e) {
    if (window.FileReader) {
        var file = e.target.files[0];
        var reader = new FileReader();
        if (file && file.type.match('image.*')) {
            reader.readAsDataURL(file);
        } else {
            alert('Please choose an image file')
            return
        }
        lrz(file, {
                width: 800
            })
            .then(function(rst) {
                console.log('Compressed image size is {0} kb'.format((rst.fileLen / 1024).toFixed()))
                $("#upload").text("Uploading...");
                $("#fromImage").attr("disabled", true);
                $("#fromImage").parent().addClass('w3-grey')
                urltoFile(rst.base64, 'compressed.jpeg', 'image/jpeg')
                    .then(function(file) {
                        $.ajax({
                            url: 'http://api.sif.lcm.im/teamview', // 这个地址做了跨域处理，可以用于实际调试
                            data: rst.formData,
                            processData: false,
                            contentType: false,
                            type: 'POST',
                            success: function(data) {
                                result = JSON.parse(data)
                                var result = JSON.parse(event.target.responseText);
                                console.log(result)
                                if (result.status != 200) {
                                    alert("Fail: " + result.message);
                                    $("#upload").text("From Screenshot");
                                    $("#fromImage").attr("disabled", false);
                                    $("#fromImage").parent().removeClass('w3-grey')
                                }
                                showImageImportResult(result.team);
                                $("#upload").text("From Screenshot");
                                $("#fromImage").attr("disabled", false);
                                $("#fromImage").parent().removeClass('w3-grey')
                            }
                        });
                    })
                return rst;
            });
    }
});
$('#upload').click(function(e) {
    if (window.location.protocol == 'https:') {
        alert('You are visiting LLATB via https protocol, if you want to use this function, please use http protocol')
        e.preventDefault();
        e.stopPropagation();
        return
    }
    $('#fromImage').trigger('click');
    return false;
});