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

// Load all live basic information
var live_info = JSON.parse(live_info_data),
    sm_info = JSON.parse(sm_songs);
var img_url = {
    muse: '//r.llsif.win/assets/image/event/mission/ms_m_type_10.png',
    Aqours: '//r.llsif.win/assets/image/event/mission/ms_m_type_11.png',
    Smile: '//db.loveliv.es/static/img/icon/1.png',
    Pure: '//db.loveliv.es/static/img/icon/2.png',
    Cool: '//db.loveliv.es/static/img/icon/3.png',
    Easy: '//r.llsif.win/assets/image/ui/event/e_button_12.png',
    Normal: '//r.llsif.win/assets/image/ui/event/e_button_13.png',
    Hard: '//r.llsif.win/assets/image/ui/event/e_button_14.png',
    Expert: '//r.llsif.win/assets/image/ui/event/e_button_15.png',
    Master: '//r.llsif.win/assets/image/ui/event/e_button_17.png',
    ScoreUp: '//r.llsif.win/assets/image/ui/event/e_button_32.png',
    SkillUp: '//r.llsif.win/assets/image/ui/event/e_button_33.png',
    UnlimitGem: '//i.imgur.com/yfSH0FD.png',
    Pin: '//i.imgur.com/sy4Rxqv.png',
    AutoMode: '//r.llsif.win/assets/image/ui/unit/u_button_10.png',
};
var default_cover_url = {
    muse: {
        Smile: '//r.llsif.win/assets/image/ui/live/l_etc_36.png',
        Pure: '//r.llsif.win/assets/image/ui/live/l_etc_37.png',
        Cool: '//r.llsif.win/assets/image/ui/live/l_etc_38.png',
    },
    Aqours: {
        Smile: '//r.llsif.win/assets/image/ui/live/l_etc_130.png',
        Pure: '//r.llsif.win/assets/image/ui/live/l_etc_131.png',
        Cool: '//r.llsif.win/assets/image/ui/live/l_etc_132.png',
    }
}
var group_arr = {
    muse: 'μ\'s',
    Aqours: 'Aqours'
};
var attribute_arr = ['Smile', 'Pure', 'Cool'];
var attribute_color = {
    Smile: 'red',
    Pure: 'green',
    Cool: 'blue'
}
var attribute_color2 = {
    Smile: '\#f44336',
    Pure: '\#4CAF50',
    Cool: '\#2196F3'
}
var difficulty_arr = ['Easy', 'Normal', 'Hard', 'Expert', 'Master'];
var extra_cond_arr = ['default', 'current_max', 'idolized_max', 'ultimate'];
var extra_cond_text = {
    CN: {
        default: '维持当前状态',
        current_max: '当前状态满级满绊',
        idolized_max: '贴纸觉醒满级满绊',
        ultimate: '觉醒满槽满技能'
    },
    EN: {
        default: 'Maintain Current',
        current_max: 'Max Lv & Bond',
        idolized_max: 'Idlz, Max Lv & Bond',
        ultimate: 'Idlz, Lv 8 & Slot Max'
    }
};
var main_C_info = { false: 12, true: 9 }
var vice_C_info = {
    "μ\'s": 3,
    'Aqours': 3,
    '1st-year': 6,
    '2nd-year': 6,
    '3rd-year': 6,
    'Printemps': 6,
    'lily white': 6,
    'BiBi': 6,
    'CYaRon！': 6,
    'AZALEA': 6,
    'Guilty Kiss': 6
}

// Initialize selections
var local_vars = JSON.parse(localStorage.getItem('local_vars'));
if (local_vars == null) {
    local_vars = {
        group_sel: 'muse',
        attr_sel: 'Smile',
        diff_sel: 'Expert',
        score_up: 0,
        skill_up: 0,
        unlimit_gem: false,
        perfect_rate: 0.95,
        extra_cond: 'default',
    };
}
var group_sel = local_vars.group_sel,
    attr_sel = local_vars.attr_sel,
    diff_sel = local_vars.diff_sel,
    score_up = local_vars.score_up,
    skill_up = local_vars.skill_up,
    unlimit_gem = local_vars.unlimit_gem,
    perfect_rate = local_vars.perfect_rate,
    extra_cond = local_vars.extra_cond,
    guest_center = 'None';

function save_local_vars() {
    var temp = JSON.stringify({
        group_sel: group_sel,
        attr_sel: attr_sel,
        diff_sel: diff_sel,
        score_up: score_up,
        skill_up: skill_up,
        unlimit_gem: unlimit_gem,
        perfect_rate: perfect_rate,
        extra_cond: extra_cond,
    });
    localStorage.setItem('local_vars', temp);
}

