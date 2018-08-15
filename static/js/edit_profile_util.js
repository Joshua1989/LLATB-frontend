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
// utility for check whether a string is a valid JSON
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
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
        group: 'Muse'
    },
    Eli: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_255.png',
        name: '絢瀬絵里',
        group: 'Muse'
    },
    Kotori: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_256.png',
        name: '南ことり',
        group: 'Muse'
    },
    Umi: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_257.png',
        name: '園田海未',
        group: 'Muse'
    },
    Rin: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_258.png',
        name: '星空凛',
        group: 'Muse'
    },
    Maki: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_259.png',
        name: '西木野真姫',
        group: 'Muse'
    },
    Nozomi: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_260.png',
        name: '東條希',
        group: 'Muse'
    },
    Hanayo: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_261.png',
        name: '小泉花陽',
        group: 'Muse'
    },
    Nico: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_262.png',
        name: '矢澤にこ',
        group: 'Muse'
    },
    Chika: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_105.png',
        name: '高海千歌',
        group: 'Aqours'
    },
    Riko: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_106.png',
        name: '桜内梨子',
        group: 'Aqours'
    },
    Kanan: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_107.png',
        name: '松浦果南',
        group: 'Aqours'
    },
    Dia: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_108.png',
        name: '黒澤ダイヤ',
        group: 'Aqours'
    },
    You: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_109.png',
        name: '渡辺曜',
        group: 'Aqours'
    },
    Yoshiko: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_110.png',
        name: '津島善子',
        group: 'Aqours'
    },
    Hanamaru: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_111.png',
        name: '国木田花丸',
        group: 'Aqours'
    },
    Mari: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_112.png',
        name: '小原鞠莉',
        group: 'Aqours'
    },
    Ruby: {
        url: '//r.llsif.win/assets/image/ui/common/com_etc_113.png',
        name: '黒澤ルビィ',
        group: 'Aqours'
    }
}
var group_arr = {
    muse: 'μ\'s',
    Aqours: 'Aqours'
};
var attribute_arr = ['Smile', 'Pure', 'Cool'];

var gem_skill_id_dict = {
    1: 'Smile Kiss',
    2: 'Pure Kiss',
    3: 'Cool Kiss',
    4: 'Smile Perfume',
    5: 'Pure Perfume',
    6: 'Cool Perfume',
    7: 'Smile Ring 1st',
    8: 'Pure Ring 1st',
    9: 'Cool Ring 1st',
    10: 'Smile Ring 2nd',
    11: 'Pure Ring 2nd',
    12: 'Cool Ring 2nd',
    13: 'Smile Ring 3rd',
    14: 'Pure Ring 3rd',
    15: 'Cool Ring 3rd',
    16: 'Smile Cross 1st',
    17: 'Pure Cross 1st',
    18: 'Cool Cross 1st',
    19: 'Smile Cross 2nd',
    20: 'Pure Cross 2nd',
    21: 'Cool Cross 2nd',
    22: 'Smile Cross 3rd',
    23: 'Pure Cross 3rd',
    24: 'Cool Cross 3rd',
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
    39: 'Empress Trick',
    40: 'Smile Wink',
    41: 'Pure Wink',
    42: 'Cool Wink',
    43: 'Smile Trill 1st',
    44: 'Pure Trill 1st',
    45: 'Cool Trill 1st',
    46: 'Smile Trill 2nd',
    47: 'Pure Trill 2nd',
    48: 'Cool Trill 2nd',
    49: 'Smile Trill 3rd',
    50: 'Pure Trill 3rd',
    51: 'Cool Trill 3rd',
    52: 'Smile Bloom',
    53: 'Pure Bloom',
    54: 'Cool Bloom'
}
var gem_name = {
    CN: {
        Perfume: '香水',
        Ring: '指环',
        Cross: '十字',
        Aura: '光环',
        Veil: '面纱',
        Charm: '爆分',
        Heal: '奶分',
        Trick: '判定',
        Wink: 'Wink',
        Trill: 'Trill',
        Bloom: 'Bloom'
    },
    EN: {
        Perfume: 'Perfume',
        Ring: 'Ring',
        Cross: 'Cross',
        Aura: 'Aura',
        Veil: 'Veil',
        Charm: 'Charm',
        Heal: 'Heal',
        Trick: 'Trick',
        Wink: 'Wink',
        Trill: 'Trill',
        Bloom: 'Bloom'
    }
}

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

