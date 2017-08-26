var pin_sel = false,
    pin_cards = {},
    exclude_cards = {},
    filter_cache = {};

$('#userJSON .profile').val(user_json);
$('#pin').html("<img src='{0}'>".format(img_url['Pin']));
$('#pin img').addClass('w3-grayscale-max');
$('#pinCard').hide();

function togglePin() {
    pin_sel = !pin_sel;
    if (pin_sel) {
        $('#pin img').removeClass('w3-grayscale-max');
        $('#pinCard').show();
    } else {
        $('#pin img').addClass('w3-grayscale-max');
        $('#pinCard').hide();
    }
}

function filter_cards(condition) {
    var setting_changed = filter_cache['settings'] == undefined;
    if (!setting_changed) {
        setting_changed |= filter_cache['settings'].song_list != JSON.stringify(live_selection['song_list'])
        setting_changed |= filter_cache['settings'].group != live_selection['group']
        setting_changed |= filter_cache['settings'].attribute != live_selection['attr']
        setting_changed |= filter_cache['settings'].difficulty != live_selection['diff']
        setting_changed |= filter_cache['settings'].guest_center != guest_center
        setting_changed |= filter_cache['settings'].score_up != score_up
        setting_changed |= filter_cache['settings'].skill_up != skill_up
        setting_changed |= filter_cache['settings'].perfect_rate != perfect_rate
        setting_changed |= filter_cache['settings'].extra_cond != extra_cond
        setting_changed |= filter_cache['settings'].user_profile != user_json
        setting_changed |= filter_cache['settings'].is_sm != live_selection.is_sm
        setting_changed |= filter_cache['settings'].is_random != live_selection.is_random
    }

    if (setting_changed) {
        POST_JSON = {
            lang: lang,
            song_list: JSON.stringify(live_selection['song_list']),
            group: live_selection['group'],
            attribute: live_selection['attr'],
            difficulty: live_selection['diff'],
            guest_center: guest_center,
            score_up: score_up,
            skill_up: skill_up,
            perfect_rate: perfect_rate,
            extra_cond: extra_cond,
            user_profile: user_json,
            is_sm: live_selection.is_sm,
            is_random: live_selection.is_random,
            csrfmiddlewaretoken: '{{ csrf_token }}'
        }
        $.ajax({
            type: "POST",
            url: "/build_team/filter_cards",
            headers: {
                'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
            },
            data: POST_JSON,
            success: function(data) {
                if (data['complete']) {
                    filter_cache['settings'] = {
                        song_list: JSON.stringify(live_selection['song_list']),
                        group: live_selection['group'],
                        attribute: live_selection['attr'],
                        difficulty: live_selection['diff'],
                        guest_center: guest_center,
                        score_up: score_up,
                        skill_up: skill_up,
                        perfect_rate: perfect_rate,
                        extra_cond: extra_cond,
                        user_profile: user_json,
                        is_sm: live_selection.is_sm,
                        is_random: live_selection.is_random,
                    }
                    filter_cache['all'] = data['result']['all'];
                    filter_cache['healer'] = data['result']['healer'];
                    filter_cache['plocker'] = data['result']['plocker'];
                    $('#modalPin .w3-display-container').html(data['result'][condition]);
                    $('#modalPin .w3-display-container tr').each(function(i, obj) {
                        if ($(obj).attr('style') != undefined)
                            return
                        var index = $(obj).children()[0].innerText;
                        if (Object.keys(pin_cards).indexOf(index) > -1) {
                            $(obj).addClass('selected');
                        } else if (Object.keys(exclude_cards).indexOf(index) > -1) {
                            $(obj).addClass('excluded');
                        }
                        $(obj).on("click", function() {
                            if ($(obj).attr('class') == undefined || $(obj).attr('class') == '') {
                                var icon = $($(obj).children()[2]).find('img')[0].src,
                                    slot = $(obj).children()[8].innerText,
                                    skill = $(obj).children()[9].innerText[3],
                                    level = $(obj).children()[3].innerText.split('\n')[0],
                                    bond = $(obj).children()[4].innerText.split('\n')[0];
                                pin_cards[index] = { str: '{0}/{1}/{2}/{3}'.format(slot, skill, level, bond), src: icon }
                                $(obj).addClass('selected');
                            } else if ($(obj).attr('class').indexOf('selected') > -1) {
                                exclude_cards[index] = JSON.parse(JSON.stringify(pin_cards[index]))
                                delete pin_cards[index]
                                $(obj).removeClass('selected');
                                $(obj).addClass('excluded');
                            } else {
                                delete exclude_cards[index]
                                $(obj).removeClass('excluded');
                            }
                        })
                    })
                } else {
                    if (lang == 'CN')
                        alert('读取卡组并筛选排序失败，请确认您已输入合法的用户JSON')
                    else
                        alert('Failed to read card list and filter, please verify that you have input valid user JSON.')
                }
            },
            error: function(data) {
                if (lang == 'CN')
                    alert('筛选卡牌失败，请确认是否有合法的用户JSON，并且至少有一张卡')
                else
                    alert('Failed to filter cards, please check if there is at least one card in the user profile.')
            }
        });
    } else {
        $('#modalPin .w3-display-container').html(filter_cache[condition]);
        $('#modalPin .w3-display-container tr').each(function(i, obj) {
            if ($(obj).attr('style') != undefined)
                return
            var index = $(obj).children()[0].innerText;
            if (Object.keys(pin_cards).indexOf(index) > -1) {
                $(obj).addClass('selected');
            } else if (Object.keys(exclude_cards).indexOf(index) > -1) {
                $(obj).addClass('excluded');
            }
            $(obj).on("click", function() {
                if ($(obj).attr('class') == undefined || $(obj).attr('class') == '') {
                    var icon = $($(obj).children()[2]).find('img')[0].src,
                        slot = $(obj).children()[8].innerText,
                        skill = $(obj).children()[9].innerText[3],
                        level = $(obj).children()[3].innerText.split('\n')[0],
                        bond = $(obj).children()[4].innerText.split('\n')[0];
                    pin_cards[index] = { str: '{0}/{1}/{2}/{3}'.format(slot, skill, level, bond), src: icon }
                    $(obj).addClass('selected');
                } else if ($(obj).attr('class').indexOf('selected') > -1) {
                    exclude_cards[index] = JSON.parse(JSON.stringify(pin_cards[index]))
                    delete pin_cards[index]
                    $(obj).removeClass('selected');
                    $(obj).addClass('excluded');
                } else {
                    delete exclude_cards[index]
                    $(obj).removeClass('excluded');
                }
            })
        })
    }
}