var user_json = localStorage.getItem("user_json");
var user_json_bucket = localStorage.getItem("user_json_bucket");
var default_user_json = '{"removable_info": {"equipment_info": {}, "owning_info": [{"unit_removable_skill_id": 1, "total_amount": 9}, {"unit_removable_skill_id": 2, "total_amount": 9}, {"unit_removable_skill_id": 3, "total_amount": 9}, {"unit_removable_skill_id": 4, "total_amount": 9}, {"unit_removable_skill_id": 5, "total_amount": 9}, {"unit_removable_skill_id": 6, "total_amount": 9}, {"unit_removable_skill_id": 7, "total_amount": 9}, {"unit_removable_skill_id": 8, "total_amount": 9}, {"unit_removable_skill_id": 9, "total_amount": 9}, {"unit_removable_skill_id": 10, "total_amount": 9}, {"unit_removable_skill_id": 11, "total_amount": 9}, {"unit_removable_skill_id": 12, "total_amount": 9}, {"unit_removable_skill_id": 13, "total_amount": 9}, {"unit_removable_skill_id": 14, "total_amount": 9}, {"unit_removable_skill_id": 15, "total_amount": 9}, {"unit_removable_skill_id": 16, "total_amount": 9}, {"unit_removable_skill_id": 17, "total_amount": 9}, {"unit_removable_skill_id": 18, "total_amount": 9}, {"unit_removable_skill_id": 19, "total_amount": 9}, {"unit_removable_skill_id": 20, "total_amount": 9}, {"unit_removable_skill_id": 21, "total_amount": 9}, {"unit_removable_skill_id": 22, "total_amount": 9}, {"unit_removable_skill_id": 23, "total_amount": 9}, {"unit_removable_skill_id": 24, "total_amount": 9}, {"unit_removable_skill_id": 25, "total_amount": 9}, {"unit_removable_skill_id": 26, "total_amount": 9}, {"unit_removable_skill_id": 27, "total_amount": 9}, {"unit_removable_skill_id": 28, "total_amount": 9}, {"unit_removable_skill_id": 29, "total_amount": 9}, {"unit_removable_skill_id": 30, "total_amount": 9}, {"unit_removable_skill_id": 31, "total_amount": 9}, {"unit_removable_skill_id": 32, "total_amount": 9}, {"unit_removable_skill_id": 33, "total_amount": 9}, {"unit_removable_skill_id": 34, "total_amount": 9}, {"unit_removable_skill_id": 35, "total_amount": 9}, {"unit_removable_skill_id": 36, "total_amount": 9}, {"unit_removable_skill_id": 37, "total_amount": 9}, {"unit_removable_skill_id": 38, "total_amount": 9}, {"unit_removable_skill_id": 39, "total_amount": 9}]}, "unit_info": [{"level": 80, "unit_removable_skill_capacity": 2, "love": 500, "unit_skill_level": 1, "unit_id": "417", "unit_owning_user_id": "1", "rank": 2}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "414", "unit_owning_user_id": "2", "rank": 1}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "413", "unit_owning_user_id": "3", "rank": 1}, {"level": 80, "unit_removable_skill_capacity": 2, "love": 500, "unit_skill_level": 1, "unit_id": "410", "unit_owning_user_id": "4", "rank": 2}, {"level": 80, "unit_removable_skill_capacity": 4, "love": 500, "unit_skill_level": 1, "unit_id": "408", "unit_owning_user_id": "5", "rank": 1}, {"level": 80, "unit_removable_skill_capacity": 2, "love": 500, "unit_skill_level": 1, "unit_id": "399", "unit_owning_user_id": "6", "rank": 2}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "395", "unit_owning_user_id": "7", "rank": 1}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "394", "unit_owning_user_id": "8", "rank": 1}, {"level": 80, "unit_removable_skill_capacity": 2, "love": 500, "unit_skill_level": 1, "unit_id": "392", "unit_owning_user_id": "9", "rank": 2}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "376", "unit_owning_user_id": "10", "rank": 1}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "375", "unit_owning_user_id": "11", "rank": 1}, {"level": 100, "unit_removable_skill_capacity": 2, "love": 1000, "unit_skill_level": 1, "unit_id": "372", "unit_owning_user_id": "12", "rank": 2}, {"level": 80, "unit_removable_skill_capacity": 2, "love": 500, "unit_skill_level": 1, "unit_id": "371", "unit_owning_user_id": "13", "rank": 2}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "366", "unit_owning_user_id": "14", "rank": 1}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "365", "unit_owning_user_id": "15", "rank": 1}, {"level": 80, "unit_removable_skill_capacity": 2, "love": 500, "unit_skill_level": 1, "unit_id": "360", "unit_owning_user_id": "16", "rank": 2}, {"level": 80, "unit_removable_skill_capacity": 4, "love": 500, "unit_skill_level": 1, "unit_id": "358", "unit_owning_user_id": "17", "rank": 1}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "335", "unit_owning_user_id": "18", "rank": 1}, {"level": 80, "unit_removable_skill_capacity": 2, "love": 500, "unit_skill_level": 1, "unit_id": "332", "unit_owning_user_id": "19", "rank": 2}, {"level": 80, "unit_removable_skill_capacity": 4, "love": 500, "unit_skill_level": 1, "unit_id": "330", "unit_owning_user_id": "20", "rank": 1}, {"level": 80, "unit_removable_skill_capacity": 2, "love": 500, "unit_skill_level": 1, "unit_id": "324", "unit_owning_user_id": "21", "rank": 2}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "319", "unit_owning_user_id": "22", "rank": 1}, {"level": 80, "unit_removable_skill_capacity": 2, "love": 500, "unit_skill_level": 1, "unit_id": "317", "unit_owning_user_id": "23", "rank": 2}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "312", "unit_owning_user_id": "24", "rank": 1}, {"level": 80, "unit_removable_skill_capacity": 2, "love": 500, "unit_skill_level": 1, "unit_id": "309", "unit_owning_user_id": "25", "rank": 2}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "295", "unit_owning_user_id": "26", "rank": 1}, {"level": 60, "unit_removable_skill_capacity": 2, "love": 250, "unit_skill_level": 1, "unit_id": "284", "unit_owning_user_id": "27", "rank": 1}, {"level": 70, "unit_removable_skill_capacity": 3, "love": 375, "unit_skill_level": 1, "unit_id": "1181", "unit_owning_user_id": "28", "rank": 1}, {"level": 80, "unit_removable_skill_capacity": 4, "love": 500, "unit_skill_level": 1, "unit_id": "1182", "unit_owning_user_id": "29", "rank": 1}], "deck_info": []}';
if (user_json == null) {
    user_json = default_user_json;
    localStorage.setItem("user_json", user_json)
}
if (user_json_bucket == null | !IsJsonString(user_json_bucket)) {
    user_json_bucket = { 'auto save': default_user_json };
    localStorage.setItem("user_json_bucket", user_json_bucket);
} else {
    user_json_bucket = JSON.parse(user_json_bucket);
}
if (TS_page) {
    var team_json = localStorage.getItem("team_json");
    if (team_json == null) {
        team_json = '[0,{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":982,"unit_skill_level":8,"unit_removable_skill_capacity":8},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1027,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1004,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1131,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1109,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1075,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1048,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1177,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1153,"unit_skill_level":1,"unit_removable_skill_capacity":4}]';
        localStorage.setItem("team_json", team_json)
    }
}