// Load user profile, if not create a new one
var user_json = JSON.parse(localStorage.getItem("user_json"));
if (user_json == null || user_json == '') {
    user_json = {
        unit_info: [],
        deck_info: [],
        removable_info: {
            equipment_info: {},
            owning_info: []
        }
    };
    for (var gid in gem_skill_id_dict) {
        user_json['removable_info']['owning_info'].push({
            total_amount: 9,
            unit_removable_skill_id: parseInt(gid)
        })
    }
} else {
    if (user_json['unit_info'] == undefined) {
        user_json['unit_info'] = [];
    }
    user_json['deck_info'] = [];
    if (user_json['removable_info'] == undefined) {
        user_json['removable_info'] = {};
        if (user_json['removable_info']['owning_info'] == undefined) {
            user_json['removable_info']['owning_info'] = [];
            for (var gid in gem_skill_id_dict) {
                user_json['removable_info']['owning_info'].push({
                    total_amount: 9,
                    unit_removable_skill_id: parseInt(gid)
                })
            }
        }
    }
    temp = {};
    for (var gid in gem_skill_id_dict) {
        temp[gid] = {
            total_amount: 0,
            unit_removable_skill_id: parseInt(gid)
        }
    }
    for (var x in user_json['removable_info']['owning_info']) {
        var gem_info = user_json['removable_info']['owning_info'][x];
        var gid = gem_info['unit_removable_skill_id']
        temp[gid]['total_amount'] = gem_info['total_amount'];
    }
    user_json['removable_info']['equipment_info'] = {};
    user_json['removable_info']['owning_info'] = [];
    for (var gid in temp) {
        user_json['removable_info']['owning_info'].push(temp[gid])
    }
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
var owned_index = 0;
for (var x in user_json['unit_info']) {
    var CI = user_json['unit_info'][x];
    var cid = U2C_dict[CI['unit_id']];
    if (card_info[cid] != undefined) {
        var key = rev_dict[card_info[cid]['member_name']],
            attr = card_info[cid]['main_attr'];
        owned_bucket[key][attr][owned_index] = {};
        owned_bucket[key][attr][owned_index]['card_id'] = cid;
        owned_bucket[key][attr][owned_index]['idolized'] = CI['rank'] == 2;
        owned_bucket[key][attr][owned_index]['level'] = CI['level'];
        owned_bucket[key][attr][owned_index]['bond'] = CI['love'];
        owned_bucket[key][attr][owned_index]['slot'] = CI['unit_removable_skill_capacity'];
        owned_bucket[key][attr][owned_index]['skill'] = CI['unit_skill_level'];
        owned_bucket[key][attr][owned_index]['rarity'] = card_info[cid]['rarity'];
        owned_bucket[key][attr][owned_index]['promo'] = card_info[cid]['promo'];
        owned_index += 1;
    }
}

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
    if (lang == 'CN')
        updateInfo('选择角色为 {0}'.format(member_info[member_sel]['name']));
    else
        updateInfo('Choose member as {0}'.format(member_info[member_sel]['name']));
    showCardPond();
    showOwned();
    $('body').removeClass('modal-open');
})

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


// Display all filtered card
function icon_path(cid, idolized) {
    return '//gitcdn.xyz/repo/iebb/SIFStatic/master/icon/{0}/{1}.png'.format(idolized ? 'rankup' : 'normal', cid);

}

function showCardPond() {
    var id_list = []
    for (var x in card_bucket[member_sel][attr_sel]) {
        id_list.push(card_bucket[member_sel][attr_sel][x])
    }
    if (idolized_sel) {
        for (var x in promo_bucket[member_sel][attr_sel]) {
            id_list.push(promo_bucket[member_sel][attr_sel][x])
        }
    }
    id_list.sort(sortNumber)
    var temp = ''
    for (var x in id_list) {
        var cid = id_list[x];
        temp += '<div class=\'icon\'><div class=\'stats_bar\'>{0}</div><img src=\'{1}\' alt=\'icon-{2}\'></div>'.format(cid, icon_path(cid, idolized_sel), cid)
    }
    $('#pond').html(temp);
    $(".icon img").each(function(index) {
        $(this).on("click", function() {
            var cid = parseInt($(this).attr('alt').replace('icon-', ''));
            var CI = card_info[cid];
            owned_bucket[member_sel][attr_sel][owned_index] = {
                card_id: cid,
                level: max_level_dict[idolized_sel][CI['rarity']],
                bond: max_bond_dict[idolized_sel][CI['rarity']],
                idolized: idolized_sel,
                slot: slot_num_dict[CI['promo'] ? 'promo' + CI['rarity'] : CI['rarity']][0],
                skill: 1,
                rarity: CI['rarity'],
                promo: CI['promo']
            }
            showOwned();
            CI = owned_bucket[member_sel][attr_sel][owned_index];
            var stats_str = '{0}/{1}/{2}/{3}'.format(CI['slot'], CI['skill'], CI['level'], CI['bond']);
            if (lang == 'CN') {
                var idol_str = CI['idolized'] ? '觉醒' : '未觉醒';
                updateInfo(' CID {0}: own ID {1}, 添加数据为 {2} {3}'.format(CI['card_id'], owned_index, idol_str, stats_str));
            } else {
                var idol_str = CI['idolized'] ? 'Idolized' : 'Unidolized';
                updateInfo(' CID {0}: own ID {1}, add data as {2} {3}'.format(CI['card_id'], owned_index, idol_str, stats_str));
            }
            owned_index += 1;
        })
    })
}

