//分析功能
//1.发送ajax请求获取数据,初始化页面
//2.点击添加类别 弹窗结构 新增 删除
//3.点击编辑 编辑数据
//4.点击删除 删除本条信息
$(function () {
    let layer = layui.layer
    let form = layui.form
    //初始化页面 发送ajax请求
    getCate()
    function getCate() {
        axios.get('/my/article/cates').then(res => {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)
            //遍历前清空结构
            $('tbody').empty()
            //遍历生成结构
            res.data.data.forEach(item => {
                let newTr = `<tr >
            <td>${item.name}</td>
            <td>${item.alias}</td>
            <td>
              <button data-id='${item.Id}' type="button" class="layui-btn layui-btn-xs btn_edit">
                编辑
              </button>
              <button
              data-id='${item.Id}'
                type="button"
                class="layui-btn layui-btn-xs layui-btn-danger btn_delete"
              >
                删除
              </button>
            </td>
          </tr>`
                $('tbody').append(newTr)
            })
            $('tr[data-id="1"]').find('button').attr('disabled', true)
            $('tr[data-id="2"]').find('button').attr('disabled', true)
        })
    }
    //设置添加类别的弹窗结构
    let index
    $('#btnAddCate').click(function () {
        let addFormStr = `<form class="layui-form" id='newLayui-form' action="" style="margin-top: 15px; margin-right: 50px;">
                                    <!-- 第一行 分类名称 -->
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">分类名称</label>
                                        <div class="layui-input-block">
                                          <input type="text" name="name" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                            </div>
                            </div>
                                    <!-- 第二行 分类别名  -->
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">分类别名</label>
                                        <div class="layui-input-block">
                                          <input type="text" name="alias" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                            </div>
                            </div>
                                    <!-- 第三行 按钮 -->
                                    <div class="layui-form-item">
                                        <div class="layui-input-block">
                                          <button class="layui-btn" id = 'newAddBtn' lay-submit lay-filter="formDemo">确认添加</button>
                                          <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                            </div>
                            </div>
                        </form>`
        //根据layui.open设置弹出框结构
        index = layer.open({
            type: 1,
            title: '添加文章列表',
            content: addFormStr,
            area: ['500px', '300px'],
        })
    })
    //绑定添加确定按钮,事件委托注册点击事件,添加数据
    $('body').on('click', '#newAddBtn', function (e) {
        e.preventDefault()
        //获取数据 表单的serialize方法
        let data = $('#newLayui-form').serialize()
        //获取数据发送ajax请求
        axios.post('/my/article/addcates', data).then(res => {
            // console.log(res)
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.close(index);
            layer.msg('添加成功')
            //添加成功之后 隐藏提示框
            setTimeout(function () { getCate() }, 400)
        })
    })


    //根据id删除数据
    let count;
    $('tbody').on('click', '.btn_delete', function () {
        let id = $(this).attr('data-id')
        axios.get('/my/article/deletecate/' + id).then(res => {
            // console.log(res)
            layer.msg('删除成功')
            getCate()
        })

    })
    //点击 编辑更新数据
    $('tbody').on('click', '.btn_edit', function () {
        let id = $(this).attr('data-id')

        //发送ajax获取点击的id的数据
        //添加到新建数据的结构中
        axios.get("/my/article/cates/" + id).then(res => {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            console.log(res.data.data)
            let editFormStr = `<form class="layui-form"  lay-filter="editForm" id='newEditLayui-form' data-id='${res.data.data.Id}' action="" style="margin-top: 15px; margin-right: 50px;">
            <!-- 第一行 分类Id -->
            <div class="layui-form-item layui-hide">
                <label class="layui-form-label">分类Id</label>
                <div class="layui-input-block">
                  <input type="text" name="Id" required readonly lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                </div>
                </div>
            <!-- 第一行 分类名称 -->
            <div class="layui-form-item">
                <label class="layui-form-label">分类名称</label>
                <div class="layui-input-block">
                  <input type="text" name="name" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                </div>
                </div>
                         <!-- 第二行 分类别名  -->
                         <div class="layui-form-item">
                             <label class="layui-form-label">分类别名</label>
                             <div class="layui-input-block">
                               <input type="text" name="alias" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                </div>
                </div>
                         <!-- 第三行 按钮 -->
                         <div class="layui-form-item">
                             <div class="layui-input-block">
                               <button class="layui-btn" id = 'newEditAddBtn' lay-submit lay-filter="formDemo">确认修改</button>
                </div>
                </div>
            </form>`
            //根据layui.open设置弹出框结构
            count = layer.open({
                type: 1,
                title: '修改文章列表',
                content: editFormStr,
                area: ['500px', '300px'],
            })
            //利用layui提供的form.val 方法赋值 (因此为了获取Id 可以多赋值一层结构,并且隐藏,)
            form.val("editForm", res.data.data);
        })


    })
    //给编辑中添加按钮绑定点击事件
    $('body').on('click', '#newEditAddBtn', function (e) {
        e.preventDefault()
        //利用jQ提供的serialize方法获取具有name属性的表单数据
        let data = $('#newEditLayui-form').serialize()
        //发送ajax请求
        axios.post('/my/article/updatecate', data).then(res => {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            //关闭弹窗
            layer.close(count);
            //重新渲染页面
            getCate()
        })
    })
})