var song_head = (lang == 'CN') ? '默认谱面' : 'Default';
var song_name = song_head + ' {0} {1}'.format(group_arr[group_sel], attr_sel);
var live_selection = {
    group: group_sel,
    attr: attr_sel,
    diff: diff_sel,
    song_list: [song_name],
    is_sm: false,
    is_random: false
}

// Used for update MF selection
function updateLiveSel(add_song) {
    var change = (live_selection['group'] != group_sel) | (live_selection['attr'] != attr_sel) | (live_selection['diff'] != diff_sel)
    if (change) {
        live_selection = {
            group: group_sel,
            attr: attr_sel,
            diff: diff_sel,
            song_list: [song_head + ' {0} {1}'.format(group_arr[group_sel], attr_sel)],
            is_sm: false,
            is_random: false
        };
    } else if (add_song) {
        if (add_song.indexOf(song_head) == -1 && add_song.indexOf('SM') == -1) {
            if ((live_selection['song_list'].length == 1 && live_selection['song_list'][0].indexOf(song_head) > -1) || live_selection.is_sm) {
                live_selection['song_list'] = [add_song];
                live_selection.is_sm = false;
                live_selection.is_random = false;
            } else {
                if (live_selection['song_list'].length < 5) {
                    live_selection['song_list'].push(add_song);
                    live_selection.is_sm = false;
                    live_selection.is_random = false;
                } else {
                    if (lang == 'CN')
                        updateInfo('选择Live数量已达到上限 5', true);
                    else
                        updateInfo('Selected Live number reached upper bound 5', true);
                }
            }
        } else if (add_song.indexOf(song_head) > -1) {
            live_selection = {
                group: group_sel,
                attr: attr_sel,
                diff: diff_sel,
                song_list: [add_song],
                is_sm: false,
                is_random: false
            };
        } else {
            var server = sm_info[add_song.slice(3, 5)],
                stg_idx = parseInt(add_song[6]) - 1;
            live_selection = {
                group: group_sel,
                attr: attr_sel,
                diff: diff_sel,
                song_list: server.stages[stg_idx].song_list[attr_sel],
                is_sm: true,
                is_random: add_song.indexOf(lang == 'CN' ? '随机' : 'RND') > -1
            };
        }
    }
    var song_names = live_selection.is_sm ? add_song : live_selection['song_list'].join(', ')
    if (lang == 'CN')
        $("#liveSel span b").html('难度: {0}, 已选曲目: {1}'.format(live_selection['diff'], song_names));
    else
        $("#liveSel span b").html('Difficulty: {0}, Selected songs: {1}'.format(live_selection['diff'], song_names));
    $("#liveSel span b").css('color', attribute_color2[live_selection['attr']]);
}
updateLiveSel();

// Initialized display
$('#group').html("<img src='{0}' alt='{1}'>".format(img_url[group_sel], group_arr[group_sel]));
for (x in attribute_arr) {
    attr = attribute_arr[x];
    $('#attr' + attr).html("<img src='{0}' alt='{1}'>".format(img_url[attr], group_arr[attr]));
    $('#attr' + attr + ' img').addClass('w3-grayscale-max');
}
$('#attr' + attr_sel + ' img').removeClass('w3-grayscale-max');
var temp = '';
for (x in difficulty_arr) {
    diff = difficulty_arr[x];
    temp += "<button class='w3-bar-item diffItem' onclick=\"switchDifficulty('{0}')\" style='height:40px;padding:0;'><img src='{1}'></button>".format(diff, img_url[diff]);
}
$('#difficulty div').html(temp);
$('#difficulty>button').html("<img src='{0}' height=100%>".format(img_url[diff_sel]));
$('#scoreup').css('background-image', 'url("{0}")'.format(img_url['ScoreUp']));
$('#scoreup').css('background-size', 'auto 100%');
$('#scoreup').val(parseInt(100 * score_up));
if (score_up == 0) {
    $('#scoreup').val('');
    $('#scoreup').css('filter', 'grayscale(100%)');
}