function showOwned() {
    var temp = ''
    for (var ownIdx in owned_bucket[member_sel][attr_sel]) {
        var CI = owned_bucket[member_sel][attr_sel][ownIdx]
        var stats_str = '{0}/{1}/{2}/{3}'.format(CI['slot'], CI['skill'], CI['level'], CI['bond']);
        temp += '<div class=\'own_icon\'><div class=\'stats_bar\'>{2}</div><img src=\'{0}\' alt=\'own-{1}\'></div>'.format(icon_path(CI['card_id'], CI['idolized']), ownIdx, stats_str);
    }
    $('#owned').html(temp);
    $(".own_icon img").each(function(index) {
        $(this).on("click", function() {
            $('#editCard').show();
            $('body').addClass('modal-open');
            var own_id = $(this).attr('alt').replace('own-', '');
            prepareEditModal(own_id);
        })
    })
}

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

function prepareEditModal(own_id) {
    var CI = owned_bucket[member_sel][attr_sel][own_id];
    $('#editTitle').text('cid: {0}, own_id: {1}'.format(CI['card_id'], own_id));
    $('#editLevel').attr('max', max_level_dict[CI['idolized']][CI['rarity']]);
    $('#editLevel').val(CI['level']);
    $('#editBond').attr('max', max_bond_dict[CI['idolized']][CI['rarity']]);
    $('#editBond').val(CI['bond']);
    var slot_limit = slot_num_dict[CI['promo'] ? 'promo' + CI['rarity'] : CI['rarity']]
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
        $('#editIdolization').text((lang == 'CN') ? '觉醒' : 'Idolized');
    } else {
        $('#editIdolization').removeClass('w3-red');
        $('#editIdolization').addClass('w3-green');
        $('#editIdolization').text((lang == 'CN') ? '未觉' : 'Unidolized');
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
            $(this).text((lang == 'CN') ? '觉醒' : 'Idolized');
        } else {
            $(this).removeClass('w3-red');
            $(this).addClass('w3-green');
            $(this).text((lang == 'CN') ? '未觉' : 'Unidolized');
        }
    })
    $('#editOK').click(function() {
        if (!$('#editLevel').is(':valid') || !$('#editBond').is(':valid')) {
            if (lang == 'CN')
                alert('请输入正确的等级和绊值')
            else
                alert('Lv or bond out of range.')
            return
        }
        var own_id = parseInt($('#editTitle').text().split(': ')[2]);
        var CI = owned_bucket[member_sel][attr_sel][own_id];
        CI['level'] = parseInt($('#editLevel').val());
        CI['bond'] = parseInt($('#editBond').val());
        CI['slot'] = parseInt($('button[id^=slot-][class=checked]').text());
        CI['skill'] = parseInt($('button[id^=skill-][class=checked]').text());
        CI['idolized'] = temp_idolized;
        $('#editCard').hide();
        $('body').removeClass('modal-open');
        showOwned();
        var stats_str = '{0}/{1}/{2}/{3}'.format(CI['slot'], CI['skill'], CI['level'], CI['bond']);
        if (lang == 'CN') {
            var idol_str = CI['idolized'] ? '觉醒' : '未觉醒';
            updateInfo('CID {0}: own ID {1}, 更新数据为 {2} {3}'.format(CI['card_id'], own_id, idol_str, stats_str));
        } else {
            var idol_str = CI['idolized'] ? 'Idolized' : 'Unidolized';
            updateInfo('CID {0}: own ID {1}, change data to {2} {3}'.format(CI['card_id'], own_id, idol_str, stats_str));
        }
    })
    $('#editCancel').click(function() {
        $('#editCard').hide();
        $('body').removeClass('modal-open');
    })
    $('#deleteCard').click(function() {
        var own_id = parseInt($('#editTitle').text().split(': ')[2]);
        var CI = owned_bucket[member_sel][attr_sel][own_id];
        var stats_str = '{0}/{1}/{2}/{3}'.format(CI['slot'], CI['skill'], CI['level'], CI['bond']);
        if (lang == 'CN')
            var idol_str = CI['idolized'] ? '觉醒' : '未觉醒';
        else
            var idol_str = CI['idolized'] ? 'Idolized' : 'Unidolized';
        delete owned_bucket[member_sel][attr_sel][own_id];
        $('#editCard').hide();
        $('body').removeClass('modal-open');
        showOwned();
        if (lang == 'CN')
            updateInfo('CID {0}: own ID {1}, 劝退，原数据为 {2} {3}'.format(CI['card_id'], own_id, idol_str, stats_str));
        else
            updateInfo('CID {0}: own ID {1}, remove, its data is {2} {3}'.format(CI['card_id'], own_id, idol_str, stats_str));
    })
}

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
        if (lang == 'CN')
            updateInfo('选择属性为 {0}'.format(attr_sel), false);
        else
            updateInfo('Choose attribute as {0}'.format(attr_sel), false);
    }
    showCardPond();
    showOwned();
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
    if (lang == 'CN')
        updateInfo('选择觉醒状态为 {0}觉醒'.format(idolized_sel ? '' : '未'), false);
    else
        updateInfo('Choose idolization as {0}'.format(idolized_sel ? 'Idolized' : 'Unidolized'), false);
    showCardPond();
})

