var auto_mode = false;

$('#userJSON .profile').val(team_json);
$('#autoMode').html("<img src='{0}' height=100%>".format(img_url['AutoMode']));
$('#autoMode img').addClass('w3-grayscale-max');

function toggleAutoMode() {
    auto_mode = !auto_mode;
    if (auto_mode) {
        $('#autoMode img').removeClass('w3-grayscale-max');
    } else {
        $('#autoMode img').addClass('w3-grayscale-max');
    }
    updateInfo('Auto SIS allocation {0}'.format(auto_mode ? 'ON' : 'OFF'), false);
}
// Check whether input user JSON is valid
function openUTeamJSON() {
    $('#userJSON').show();
    $('body').addClass('modal-open')
}

function inputTeamJSON() {
    $('body').removeClass('modal-open')
    temp = $('#userJSON .profile').val();
    if (temp == '' || IsJsonString(temp)) {
        if (team_json != temp) {
            team_json_obj = JSON.parse(temp);
            if (team_json_obj.length != 10) {
                $('#userJSON .profile').val(team_json);
                updateInfo('Invalid team JSON, rollback to last valid version.', true);
                return
            } else {
                team_json = JSON.stringify(team_json_obj);
                localStorage.setItem('team_json', team_json);
                $('#userJSON .profile').val(team_json);
                updateInfo('Team JSON successfully updated', false);
            }
        }
    } else {
        $('#userJSON .profile').val(team_json);
        updateInfo('Input is not valid JSON format, rollback to last valid version.', true);
    }
    $('#userJSON').hide();
}

// calculate best team
function calculate() {
    if (AS_page) {
        var input_valid = true;
        $('.friend_score_up input').each(function() {
            input_valid &= $(this).is(':valid');
        })
        $('.friend_skill_up input').each(function() {
            input_valid &= $(this).is(':valid');
        })
        if (!input_valid) {
            alert('Friend score/skill up can only be set between 0% to 10%.')
            return
        } else if (live_selection.song_list.length == 0) {
            alert('Live songs must be chosen before simulation.')
            return
        }
    }

    var user_json = localStorage.getItem('user_json'),
        team_json = localStorage.getItem('team_json')
    if (user_json == '') {
        updateInfo('Team JSON is empty', true);
        return
    }
    var team_json_obj = JSON.parse(team_json),
        user_json_obj = JSON.parse(user_json);
    if (team_json_obj.length != 10) {
        updateInfo('Invalid team JSON', true);
        return
    }
    if (auto_mode) {
        if (user_json_obj['removable_info'] == undefined) {
            updateInfo('SIS owning information missing', true);
            return
        }
        if (user_json_obj['removable_info']['owning_info'] == undefined) {
            updateInfo('SIS owning information missing', true);
            return
        }
    }
    var temp_user_json = {
        unit_info: [],
        deck_info: [],
        removable_info: {
            equipment_info: {},
            owning_info: auto_mode ? user_json_obj['removable_info']['owning_info'] : []
        }
    };
    for (var x = 1; x <= 9; x++) {
        var CI = team_json_obj[x];
        CI['unit_owning_user_id'] = x;
        temp_user_json['unit_info'].push(CI);
    }

    $('#calculate').prop('disabled', true);
    $('#calculate').removeClass('w3-pink');
    $('#calculate').addClass('w3-grey');
    $('#calculate b').text('Running');
    var i = 0;
    var running = setInterval(function() {
        i = ++i % 4;
        $("#calculate b").html("Running" + Array(i + 1).join("."));
    }, 500);
    // $('#calculate').prop('disabled', true);
    POST_JSON = {
        lang: 'EN',
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
        user_profile: JSON.stringify(temp_user_json),
        is_sm: live_selection.is_sm,
        is_random: live_selection.is_random,
        auto_mode: auto_mode,
        csrfmiddlewaretoken: '{{ csrf_token }}'
    }
    $.ajax({
        type: "POST",
        url: "/{0}/calculate".format(AS_page ? 'advanced_simul' : 'team_strength'),
        headers: {
            'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
        },
        data: POST_JSON,
        success: function(data) {
            if (data['complete']) {
                if (TS_page && !AS_page) {
                    $('#simulation').hide();
                    $('#result').html(data['result']);
                    if (live_selection['song_list'][0].indexOf('Default') == -1 && !live_selection.is_sm) {
                        $('#result th').first().html("<button id='simulBtn' class='roundBtn w3-pink w3-hover-yellow' style='white-space: normal;'><b>Simulate</b></button>")
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
                            updateInfo('Finished simulation', false);
                        })
                    } else {
                        $('#simulation').hide();
                    }
                    $('#userJSON .LLH').val(data['sd_file']);
                    $('#userJSON .ieb').val(data['ieb_file']);
                } else if (!TS_page && AS_page) {
                    var n_trial = 5000,
                        P_rate = parseFloat(perfect_rate),
                        live_group = group_arr[live_selection['group']],
                        live_attr = live_selection['attr'],
                        simul_card_info = JSON.parse(data.simul_base_info),
                        simul_live_info = JSON.parse(data.note_list);
                    var skillup = new Array(simul_live_info.length).fill(1 + skill_up),
                        scoreup = new Array(simul_live_info.length).fill(1 + score_up);
                    var temp = 0;
                    $('.live-control-item').each(function() {
                        var current_note_number = parseInt($(this).attr('value')),
                            friend_score_up = parseInt($(this).find('.friend_score_up input').val())/100,
                            friend_skill_up = parseInt($(this).find('.friend_skill_up input').val())/100;
                        for(var x = 0; x < current_note_number; x++) {
                            scoreup[temp] *= 1 + friend_score_up;
                            skillup[temp] *= 1 + friend_skill_up;
                            temp += 1;
                        }
                    })
                    var simul_res = MonteCarlo(n_trial, P_rate, live_group, live_attr, simul_card_info, simul_live_info, skillup, scoreup);
                    draw_simul('simul_hist', 'cover_rate', simul_res);
                    $('#simulation').show()
                    $('#simul_hist').highcharts().reflow();
                    $('#cover_rate').highcharts().reflow();
                    show_simul_result('simul_result', simul_res, simul_card_info.icon_url);
                    updateInfo('Finished simulation', false);
                    $('#userJSON .LLH').val(data['sd_file']);
                    $('#userJSON .ieb').val(data['ieb_file']);
                }
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
                alert('计算队伍强度失败!')
            else
                alert('Failed to compute team strength.')
        }
    });
}