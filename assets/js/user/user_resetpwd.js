$(function () {
    //修改密码区域
    //表单验证
    //1.密码为6-12位
    //2.新密码不能与原密码相同
    //3,确认新密码与新密码要保持一致 利用layui添加lay-vertify
    let form = layui.form
    let layer = layui.layer
    form.verify({
        newPwd: (value) => { //value：表单的值、item：表单的DOM对象
            if ($('#user_oldPwd').val() === value) {
                return '新密码不能与原密码相同'
            }
        },
        reNewPad: value => {
            if ($('[name="newPwd"]').val() !== value) {
                return '新密码两次输入必须相同'
            }
        },
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        len: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]
    });
    //表单form的submit事件
    $('#form').submit(function (e) {
        e.preventDefault()
        //获取表单数据
        let data = $(this).serialize()
        //发送ajax请求 修改密码
        axios.post('/my/updatepwd', data).then(res => {
            console.log(res)
            if (res.data.status !== 0) {
                return layer.msg('修改密码失败')
            }
            layer.msg('修改密码成功')
            $('#form')[0].reset()
        })
    })
})