// Edit gem number
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
        if (lang == 'CN')
            alert('所有宝石持有数量应为非负的整数')
        else
            alert('SIS number should be a non-negative integer,')
        return
    }
    for (var index in user_json['removable_info']['owning_info']) {
        var gem_id = user_json['removable_info']['owning_info'][index]['unit_removable_skill_id']
        if (gem_id > 3) {
            user_json['removable_info']['owning_info'][index]['total_amount'] = parseInt($('#gem-' + gem_id + ' input').val());
        }
    }
    $('#editGemModal').hide();
    $('body').removeClass('modal-open');
    if (lang == 'CN')
        updateInfo('修改宝石储量')
    else
        updateInfo('SIS owning number updated.')
})
var own_gem = {};
for (var gem_id in gem_skill_id_dict) {
    if (gem_id > 3) {
        var attr = gem_skill_id_dict[gem_id].split(' ')[0].replace('Princess', 'Smile').replace('Angel', 'Pure').replace('Empress', 'Cool');
        var subnames = gem_skill_id_dict[gem_id].split(' ').slice(1);
        var name = subnames.length == 1 ? gem_name[lang][subnames[0]] : gem_name[lang][subnames[0]] + ' ' + subnames[1]
        var number = 0;
        own_gem[gem_id] = "<div id='gem-{0}' class='gemNum {1}'><div>{2}</div><input class='w3-input' type='number' min='0' step='1' value='{3}' required='required'></div>".format(gem_id, attr, name, number);
    }
}
for (var x in user_json['removable_info']['owning_info']) {
    var gem_id = user_json['removable_info']['owning_info'][x]['unit_removable_skill_id'];
    var number = user_json['removable_info']['owning_info'][x]['total_amount'];
    if (gem_id > 3) {
        var attr = gem_skill_id_dict[gem_id].split(' ')[0].replace('Princess', 'Smile').replace('Angel', 'Pure').replace('Empress', 'Cool');
        var subnames = gem_skill_id_dict[gem_id].split(' ').slice(1);
        var name = subnames.length == 1 ? gem_name[lang][subnames[0]] : gem_name[lang][subnames[0]] + ' ' + subnames[1]
        own_gem[gem_id] = "<div id='gem-{0}' class='gemNum {1}'><div>{2}</div><input class='w3-input' type='number' min='0' step='1' value='{3}' required='required'></div>".format(gem_id, attr, name, number);
    }
}
var temp = '';
for (var gem_id in gem_skill_id_dict) {
    if (gem_id > 3) {
    temp += own_gem[gem_id];
    }
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


// Save profile
$('#saveProfile').click(function() {
    var temp = [];
    for (var member in owned_bucket) {
        for (var attr in owned_bucket[member]) {
            for (var own_id in owned_bucket[member][attr]) {
                temp.push({
                    own_id: own_id,
                    data: owned_bucket[member][attr][own_id]
                })
            }
        }
    }
    temp.sort(function(a, b) { parseInt(a.own_id) - parseInt(b.own_id) });

    var temp_unit_info = [];
    for (var x in temp) {
        var CI = temp[x]['data'];
        temp_unit_info.push({
            unit_owning_user_id: 0,
            unit_id: C2U_dict[CI['card_id']],
            level: max_level_dict[CI['idolized']][CI['rarity']],
            love: max_bond_dict[CI['idolized']][CI['rarity']],
            rank: CI['idolized'] + 1,
            unit_removable_skill_capacity: CI['slot'],
            unit_skill_level: CI['skill']
        })
    }
    user_json['unit_info'] = temp_unit_info;
    localStorage.setItem('user_json', JSON.stringify(user_json));
    if (lang == 'CN')
        updateInfo('已保存当前选择到用户卡组JSON', false);
    else
        updateInfo('Saved current settings to user profile JSON', false);
});