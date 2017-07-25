// Simulation
function simulate(P_rate, live_group, live_attr, card_info, note_list, skillup, scoreup) {
    var combo_aux = [1.00, 1.10, 1.15, 1.15, 1.20, 1.20, 1.20, 1.20, 1.25, 1.25, 1.25, 1.25, 1.30, 1.30, 1.30, 1.30, 1.35]

    var total_score = 0,
        total_PLock_score = 0,
        total_skill_score = 0;
    var combo = 0,
        perfect_count = 0,
        star_perfect_count = 0;
    var skill_counter = Array(9).fill(0),
        used_counter = Array(9).fill(0);
    var attr_score_detail = Array(9).fill(0),
        PLock_score_detail = Array(9).fill(0),
        skill_score_detail = Array(9).fill(0);
    var time_elapsed = 0,
        PLock_remain = 0,
        trigger = {};
    var PLock_track = Array(note_list.length).fill(0);

    var live_attr_idx = attribute_arr.indexOf(live_attr);
    var attr_stregth = card_info.tot_attr_strength[0][live_attr_idx],
        PLock_attr_stregth = card_info.tot_attr_strength[1][live_attr_idx]
    skills = card_info.skill_info;
    var attr_fraction = Array(9).fill(0),
        PLock_attr_fraction = Array(9).fill(0),
        PLock_only_fraction = Array(9).fill(0);
    for (var x = 0; x < 9; x++) {
        attr_fraction[x] = card_info.strength_fraction[0][x][live_attr_idx];
        PLock_attr_fraction[x] = card_info.strength_fraction[1][x][live_attr_idx];
        PLock_only_fraction[x] = (PLock_attr_fraction[x] * PLock_attr_stregth - attr_fraction[x] * attr_stregth) / PLock_attr_stregth;
    }


    for (var idx = 0; idx < note_list.length; idx++) {
        var PLocking = (PLock_remain > note_list[idx].timing_sec);
        var base_value = PLocking ? PLock_attr_stregth : attr_stregth;
        var attr_bonus = (live_attr == card_info.attr[note_list[idx].position]) ? 1.1 : 1,
            group_bonus = (live_group == card_info.group[note_list[idx].position]) ? 1.1 : 1;

        var combo_bonus = combo > 800 ? 1.35 : combo_aux[parseInt(combo / 50)];
        var type_bonus = (note_list[idx].long ? 1.25 * P_rate + 1.1 * (1 - P_rate) : 1) * (note_list[idx].swing ? 0.5 : 1);
        var is_perfect = PLocking ? 1 : (Math.random() < P_rate);
        var judge_bonus = is_perfect ? 1.25 : 1.1;
        var tap_score = Math.floor(0.01 * scoreup * base_value * judge_bonus * type_bonus * combo_bonus * group_bonus * attr_bonus);

        combo++;
        perfect_count += is_perfect;
        star_perfect_count += note_list[idx].star & is_perfect;
        total_score += tap_score;
        for (var x = 0; x < 9; x++) {
            if (PLocking) {
                attr_score_detail[x] += attr_fraction[x] * tap_score;
            } else {
                attr_score_detail[x] += (attr_fraction[x] - PLock_only_fraction[x]) * tap_score;
                PLock_score_detail[x] += PLock_only_fraction[x] * tap_score;
            }

        }
        if (PLocking) {
            PLock_track[idx] = 1;
            total_PLock_score += tap_score * (PLock_attr_stregth - attr_stregth) / PLock_attr_stregth
        }

        triggers = {
            'Time': note_list[idx].timing_sec,
            'Note': combo,
            'Combo': combo,
            'Score': total_score,
            'Perfect': perfect_count,
            'Star': star_perfect_count
        }

        for (var x = 0; x < 9; x++) {
            skill_counter[x] = triggers[skills[x].trigger_type];
            while (skill_counter[x] - used_counter[x] >= skills[x].trigger_count) {
                used_counter[x] += skills[x].trigger_count;
                var rnd = 100.0 * Math.random() / skillup;
                if (rnd < skills[x].odds) {
                    switch (skills[x].effect_type) {
                        case 'Score Up':
                        case 'Stamina Restore':
                            {
                                total_score += skills[x].score;
                                total_skill_score += skills[x].score;
                                skill_score_detail[x] += skills[x].score;
                                break;
                            }
                        case 'Strong Judge':
                        case 'Weak Judge':
                            {
                                PLock_remain = Math.max(note_list[idx].timing_sec + skills[x].reward, PLock_remain);
                                if (skills[x].trigger_type == 'Time')
                                    used_counter[x] += skills[x].reward; // time-based hantei card
                                break;
                            }
                    }
                }
            }
        }
    }
    var result = {
        'total_score': total_score,
        'total_attr_score': total_score - total_skill_score - total_PLock_score,
        'total_PLock_score': total_PLock_score,
        'total_skill_score': total_skill_score,
        'attr_score_detail': attr_score_detail,
        'PLock_score_detail': PLock_score_detail,
        'skill_score_detail': skill_score_detail,
        'PLock_track': PLock_track
    }
    return result
}