function pin_reset() {
    pin_sel = false;
    $('#pin img').addClass('w3-grayscale-max');
    $('#pinCard').hide();
    $('#modalPin').hide()
    pin_cards = {};
    exclude_cards = {};
    filter_cache = {};
    $('.icon-list .container').html('');
}

$('#pin-choose').click(function() {
    filter_cards('all')
    $('#modalPin').show()
    $('body').addClass('modal-open')
})
$('#modalPin .exitBtn').click(function() {
    var pin_len = Object.keys(pin_cards).length,
        exclude_len = Object.keys(exclude_cards).length
    if (pin_len <= 8 && exclude_len <= 8) {
        $('#modalPin').hide()
        $('body').removeClass('modal-open')
        var temp = '';
        for (var x in pin_cards) {
            temp += "<div class='icon'><div class='stats_bar'>{0}</div><img src='{1}'></div>".format(pin_cards[x].str, pin_cards[x].src)
        }
        for (var x in exclude_cards) {
            temp += "<div class='icon'><div class='stats_bar'>{0}</div><img class='w3-grayscale-max' src='{1}'></div>".format(exclude_cards[x].str, exclude_cards[x].src)
        }
        $('.icon-list .container').html(temp);
    } else {
        if (lang == 'CN')
            alert('最多可选8张强制入队卡牌，目前你有{0}张\n最多可选8强制出队卡牌，目前你有{1}张\n请返回修改选择'.format(pin_len, exclude_len))
        else
            alert('At most 8 pinned cards are allowed, you have {0}\nAt most 8 excluded cards are allowed, you have {1}\nPlease go back and modify your selection'.format(pin_len, exclude_len))
    }
})
$('#pin-heal').click(function() {
    filter_cards('healer');
})
$('#pin-plock').click(function() {
    filter_cards('plocker');
})
$('#pin-all').click(function() {
    filter_cards('all');
})
$('#pin-clear').click(function() {
    pin_cards = {};
    exclude_cards = {};
    $('#modalPin .w3-display-container tr').each(function() {
        $(this).removeClass('selected');
        $(this).removeClass('excluded');
    })
})

