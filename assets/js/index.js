
$(function () {
    //获取头像 昵称信息 设置头像 欢迎文字
    let layer = layui.layer
    // let info = localStorage.getItem('token')
    //发送ajax请求获取用户信息
    getUserInfo()
    function getUserInfo() {
        axios.get('/my/userinfo').then(function (res) {
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
    }
    //点击注册退出功能
    $('#btnLogout').click(function () {
        layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
            //退出两件事情 
            //删除本地的token
            localStorage.removeItem('token')
            //跳转页面
            location.href = 'login.html'
            //确定之后关闭弹出框
            layer.close(index);
        });
    })

})