$('#skillup').css('background-image', 'url("{0}")'.format(img_url['SkillUp']));
$('#skillup').css('background-size', 'auto 100%');
$('#skillup').val(parseInt(100 * skill_up));
if (skill_up == 0) {
    $('#skillup').val('');
    $('#skillup').css('filter', 'grayscale(100%)');
}

$('#unlimitGem').html("<img src='{0}' height=100%>".format(img_url['UnlimitGem']));
if (!unlimit_gem)
    $('#unlimitGem img').addClass('w3-grayscale-max');
$('#perfectRate').val(perfect_rate);
temp = '';
for (x in extra_cond_arr) {
    ec = extra_cond_arr[x]
    temp += "<option value='{0}'{2}>{1}</option>".format(ec, extra_cond_text[lang][ec], ec == extra_cond ? ' selected' : '');
}
$('#extraCond').html(temp);
$('#simulation').hide();

// Initialize Swiper
var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflow: {
        rotate: 30,
        stretch: 0,
        depth: 350,
        modifier: 1,
        slideShadows: false
    },
    loop: false,
    mousewheelControl: true,
    freeMode: true,
    freeModeSticky: true,
    scrollbar: '.swiper-scrollbar',
    scrollbarDraggable: true,
    scrollbarHide: false
});
// Fill live pond into swiper
function updateLiveSwiper() {
    swiper.removeAllSlides()
    // Default live
    var default_name = song_head + ' {0} {1}'.format(group_arr[group_sel], attr_sel);
    var color_str = attribute_color[attr_sel];
    swiper.appendSlide("<div class='swiper-slide w3-{0} w3-border-{5} w3-hover-border-yellow'><div class='topBar w3-hover-{6} w3-{0}' onclick=\"chooseLive('{3}','{4}')\"><b class='titleText'>{1}</b></div><img src='{2}'></div>\n".format(color_str, default_name, default_cover_url[group_sel][attr_sel], default_name.replace("'", "\\\'"), diff_sel, color_str, color_str));
    // SM live
    if (diff_sel != 'Master') {
        var date = new Date();
        var date_UTC = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        date_UTC = Date.parse(date_UTC);
        for (var server_name in sm_info) {
            var server = sm_info[server_name];
            if (server.group == group_sel) {
                for (var stg_idx in server.stages) {
                    var stage = server.stages[stg_idx];
                    if (date_UTC >= Date.parse(stage.start) && date_UTC < Date.parse(stage.end)) {
                        var sm_name = 'SM {2} {3}: {0} {1}'.format(group_arr[group_sel], attr_sel, server_name, parseInt(stg_idx) + 1);
                        var song_list = stage.song_list[attr_sel];
                        swiper.appendSlide("<div class='swiper-slide w3-{0} w3-border-{5} w3-hover-border-yellow'><div class='topBar w3-hover-{6} w3-{0}' onclick=\"chooseLive('{3}','{4}')\"><b class='titleText'>{1}</b></div><img src='{2}'></div>\n".format(color_str, sm_name, default_cover_url[group_sel][attr_sel], sm_name.replace("'", "\\\'"), diff_sel, color_str, color_str));
                        // Random songs
                        if (diff_sel == 'Expert') {
                            if (lang == 'CN')
                                sm_name = 'SM {2} {3} 随机: {0} {1}'.format(group_arr[group_sel], attr_sel, server_name, parseInt(stg_idx) + 1);
                            else
                                sm_name = 'SM {2} {3} RND: {0} {1}'.format(group_arr[group_sel], attr_sel, server_name, parseInt(stg_idx) + 1);
                            swiper.appendSlide("<div class='swiper-slide w3-{0} w3-border-{5} w3-hover-border-yellow'><div class='topBar w3-hover-{6} w3-{0}' onclick=\"chooseLive('{3}','{4}')\"><b class='titleText'>{1}</b></div><img src='{2}'></div>\n".format(color_str, sm_name, default_cover_url[group_sel][attr_sel], sm_name.replace("'", "\\\'"), diff_sel, color_str, color_str));
                        }
                    }
                }
            }
        }
    }
    // Normal live
    for (x in live_info) {
        live = live_info[x];
        if (live['group'] == group_arr[group_sel] && live['attr'] == attr_sel && live['diff_level'] == diff_sel) {
            swiper.appendSlide("<div class='swiper-slide w3-{0} w3-border-{5} w3-hover-border-yellow'><div class='topBar w3-hover-{6} w3-{0}' onclick=\"chooseLive('{3}','{4}')\"><b class='titleText'>{1}</b></div><img src='{2}'></div>\n".format(color_str, live['name'], live['cover'], live['name'], diff_sel, color_str, color_str));
        }
    }
    // Timeout count for onHold event to view live stats
    $('.swiper-slide img').on('click', function(e) {
        viewLiveStats(e);
    });

    setTimeout(function() {
        swiper.update();
    }, 500);
}
updateLiveSwiper();