// Check whether input user JSON is valid
function openUserJSON() {
    $('#userJSON').show();
    $('body').addClass('modal-open')
}

function inputUserJSON() {
    $('body').removeClass('modal-open')
    temp = $('#userJSON .profile').val();
    if (temp == '') {
        user_json = '{"removable_info": {"equipment_info": {}, "owning_info": [{"unit_removable_skill_id": 1, "total_amount": 9}, {"unit_removable_skill_id": 2, "total_amount": 9}, {"unit_removable_skill_id": 3, "total_amount": 9}, {"unit_removable_skill_id": 4, "total_amount": 9}, {"unit_removable_skill_id": 5, "total_amount": 9}, {"unit_removable_skill_id": 6, "total_amount": 9}, {"unit_removable_skill_id": 7, "total_amount": 9}, {"unit_removable_skill_id": 8, "total_amount": 9}, {"unit_removable_skill_id": 9, "total_amount": 9}, {"unit_removable_skill_id": 10, "total_amount": 9}, {"unit_removable_skill_id": 11, "total_amount": 9}, {"unit_removable_skill_id": 12, "total_amount": 9}, {"unit_removable_skill_id": 13, "total_amount": 9}, {"unit_removable_skill_id": 14, "total_amount": 9}, {"unit_removable_skill_id": 15, "total_amount": 9}, {"unit_removable_skill_id": 16, "total_amount": 9}, {"unit_removable_skill_id": 17, "total_amount": 9}, {"unit_removable_skill_id": 18, "total_amount": 9}, {"unit_removable_skill_id": 19, "total_amount": 9}, {"unit_removable_skill_id": 20, "total_amount": 9}, {"unit_removable_skill_id": 21, "total_amount": 9}, {"unit_removable_skill_id": 22, "total_amount": 9}, {"unit_removable_skill_id": 23, "total_amount": 9}, {"unit_removable_skill_id": 24, "total_amount": 9}, {"unit_removable_skill_id": 25, "total_amount": 9}, {"unit_removable_skill_id": 26, "total_amount": 9}, {"unit_removable_skill_id": 27, "total_amount": 9}, {"unit_removable_skill_id": 28, "total_amount": 9}, {"unit_removable_skill_id": 29, "total_amount": 9}, {"unit_removable_skill_id": 30, "total_amount": 9}, {"unit_removable_skill_id": 31, "total_amount": 9}, {"unit_removable_skill_id": 32, "total_amount": 9}, {"unit_removable_skill_id": 33, "total_amount": 9}, {"unit_removable_skill_id": 34, "total_amount": 9}, {"unit_removable_skill_id": 35, "total_amount": 9}, {"unit_removable_skill_id": 36, "total_amount": 9}, {"unit_removable_skill_id": 37, "total_amount": 9}, {"unit_removable_skill_id": 38, "total_amount": 9}, {"unit_removable_skill_id": 39, "total_amount": 9}]}, "unit_info": [], "deck_info": []}';
        localStorage.setItem('user_json', user_json);
        $('#userJSON .profile').val(user_json);
        user_json_bucket['auto save'] = user_json;
        localStorage.setItem('user_json_bucket', JSON.stringify(user_json_bucket));
        if (lang == 'CN')
            updateInfo('用户卡组JSON设置为初始状态', false);
        else
            updateInfo('User JSON is set to be the initial state', false);
        pin_reset();
        return true;
    } else if (IsJsonString(temp)) {
        if (user_json != temp) {
            user_json_obj = JSON.parse(temp);
            json_valid = user_json_obj['unit_info'] != undefined & user_json_obj['deck_info'] != undefined & user_json_obj['removable_info'] != undefined
            if (json_valid) {
                json_valid = user_json_obj['removable_info']['equipment_info'] != undefined & user_json_obj['removable_info']['owning_info'] != undefined
            }
            minaraishi_valid = user_json_obj['idol_skills'] != undefined & user_json_obj['members'] != undefined
            if (!json_valid & !minaraishi_valid) {
                $('#userJSON .profile').val(user_json);
                if (lang == 'CN')
                    updateInfo('用户卡组JSON格式有误，回滚至上次合法JSON', true);
                else
                    updateInfo('Invalid user profile JSON, rollback to last valid version.', true);
                return false
            } else if (json_valid) {
                user_json_obj['removable_info']['equipment_info'] = {};
                user_json_obj['deck_info'] = [];
                user_json = JSON.stringify(user_json_obj);

                localStorage.setItem('user_json', user_json);
                $('#userJSON .profile').val(user_json);
                user_json_bucket['auto save'] = user_json;
                localStorage.setItem('user_json_bucket', JSON.stringify(user_json_bucket));
                if (lang == 'CN')
                    updateInfo('成功更新用户JSON', false);
                else
                    updateInfo('User profile JSON successfully updated', false);
                pin_reset();
                return true;
            } else if (minaraishi_valid) {
                POST_JSON = {
                    lang: lang,
                    minaraishi_json: temp,
                    csrfmiddlewaretoken: '{{ csrf_token }}'
                }
                $.ajax({
                    type: "POST",
                    url: "/build_team/minaraishi_convert",
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
                        }
                        updateInfo(data['msg'], !data['complete']);
                        pin_reset();
                        return data['complete']
                    },
                    error: function(data) {
                        alert('Failed to import minaraishi\'s format')
                    }
                });
            }
        } else {
            return true;
        }
    } else {
        $('#userJSON .profile').val(user_json);
        if (lang == 'CN')
            updateInfo('输入文本不是JSON格式，回滚至上次合法JSON', true);
        else
            updateInfo('Input is not valid JSON format, rollback to last valid version.', true);
        return false;
    }
}

