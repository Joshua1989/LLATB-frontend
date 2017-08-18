// Import local profile
$('#profile-title').hover(function() {
    if (lang == 'CN')
        $('#profile-title b').text('切换本地账户')
    else
        $('#profile-title b').text('Switch Local Profile')
    $('#profile-title b').css('color', 'rgb(0,255,0)')
}, function() {
    if (lang == 'CN')
        $('#profile-title b').text('用户卡组JSON')
    else
        $('#profile-title b').text('User JSON Profile')
    $('#profile-title b').css('color', 'white')
})
$('#profile-title').click(function() {
    $('#modalLocal').show();
    $("#modalLocal select").html('');
    for (var profle_name in user_json_bucket) {
        $("#modalLocal select").append("<option value=\"{0}\">{1}</select>".format(profle_name, profle_name));
    }
})
$('#modalLocal .exitBtn').click(function() {
    $('#modalLocal').hide()
})
$('#modalLocal .import').click(function() {
    var profile_name = $('#modalLocal select').val();
    user_json = user_json_bucket[profile_name];
    localStorage.setItem('user_json', user_json);
    $('#userJSON .profile').val(user_json);
    if (lang == 'CN')
        updateInfo('成功导入本地账户 [{0}].'.format(profile_name), false);
    else
        updateInfo('Successfully import the local profile [{0}].'.format(profile_name), false);
    $('#modalLocal').hide();
    pin_reset();
})
$('#modalLocal .save').click(function() {
    var profile_name = $('#modalLocal select').val();
    var valid = inputUserJSON()
    console.log(valid, 123)
    if (valid) {
        user_json_bucket[profile_name] = user_json;
        localStorage.setItem('user_json_bucket', JSON.stringify(user_json_bucket));
        if (lang == 'CN')
            updateInfo('覆盖已存在账户 [{0}]'.format(profile_name), false);
        else
            updateInfo('Overwrite existing account [{0}]'.format(profile_name), false);
        pin_reset();
    } else {
        alert('Invalid JSON!')
    }
    $('#modalLocal').hide();
})
$('#modalLocal .create').click(function() {
    var profile_name;
    if (lang == 'CN')
        profile_name = prompt("请为新的本地账户命名:", "auto save");
    else
        profile_name = prompt("Please give a name to local profile:", "auto save");
    if (profile_name == '') {
        alert('You must give an non-empty name!')
    } else {
        var valid = inputUserJSON();
        if (valid) {
            var not_existing = user_json_bucket[profile_name] == undefined;
            user_json_bucket[profile_name] = user_json;
            localStorage.setItem('user_json_bucket', JSON.stringify(user_json_bucket));

            if (not_existing) {
                if (lang == 'CN')
                    updateInfo('新建账户 [{0}] '.format(profile_name), false);
                else
                    updateInfo('New local profile [{0}] has been created.'.format(profile_name), false);
            } else {
                if (lang == 'CN')
                    updateInfo('覆盖已存在账户 [{0}]'.format(profile_name), false);
                else
                    updateInfo('Existing local profile [{0}] has been overwritten.'.format(profile_name), false);
            }
            pin_reset();
        } else {
            alert('Invalid JSON!')
        }
    }
    $('#modalLocal').hide();
})