function updateGuestCenter() {
    guest_center = 'None'
    if (lang == 'CN') {
        temp = "<option disabled style='color:black;'><b>选择好友Center技</b></option>";
        temp += "<option value='None'>无好友Center技</option>";
    } else {
        temp = "<option disabled style='color:black;'><b>Choose Guest Center Skill</b></option>";
        temp += "<option value='None'>No Guest Center Skill</option>";
    }
    for (x in attribute_arr) {
        var main_attr = attr_sel,
            base_attr = attribute_arr[x];
        var main_ratio = main_C_info[main_attr == base_attr];
        for (y in vice_C_info) {
            var bonus_range = y,
                bonus_ratio = vice_C_info[y];
            var cskill_str = "{0}: {1} {2}% / {3} {4}%".format(main_attr, base_attr, main_ratio, bonus_range, bonus_ratio);
            temp += "<option value=\"{0}\">{1}</option>".format(cskill_str, cskill_str);
        }
    }
    $('#guestCenter').html(temp);
    save_local_vars();
}
updateGuestCenter();

function viewLiveStats(e) {
    sn = e.target.parentNode.childNodes[0].getElementsByTagName("b")[0].innerHTML;
    if (sn.indexOf(song_head) != -1) {
        $('#liveStats').show();
        $('body').addClass('modal-open');
        var note_number = { 'Easy': 110, 'Normal': 200, 'Hard': 350, 'Expert': 500, 'Master': 700 }
        temp = "<p align='center' style='color:{0};'>{1} {2}</p>".format(attribute_color[attr_sel], sn, diff_sel);
        if (lang == 'CN')
            temp += "<p align='center' style='color:{0};'>Note数{1}, 时长120秒, 星标10%, 长按8%</p>".format(attribute_color[attr_sel], note_number[diff_sel]);
        else
            temp += "<p align='center' style='color:{0};'>Note Number {1}, Duration 120s, Star Percentage 10%, Long Note Percentage 8%</p>".format(attribute_color[attr_sel], note_number[diff_sel]);
        $('#liveStats .w3-container').html(temp);
    } else if (sn.indexOf('SM') != -1) {
        $('#liveStats').show();
        $('body').addClass('modal-open');

        var server = sm_info[sn.slice(3, 5)],
            stg_idx = parseInt(sn[6]) - 1;
        var songs = server.stages[stg_idx].song_list[attr_sel];
        var start = server.stages[stg_idx].start,
            end = server.stages[stg_idx].end;
        temp = ''
        temp += "<p align='center' style='color:{0};'>{1}</p>".format(attribute_color[attr_sel], sn);
        temp += "<p align='center' style='color:{0};'>{1}</p>".format(attribute_color[attr_sel], 'From {0} to {1}'.format(start, end));
        temp += "<p align='center' style='color:{0};'>{1}</p>".format(attribute_color[attr_sel], songs.join('<br/>'));
        $('#liveStats .w3-container').html(temp);
    } else {
        POST_JSON = {
            lang: lang,
            song_name: sn,
            difficulty: diff_sel,
            perfect_rate: perfect_rate,
            csrfmiddlewaretoken: '{{ csrf_token }}'
        }
        $.ajax({
            type: "POST",
            url: "live_stats",
            headers: {
                'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
            },
            data: POST_JSON,
            success: function(data) {
                updateInfo(data['msg'], !data['complete']);
                $('#result').html(data['result']);
                $('#liveStats').show();
                $('body').addClass('modal-open');
                temp = '<span onclick="closeLiveStats()" class="exitBtn"><b>x</b></span>'
                temp += data['live_stats'];
                $('#liveStats .w3-container').html(temp)
            }
        });
    }
    $('#addCurrentSong').off('click').click(function() {
        chooseLive(sn, diff_sel);
        closeLiveStats();
    })
}

function closeLiveStats() {
    $('#liveStats').hide();
    $('body').removeClass('modal-open')
}

// Make a clickable dropdown for difficulty
$(document).ready(function() {
    $('#difficulty').click(function() {
        $('#difficulty div').show();
    });
    $('#difficulty div').click(function(e) {
        e.stopPropagation();
    });
    $('#difficulty div').mouseleave(function() {
        $('#difficulty div').hide();
    });
});

// Update info bar
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

// Toggle Muse and Aquors
function switchGroup() {
    group_sel = group_sel == 'Aqours' ? 'muse' : 'Aqours';
    $('#group').html("<img src='{0}' alt='{1}'>".format(img_url[group_sel], group_arr[group_sel]));
    updateLiveSwiper();
    if (lang == 'CN')
        updateInfo('选择团体为 {0}'.format(group_arr[group_sel]), false);
    else
        updateInfo('Choose group as {0}'.format(group_arr[group_sel]), false);
    updateLiveSel();
    save_local_vars();
}

