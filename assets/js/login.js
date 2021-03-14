$(function () {
    //去注册页点击事件
    $('#showReg').click(function () {
        $('.reg-form').show()
        $('.login-form').hide()
    })
    //去登录页面点击事件
    $('#showLogin').click(function () {
        $('.reg-form').hide()
        $('.login-form').show()
    })

    //校验规则
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pass: [/^\S{6,12}$/, '密码必须是6-12位'],
        rePass: value => value !== $('#regi_pass').val() ? '两次密码必须一致' : ''
    })

    //发送注册的ajax请求 jQ提供的serialize方法
    $('.reg-form').submit(function (e) {
        e.preventDefault();
        let data = $(this).serialize()
        axios.post('/api/reguser', data).then(function (res) {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg('注册成功')
            $('#showLogin').trigger('click')
        })
    })

    //发送登录的ajax请求 jQ提供的serialize方法 获取表单数据
    $('.login-form').submit(function (e) {
        e.preventDefault()
        let data = $(this).serialize()
        axios.post('/api/login', data).then(function (res) {
            if (res.data.status !== 0) {
                return layer.msg('登录失败')
            }
            localStorage.setItem('token', res.data.token)
            layer.msg(('登录成功'), function () {
                location.href = './index.html'
            })
        })
    })


})