function MonteCarlo(n_trial, P_rate, live_group, live_attr, card_info, note_list, skillup, scoreup) {
    var attr_score_detail = Array(9).fill(0),
        PLock_score_detail = Array(9).fill(0),
        skill_score_detail = Array(9).fill(0);
    var PLock_track = Array(note_list.length).fill(0);
    var hist = {};

    for (var i = 0; i < n_trial; i++) {
        // if (i % 100 == 0) console.log("Round " + i);
        var result = simulate(P_rate, live_group, live_attr, card_info, note_list, skillup, scoreup);

        for (var x = 0; x < 9; x++) {
            attr_score_detail[x] += result.attr_score_detail[x];
            PLock_score_detail[x] += result.PLock_score_detail[x];
            skill_score_detail[x] += result.skill_score_detail[x];
        }
        for (var x = 0; x < note_list.length; x++) {
            PLock_track[x] += result.PLock_track[x];
        }
        if (hist[parseInt((result.total_score + 500) / 1000)])
            hist[parseInt((result.total_score + 500) / 1000)]++;
        else
            hist[parseInt((result.total_score + 500) / 1000)] = 1;
    }

    var card_attr_score = Array(9).fill(0),
        card_PLock_score = Array(9).fill(0),
        card_skill_score = Array(9).fill(0),
        card_total_score = Array(9).fill(0);
    for (var x = 0; x < 9; x++) {
        card_attr_score[x] = (attr_score_detail[x] / n_trial).toFixed(1);
        card_PLock_score[x] = (PLock_score_detail[x] / n_trial).toFixed(1);
        card_skill_score[x] = (skill_score_detail[x] / n_trial).toFixed(1);
        card_total_score[x] = ((attr_score_detail[x] + PLock_score_detail[x] + skill_score_detail[x]) / n_trial).toFixed(1);
    }
    var game_score_data = [],
        PLock_data = [];
    for (var x in hist)
        game_score_data.push([x * 1000, hist[x]]);
    for (var x = 0; x < note_list.length; x++) {
        PLock_data.push({ x: parseFloat(note_list[x].timing_sec.toFixed(3)), y: PLock_track[x] / n_trial, index: x + 1 })
    }
    res = {
        'card_attr_score': card_attr_score,
        'card_PLock_score': card_PLock_score,
        'card_skill_score': card_skill_score,
        'card_total_score': card_total_score,
        'game_score_data': game_score_data,
        'PLock_data': PLock_data,
    }
    var PR = 0;
    for (var x in PLock_track) {
        PR += PLock_track[x];
    }
    console.log(PR / PLock_track.length / n_trial);
    return res
}

function draw_simul(simal_name, CR_name, res) {
    Highcharts.chart(simal_name, {
        chart: { type: 'column' },
        title: { text: 'Simulation Results' },
        xAxis: [{
            title: {
                text: 'Game Score',
                style: {
                    "fontSize": "18px",
                    fontWeight: 'bold'
                }
            }
        }],
        yAxis: [{
            title: {
                text: 'Frequency',
                style: {
                    "fontSize": "18px",
                    fontWeight: 'bold'
                }
            }
        }],
        series: [{
            name: 'Frequency',
            data: res.game_score_data,
            pointRange: 1000,
            borderWidth: .5,
            pointPadding: .015,
            groupPadding: 0,
            showInLegend: false
        }]
    });

    Highcharts.chart(CR_name, {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'P-Lock Cover Probability'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        scrollbar: {
            enabled: true
        },
        xAxis: {
            title: {
                text: 'Time (sec)',
                style: {
                    "fontSize": "18px",
                    fontWeight: 'bold'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Cover Probability',
                style: {
                    "fontSize": "18px",
                    fontWeight: 'bold'
                }
            },
            min: 0,
            max: 1
        },
        legend: {
            enabled: false
        },
        tooltip: {
            crosshairs: true,
            formatter: function() {
                return 'Note {0} <br></br>t = {1} s <br></br>CR = {2}%'.format(this.point.index, this.x, Math.round(1000 * this.y) / 10);
            }
        },
        plotOptions: {
            line: {
                lineWidth: 3
            },
            series: {
                turboThreshold: 6000,
                marker: {
                    fillColor: 'red',
                    lineWidth: 2,
                }
            }
        },
        series: [{
            data: res.PLock_data
        }]
    });
}

function createTable(parent, tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    tableData.forEach(function(rowData) {
        var row = document.createElement('tr');

        rowData.forEach(function(cellData) {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    document.getElementById(parent).appendChild(table);
}

function show_simul_result(simul_result, res, icons) {
    var table = Array(5);
    var row_header = ['Icon', 'Base Attribute', 'PLock Extra', 'Skill', 'Total'];
    var field_name = [0, 'card_attr_score', 'card_PLock_score', 'card_skill_score', 'card_total_score'];
    for (var x in row_header) {
        table[x] = Array(11).fill(0);
        table[x][0] = '<b>' + row_header[x] + '</n>';
        for (var i = 1; i <= 9; i++) {
            if (x == 0) {
                table[x][i] = '<img src="' + icons[i-1] + '">';
            } else {
                table[x][i] = res[field_name[x]][i-1];
                table[x][10] += parseFloat(res[field_name[x]][i-1]);
            }
        }
        if (x == 0) {
            table[x][10] = '<b>Team Total</b>';
        } else {
            table[x][10] = table[x][10].toFixed(1);
        }
    }

    var title = '<div style="width:100%;border: 1px solid black; text-align:center; background-color:green; color:white"><b>Simulation Scoring Statistics</b></div>';
    var temp = '<table><tbody>'
    for (var x in table) {
        temp += '<tr>';
        for (var y in table[x]) {
            temp += '<td>' + table[x][y] + '</td>';
        }
        temp += '</tr>';
    }
    temp += '</tbody></table>'

    $('#'+simul_result).html(title+temp);
}