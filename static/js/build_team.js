// utility for string format
String.prototype.format = function() {
    var a = this;
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
    UnlimitGem: '//r.llsif.win/assets/flash/ui/live/img/e_icon_07.png',
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
var group_sel = 'muse',
    attr_sel = 'Smile',
    diff_sel = 'Expert',
    score_up = false,
    skill_up = false,
    unlimit_gem = false,
    perfect_rate = 0.95,
    extra_cond = 'default',
    guest_center = 'None',
    auto_mode = false;
var user_json = localStorage.getItem("user_json");
var user_json_bucket = localStorage.getItem("user_json_bucket");
var default_user_json = '{"unit_info":[],"deck_info":[],"removable_info":{"equipment_info":{},"owning_info":[{"total_amount":9,"unit_removable_skill_id":1},{"total_amount":9,"unit_removable_skill_id":2},{"total_amount":9,"unit_removable_skill_id":3},{"total_amount":9,"unit_removable_skill_id":4},{"total_amount":9,"unit_removable_skill_id":5},{"total_amount":9,"unit_removable_skill_id":6},{"total_amount":9,"unit_removable_skill_id":7},{"total_amount":9,"unit_removable_skill_id":8},{"total_amount":9,"unit_removable_skill_id":9},{"total_amount":9,"unit_removable_skill_id":10},{"total_amount":9,"unit_removable_skill_id":11},{"total_amount":9,"unit_removable_skill_id":12},{"total_amount":9,"unit_removable_skill_id":13},{"total_amount":9,"unit_removable_skill_id":14},{"total_amount":9,"unit_removable_skill_id":15},{"total_amount":9,"unit_removable_skill_id":16},{"total_amount":9,"unit_removable_skill_id":17},{"total_amount":9,"unit_removable_skill_id":18},{"total_amount":9,"unit_removable_skill_id":19},{"total_amount":9,"unit_removable_skill_id":20},{"total_amount":9,"unit_removable_skill_id":21},{"total_amount":9,"unit_removable_skill_id":22},{"total_amount":9,"unit_removable_skill_id":23},{"total_amount":9,"unit_removable_skill_id":24},{"total_amount":9,"unit_removable_skill_id":25},{"total_amount":9,"unit_removable_skill_id":26},{"total_amount":9,"unit_removable_skill_id":27},{"total_amount":9,"unit_removable_skill_id":28},{"total_amount":9,"unit_removable_skill_id":29},{"total_amount":9,"unit_removable_skill_id":30},{"total_amount":9,"unit_removable_skill_id":31},{"total_amount":9,"unit_removable_skill_id":32},{"total_amount":9,"unit_removable_skill_id":33},{"total_amount":9,"unit_removable_skill_id":34},{"total_amount":9,"unit_removable_skill_id":35},{"total_amount":9,"unit_removable_skill_id":36},{"total_amount":9,"unit_removable_skill_id":37},{"total_amount":9,"unit_removable_skill_id":38},{"total_amount":9,"unit_removable_skill_id":39}]}}';
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

var team_json = localStorage.getItem("team_json");
if (team_json == null) {
    team_json = '[0,{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":982,"unit_skill_level":8,"unit_removable_skill_capacity":8},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1027,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1004,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1131,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1109,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1075,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1048,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1177,"unit_skill_level":1,"unit_removable_skill_capacity":4},{"level":100,"love":1000,"rank":2,"removable":[],"unit_id":1153,"unit_skill_level":1,"unit_removable_skill_capacity":4}]';
    localStorage.setItem("team_json", team_json)
}

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
function updateLiveSwiper(lang) {
    swiper.removeAllSlides()
    // Default live
    var default_name = (lang == CN ? '默认谱面' : 'Default') + ' {0} {1}'.format(group_arr[group_sel], attr_sel);
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
                            if (lang=='CN')
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