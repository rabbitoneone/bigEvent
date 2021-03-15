//发布ajax请求 获取文章分类列表
//=================添加结构并渲染=================
$(function () {
    let form = layui.form
    let layer = layui.layer
    //渲染分类列表
    axios.get('/my/article/cates').then(res => {
        res.data.data.forEach(item => {
            $(`<option value="${item.Id}">${item.name}</option>`).appendTo('[name="cate_id"]')
        })
        //重新渲染
        form.render()
    })
    //=================初始化富文本编辑器=================
    initEditor()
    // =================初始化图片裁剪器=================
    let $image = $('#image')
    // 裁剪选项
    let options = {
        aspectRatio: 400 / 200
        , preview: '.img_preview'
    }
    // 初始化裁剪区域
    $image.cropper(options)
    //=================选择封面触发file=================
    $('#btnChooseCoverImage').click(function () {
        $('#fileCover').click()
    })
    //
    ///=================文件域change事件,改变图片=================
    $('#fileCover').change(function () {
        let file = this.files[0]
        console.log(file)
        let url = URL.createObjectURL(file)
        $image.cropper('destroy').attr('src', url).cropper(options)
    })
    let state;
    $('#btnPublish').click(function () {
        state = '已发布'
    })
    $('#btnSave').click(function () {
        state = '草稿'
    })
    //form表单的submit事件 收集数据
    $('#form').submit(function (e) {
        e.preventDefault()
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob((blob) => {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到blob文件对象后，进行后续的操作 ==> 通过 FormData来收集数据， ajax提交数据
                let fd = new FormData(this)
                // console.log(fd)
                fd.append('cover_img', blob)
                fd.append('state', state)
                // fd.forEach((value, item) => {
                //     console.log(value, item)
                // })
                axios.post('/my/article/add', fd).then(res => {
                    // console.log(res)
                    if (res.data.status !== 0) {
                        return layer.msg('发表失败')
                    }
                    layer.msg('发表成功')
                    location.href = 'art_list.html'
                })
            })
    })
})