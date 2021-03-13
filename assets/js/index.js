//获取头像 昵称信息 设置头像 欢迎文字
$(function () {

    let info = localStorage.getItem('token')
    console.log(info)
    //发送ajax请求获取用户信息
    axios.get('http://ajax.frontend.itheima.net/my/userinfo', {
        headers: { Authorization: info }
    }).then(function (res) {
        // console.log(res)
        //分析结构 
        //欢迎信息 欢迎 nickname优先 其次 username
        let data = res.data.data
        let name = data.nickname || data.username
        $('#welcome').text('欢迎' + name)
        //设置图片 判断头像图片优先 
        // console.log(data)
        if (data.user_pic) {
            $('.layui-nav-img').attr('src', data.user_pic).show()
            $('.text-avatar-box').hide()
        } else {
            // console.log(name[0].toUpperCase())

            $('.text-avatar-box').show().find('.text-avatar').text(name[0].toUpperCase())
        }
    })
})