// Choose attribute of live
function switchColor(attr) {
    for (x in attribute_arr) {
        $('#attr' + attribute_arr[x] + ' img').addClass('w3-grayscale-max');
    }
    $('#attr' + attr + ' img').removeClass('w3-grayscale-max');
    attr_sel = attr;
    updateLiveSwiper();
    if (lang == 'CN')
        updateInfo('选择属性为 {0}'.format(attr_sel), false);
    else
        updateInfo('Choose attribute as {0}'.format(attr_sel), false);

    updateLiveSel();
    updateGuestCenter();
    save_local_vars();
}
switchColor(attr_sel);

// Choose difficulty of live
function switchDifficulty(diff) {
    $('#difficulty div').hide();
    diff_sel = diff;
    updateLiveSwiper();
    if (lang == 'CN')
        updateInfo('选择难度为 {0}'.format(diff_sel), false);
    else
        updateInfo('Choose difficulty as {0}'.format(diff_sel), false);
    $('#difficulty>button').html("<img src='{0}'>".format(img_url[diff_sel]));
    updateLiveSel();
    save_local_vars();
}
switchDifficulty(diff_sel);

// Choose live
function chooseLive(name, diff) {
    song_name = name;
    if (lang == 'CN')
        updateInfo('选择谱面为 {0} {1}'.format(name, diff), false);
    else
        updateInfo('Choose song as {0} {1}'.format(name, diff), false);
    updateLiveSel(song_name);
}

// Change score up, skill up and unlimited gem
function changeScoreUp() {
    score_up = Math.round($('#scoreup').val()) / 100;
    if (isNaN(score_up) || score_up == 0) {
        score_up = 0;
        $('#scoreup').val('');
    } else if (score_up < 0 || score_up > 0.4) {
        score_up = 0;
        if (lang == 'CN')
            alert('打击得分加成合法范围为0%至40%');
        else
            updateInfo('Choose song as {0} {1}'.format(name, diff), false);
        $('#scoreup').val('');
    }
    if (score_up) {
        $('#scoreup').css('filter', 'grayscale(0%)')
    } else {
        $('#scoreup').css('filter', 'grayscale(100%)')
    }
    if (lang == 'CN')
        updateInfo('{0} 打击得分{1}'.format(score_up ? '启用' : '取消', score_up ? '+' + Math.round(100 * score_up) + '%' : '加成'), false);
    else
        updateInfo('Score Up {0}'.format(score_up ? '+' + Math.round(100 * score_up) + '% ON' : 'OFF'), false);
    save_local_vars();
}

function changeSkillUp() {
    skill_up = Math.round($('#skillup').val()) / 100;
    if (isNaN(skill_up) || skill_up == 0) {
        skill_up = 0;
        $('#skillup').val('');
    } else if (skill_up < 0 || skill_up > 0.4) {
        skill_up = 0;
        if (lang == 'CN')
            alert('技能触发加成合法范围为0%至40%')
        else
            alert('The valid range for skill up is 0% to 40%')
        $('#skillup').val('');
    }
    if (skill_up) {
        $('#skillup').css('filter', 'grayscale(0%)')
    } else {
        $('#skillup').css('filter', 'grayscale(100%)')
    }
    if (lang == 'CN')
        updateInfo('{0} 技能触发{1}'.format(skill_up ? '启用' : '取消', skill_up ? '+' + Math.round(100 * skill_up) + '%' : '加成'), false);
    else
        updateInfo('Skill Up {0}'.format(skill_up ? '+' + Math.round(100 * skill_up) + '% ON' : 'OFF'), false);
    save_local_vars();
}

function toggleUnlimitGem() {
    unlimit_gem = !unlimit_gem;
    if (unlimit_gem) {
        $('#unlimitGem img').removeClass('w3-grayscale-max');
    } else {
        $('#unlimitGem img').addClass('w3-grayscale-max');
    }
    if (lang == 'CN')
        updateInfo('{0} 宝石无限'.format(unlimit_gem ? '启用' : '取消'), false);
    else
        updateInfo('Unlimited SIS {0}'.format(unlimit_gem ? 'ON' : 'OFF'), false);
    save_local_vars();
}

// Change perfect rate and extra condition
function changePerfectRate() {
    temp = parseFloat($('#perfectRate').val());
    if (!isNaN(temp) && temp >= 0.01 && temp <= 1) {
        perfect_rate = temp;
        if (lang == 'CN')
            updateInfo('更改无判P率为 {0}%'.format(parseInt(perfect_rate * 100)), false);
        else
            updateInfo('Change prior perfect rate to {0}%'.format(parseInt(perfect_rate * 100)), false);
        save_local_vars();
    } else {
        $('#perfectRate').val(perfect_rate);
        if (lang == 'CN')
            updateInfo('无判P率为输入错误，还原为{0}%'.format(parseInt(perfect_rate * 100)), true);
        else
            updateInfo('Invalid prior perfect rate, return to {0}%'.format(parseInt(perfect_rate * 100)), true);
    }

}