$('#userJSON .exitBtn').click(function() {
    inputUserJSON();
    $('#userJSON').hide();
})

// calculate best team
function calculate() {
    user_json = localStorage.getItem('user_json');
    if (user_json == '' | user_json == undefined) {
        if (lang == 'CN')
            updateInfo('用户卡组JSON为空', true);
        else
            updateInfo('User profile JSON is empty', true);
        return
    }
    user_json_obj = JSON.parse(user_json)
    if (user_json_obj['unit_info'] == undefined |
        user_json_obj['deck_info'] == undefined |
        user_json_obj['removable_info'] == undefined |
        user_json_obj['removable_info']['equipment_info'] == undefined |
        user_json_obj['removable_info']['owning_info'] == undefined) {
        if (lang == 'CN')
            updateInfo('用户卡组JSON格式有误', true);
        else
            updateInfo('Invalid user profile JSON', true);
        return
    }
    if (user_json_obj['unit_info'].length < 13) {
        if (lang == 'CN') {
            updateInfo('组卡至少要有13张卡，您目前有{0}张，请继续添加卡组'.format(user_json_obj['unit_info'].length), true);
            alert('请检查你的卡组是否有13张卡以上，且至少有一张与歌曲同色稀有度N以上的卡，如果开启了锁卡模式则需要更多的卡')
        } else {
            updateInfo('You need at least 13 cards, now you have {0}, please edit your profile.'.format(user_json_obj['unit_info'].length), true);
            alert('Please check whether you have at least 13 cards, at least one card whose rarity is higher than N and has same color as the song, if the "Pinned Card Mode" is ON then you need to input more cards.')
        }
        return
    }
    $('#calculate').prop('disabled', true);
    $('#calculate').removeClass('w3-green');
    $('#calculate').addClass('w3-grey');
    $('#calculate b').text('Running');
    var i = 0;
    var running = setInterval(function() {
        i = ++i % 4;
        $("#calculate b").html("Running" + Array(i + 1).join("."));
    }, 500);

    POST_JSON = {
        lang: lang,
        song_list: JSON.stringify(live_selection['song_list']),
        group: live_selection['group'],
        attribute: live_selection['attr'],
        difficulty: live_selection['diff'],
        guest_center: guest_center,
        score_up: score_up,
        skill_up: skill_up,
        perfect_rate: perfect_rate,
        unlimit_gem: unlimit_gem,
        extra_cond: extra_cond,
        user_profile: user_json,
        is_sm: live_selection.is_sm,
        is_random: live_selection.is_random,
        pin_index: pin_sel ? JSON.stringify(Object.keys(pin_cards)) : '[]',
        exclude_index: pin_sel ? JSON.stringify(Object.keys(exclude_cards)) : '[]',
        csrfmiddlewaretoken: '{{ csrf_token }}'
    }
    $.ajax({
        type: "POST",
        url: "/build_team/calculate",
        headers: {
            'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
        },
        data: POST_JSON,
        success: function(data) {
            if (data['complete']) {
                $('#simulation').hide();
                $('#result').html(data['result']);
                if (live_selection['song_list'][0].indexOf(song_head) == -1 && !live_selection.is_sm) {
                    $('#result th').first().html("<button id='simulBtn' class='roundBtn w3-pink w3-hover-yellow' style='white-space: normal;'><b>{0}</b></button>".format(lang == 'CN' ? '进行仿真' : 'Simulate'))
                    setInterval(function() { $("#simulBtn").fadeTo('slow', 0.5).fadeTo('slow', 1); }, 2000);
                    var n_trial = 5000,
                        P_rate = parseFloat(perfect_rate),
                        live_group = group_arr[live_selection['group']],
                        live_attr = live_selection['attr'],
                        simul_card_info = JSON.parse(data.simul_base_info),
                        simul_live_info = JSON.parse(data.note_list),
                        skillup = 1 + skill_up,
                        scoreup = 1 + score_up;
                    $('#simulBtn').click(function() {
                        var simul_res = MonteCarlo(n_trial, P_rate, live_group, live_attr, simul_card_info, simul_live_info, skillup, scoreup);
                        draw_simul('simul_hist', 'cover_rate', simul_res);
                        $('#simulation').show()
                        $('#simul_hist').highcharts().reflow();
                        $('#cover_rate').highcharts().reflow();
                        show_simul_result('simul_result', simul_res, simul_card_info.icon_url);
                        if (lang == 'CN')
                            updateInfo('仿真结束', false);
                        else
                            updateInfo('Finished simulation', false);
                    })
                } else {
                    $('#simulation').hide();
                }
                $('#userJSON .LLH').val(data['sd_file']);
                $('#userJSON .ieb').val(data['ieb_file']);
            }
            updateInfo(data['msg'], !data['complete']);
            $('#calculate').prop('disabled', false);
            $('#calculate').removeClass('w3-grey');
            $('#calculate').addClass('w3-green');
            clearInterval(running);
            $('#calculate b').text('Calculate');
        },
        error: function(data) {
            if (lang == 'CN')
                alert('计算最优组队失败!')
            else
                alert('Failed to compute optimal team arrangement.')
        }
    });
}