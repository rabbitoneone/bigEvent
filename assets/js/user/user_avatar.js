$(function () {
    //jQuery-cropper插件实现头像头片的抓取功能
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    let layer = layui.layer
    // 1.2 配置选项
    let options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    //设置上传按钮上传文件
    //设置点击事件 触发file的点击
    //根据file的Dom对象 files 获取图片信息
    $('#btnChooseImage').click(function () {
        $('#file').click()
    })
    //将图片设置可以预览
    $('#file').change(function () {
        // 拿到用户选择的文件
        let file = this.files[0]
        // 根据选择的文件，创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    //点击确定按钮 发送图片 更改头像
    $('#btnCreateAvatar').click(function () {
        console.log(1)
        let base64Str = $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        });
        let dataURL = encodeURIComponent(base64Str.toDataURL());
        // //发送ajax提交字符串给接口
        axios.post('/my/update/avatar', 'avatar=' + dataURL).then(res => {
            // console.log(res)
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)
            window.parent.getUserInfo()
        })
    })
})