function changeExtraCondition() {
    extra_cond = $('#extraCond').val();
    if (lang == 'CN')
        updateInfo('设置附加条件为 {0}'.format(extra_cond_text[lang][extra_cond]), false);
    else
        updateInfo('Set extra condition as {0}'.format(extra_cond_text[extra_cond]), false);
    save_local_vars();
}

function changeGuestCenter() {
    guest_center = $('#guestCenter').val();
    updateInfo('Set guest center as {0}'.format($('#guestCenter').val()), false);
}


$('#simulation .exitBtn').click(function() {
    $('#simulation').hide();
})

if (lang == 'CN') {
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    $('#exportLLH').click(function() {
        POST_JSON = {
            lang: 'CN',
            user_json: user_json,
            csrfmiddlewaretoken: '{{ csrf_token }}'
        }
        $.ajax({
            type: "POST",
            url: "LLH_convert",
            headers: {
                'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
            },
            data: POST_JSON,
            success: function(data) {
                if (data['complete']) {
                    download('submembers.sd', data.user_json);
                }
                updateInfo(data['msg'], !data['complete']);
            }
        });
    })
} else {
    // SIT importer
    var SIT = {
        get_all: function(url, callback, progress, _loaded) {
            _loaded = _loaded || 0;
            var all = [];
            $.get(url, function(data) {
                for (var i = 0; i < data.results.length; i++) all.push(data.results[i]);
                if (data.next) {
                    _loaded += all.length;
                    if (typeof progress === "function") progress(_loaded, data.count);

                    setTimeout(function() {
                        SIT.get_all(data.next, function(result) {
                            for (var i = 0; i < result.length; i++) all.push(result[i]);
                            callback(all);
                        }, progress, _loaded);
                    }, 10);
                } else {
                    callback(all);
                }
            });
        }
    };

    if (TS_page) {
        var SIT_user_name = localStorage.getItem('SIT_user_name');
        var SIT_team_list = undefined;
        if (SIT_user_name != null) {
            $('#modalSIT input').val(SIT_user_name);
            SIT.get_all("//schoolido.lu/api/accounts/?owner__username=" + encodeURIComponent(SIT_user_name),
                function(accountList) {
                    if (accountList.length === 0) {
                        alert("No SIT Accounts Found");
                        $("#modalSIT .account").html('');
                    }
                    for (var i = 0; i < accountList.length; i++) {
                        $("#modalSIT .account").append("<option value=\"" + accountList[i].id + "\">[" + accountList[i].language + "] " + accountList[i].nickname + "</select>");
                        if (i == 0) {
                            SIT.get_all("//schoolido.lu/api/teams/?owner_account=" + accountList[i].id + "&stored=Deck&card__rarity=UR,SSR,SR,R&expand_card", function(teamList) {
                                SIT_team_list = {};
                                $("#modalSIT .team").html('');
                                for (var j = 0; j < teamList.length; j++) {
                                    SIT_team_list[teamList[j].name] = teamList[j].members;
                                    $("#modalSIT .team").append("<option value=\"" + teamList[j].name + "\">" + teamList[j].name + "</select>");
                                }
                            });
                        }
                    }
                });
        }

        var SIT_user_name = localStorage.getItem('SIT_user_name');
        var SIT_team_list = undefined;
        if (SIT_user_name != null) {
            $('#modalSIT input').val(SIT_user_name);
            SIT.get_all("//schoolido.lu/api/accounts/?owner__username=" + encodeURIComponent(SIT_user_name),
                function(accountList) {
                    if (accountList.length === 0) {
                        alert("No SIT Accounts Found");
                        $("#modalSIT .account").html('');
                    }
                    for (var i = 0; i < accountList.length; i++) {
                        $("#modalSIT .account").append("<option value=\"" + accountList[i].id + "\">[" + accountList[i].language + "] " + accountList[i].nickname + "</select>");
                        if (i == 0) {
                            SIT.get_all("//schoolido.lu/api/teams/?owner_account=" + accountList[i].id + "&stored=Deck&card__rarity=UR,SSR,SR,R&expand_card", function(teamList) {
                                SIT_team_list = {};
                                $("#modalSIT .team").html('');
                                for (var j = 0; j < teamList.length; j++) {
                                    SIT_team_list[teamList[j].name] = teamList[j].members;
                                    $("#modalSIT .team").append("<option value=\"" + teamList[j].name + "\">" + teamList[j].name + "</select>");
                                }
                            });
                        }
                    }
                });
        }

        $('#importSIT').click(function() {
            $('#modalSIT').show()
        })
        $('#modalSIT .exitBtn').click(function() {
            $('#modalSIT').hide()
        })
        $('#modalSIT input').change(function() {
            SIT_user_name = $(this).val()
            SIT.get_all("//schoolido.lu/api/accounts/?owner__username=" + encodeURIComponent(SIT_user_name),
                function(accountList) {
                    if (accountList.length === 0) {
                        alert("No SIT Accounts Found");
                        $("#modalSIT .account").html('');
                    }
                    $("#modalSIT .account").html('');
                    for (var i = 0; i < accountList.length; i++) {
                        localStorage.setItem('SIT_user_name', SIT_user_name);
                        $("#modalSIT .account").append("<option value=\"" + accountList[i].id + "\">[" + accountList[i].language + "] " + accountList[i].nickname + "</select>");
                    }
                });

        })
        $('#modalSIT .account').change(function() {
            var id = $("#modalSIT .account").val();
            SIT.get_all("//schoolido.lu/api/teams/?owner_account=" + encodeURIComponent(id) + "&stored=Deck&card__rarity=UR,SSR,SR,R&expand_card", function(teamList) {
                SIT_team_list = {};
                $("#modalSIT .team").html('');
                for (var i = 0; i < teamList.length; i++) {
                    SIT_team_list[teamList[i].name] = teamList[i].members;
                    $("#modalSIT .team").append("<option value=\"" + teamList[i].name + "\">" + teamList[i].name + "</select>");
                }
            });

        })
        var max_bond_dict = {
            false: {
                N: 25,
                R: 100,
                SR: 250,
                SSR: 375,
                UR: 500
            },
            true: {
                N: 50,
                R: 200,
                SR: 500,
                SSR: 750,
                UR: 1000
            }
        }
        $('#modalSIT button').click(function() {
            var team_name = $("#modalSIT .team").val();
            if (team_name == null) {
                alert('There is no team selected.')
            } else {
                var team_sel = SIT_team_list[team_name],
                    team_info = Array(10).fill(0);
                for (var x = 1; x <= 9; x++) {
                    if (team_sel[x - 1] == null) {
                        team_info[x] = { "level": 40, "love": 100, "rank": 1, "removable": [], "unit_id": 49, "unit_skill_level": 1, "unit_removable_skill_capacity": 1 }
                    } else {
                        var card = team_sel[x - 1].card,
                            idolized = team_sel[x - 1].idolized;
                        team_info[x] = {
                            level: idolized ? card.idolized_max_level : card.non_idolized_max_level,
                            love: max_bond_dict[idolized][card.rarity],
                            rank: 1 + idolized,
                            removable: [],
                            unit_id: card.game_id,
                            unit_skill_level: team_sel[x - 1].skill,
                            unit_removable_skill_capacity: team_sel[x - 1].skill_slots
                        }
                    }
                }
                team_json = JSON.stringify(team_info);
                localStorage.setItem('team_json', team_json);
                $('#userJSON .profile').val(team_json);
                $('#modalSIT').hide();
            }
        })
    } else {
        var SIT_user_name = localStorage.getItem('SIT_user_name');
        if (SIT_user_name != null) {
            $('#modalSIT input').val(SIT_user_name);
            SIT.get_all("https://schoolido.lu/api/accounts/?owner__username=" + encodeURIComponent(SIT_user_name),
                function(accountList) {
                    if (accountList.length === 0) {
                        alert("No SIT Accounts Found");
                        $("#modalSIT select").html('');
                    }
                    for (var i = 0; i < accountList.length; i++) {
                        $("#modalSIT select").append("<option value=\"" + accountList[i].id + "\">[" + accountList[i].language + "] " + accountList[i].nickname + "</select>");
                    }
                });
        }

        $('#importSIT').click(function() {
            $('#modalSIT').show()
        })
        $('#modalSIT .exitBtn').click(function() {
            $('#modalSIT').hide()
        })
        $('#modalSIT input').change(function() {
            SIT_user_name = $(this).val()
            SIT.get_all("https://schoolido.lu/api/accounts/?owner__username=" + encodeURIComponent(SIT_user_name),
                function(accountList) {
                    if (accountList.length === 0) {
                        alert("No SIT Accounts Found");
                        $("#modalSIT select").html('');
                    }
                    $("#modalSIT select").html('');
                    for (var i = 0; i < accountList.length; i++) {
                        localStorage.setItem('SIT_user_name', SIT_user_name);
                        $("#modalSIT select").append("<option value=\"" + accountList[i].id + "\">[" + accountList[i].language + "] " + accountList[i].nickname + "</select>");
                    }
                });

        })
        $('#modalSIT button').click(function() {
            var id = $("#modalSIT select").val();
            SIT.get_all("https://schoolido.lu/api/ownedcards/?owner_account=" + encodeURIComponent(id) + "&stored=Deck&card__rarity=UR,SSR,SR,R&expand_card", function(cardList) {
                POST_JSON = {
                    lang: 'EN',
                    username: $("#modalSIT input").val(),
                    account: $('#modalSIT option[value="{0}"]'.format(id)).text(),
                    SIT_json: JSON.stringify(cardList),
                    csrfmiddlewaretoken: '{{ csrf_token }}'
                }
                $.ajax({
                    type: "POST",
                    url: "SIT_convert",
                    headers: {
                        'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
                    },
                    data: POST_JSON,
                    success: function(data) {
                        if (data['complete']) {
                            user_json = data['user_json'];
                            localStorage.setItem('user_json', user_json);
                            $('#userJSON .profile').val(user_json);

                            user_json_bucket['auto save'] = user_json;
                            localStorage.setItem('user_json_bucket', JSON.stringify(user_json_bucket));

                            updateInfo(data['msg'], !data['complete']);
                            $('#modalSIT').hide()
                        } else {
                            alert('Import SIT account failed.')
                            updateInfo(data['msg'], !data['complete']);
                        }
                    }
                });
            });
        })
    }
}