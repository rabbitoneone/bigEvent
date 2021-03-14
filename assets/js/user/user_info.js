//功能分析
//页面默认填写初始的登录名称(只读readonly,不可修改) 昵称 和邮箱
$(function () {
    let form = layui.form
    //发送ajax请求 获取信息数据
    axios.get('/my/userinfo').then(res => {
        // console.log(res)
        //利用layui的表单赋值进行快速操作对应赋值
        ////给表单赋值
        form.val("form", res.data.data)
        //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值 4
    })
    //表单验证
    //昵称1-6位且必填
    //邮箱要符合邮箱验证

    form.verify({
        passNickname: [/^\S{1,6}$/, '昵称是1-6位'],
    })

    //提交修改 form表单的submit事件
    $('#form').submit(function (e) {
        e.preventDefault()
        //jQ的serialize
        let data = $(this).serialize()
        //发送ajax请求 提交数据
        axios.post('/my/userinfo', data).then(res => {
            console.log(res)
            if (res.data.status !== 0) {
                return layer.msg('修改失败')
            }
            layer.msg('修改成功')
            //需要重新渲染页面 
            //iframe与index形成网页的父子结构 
            //利用window.parent获取getUserInfo方法
            console.log(window)
            window.parent.getUserInfo()
        })
    })
    //重置按钮的重置功能 重置数据为修改之前的默认值
    $('#btnReset').click(function (e) {
        e.preventDefault()//阻止默认行为
        //发送ajax请求回到默认值
        axios.get('/my/userinfo').then(res => {
            // console.log(res)
            //利用layui的表单赋值进行快速操作对应赋值
            ////给表单赋值
            form.val("form", res.data.data)
            //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值 4
        })
    })

})