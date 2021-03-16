$(function () {
    //初始化渲染当前页面
    //后台需求四个参数 因为这个页面ajax请求多 
    //可以设置成对象里面去 方便传参以及更改
    let laypage = layui.laypage
    let form = layui.form

    let query = {
        pagenum: 1,	    //是	int	页码值
        pagesize: 2,    //是	int	每页显示多少条数据
        cate_id: '',	//否	string	文章分类的 Id
        state: ''	    //否	string	文章的状态，可选值有：已发布、草稿
    }//默认显示一页 展示两个数据 
    // 发送ajax请求 初始化页面
    initArtList()
    function initArtList() {
        axios.get('/my/article/list', {
            params: query,
        }).then(res => {
            // 清空
            $('tbody').empty()
            // 遍历生成结构
            res.data.data.forEach(item => {
                $(`<tr>
                <td>${item.title}</td>
                <td>${item.cate_name}</td>
                <td>${formate(new Date(item.pub_date))}</td>
                <td>${item.state}</td>
                <td>
                  <button type="button" data-id='${item.Id}' class="layui-btn layui-btn-xs btn_edit">
                    编辑
                  </button>
                  <button type="button"  data-id='${item.Id}' class="layui-btn layui-btn-danger layui-btn-xs btn_delete">
                    删除
                  </button>
                </td>
              </tr>`).appendTo('tbody')
            })
            //添加分页
            addPage(res)

        })
    }
    //设置分类选项 因为是动态生成的 需要layuui手动重新渲染
    axios.get('/my/article/cates').then(res => {
        res.data.data.forEach(item => {
            //创建结构添加至cateSelect中
            $(`<option value="${item.Id}">${item.name}</option>`).appendTo('#cateSelect')
        })
        form.render('')
    })
    //筛选功能 
    //解决bug 在最后一页进行筛选
    //卡在最后一页的问题
    //设置点击按钮筛选时,页面改为1
    $('#form').on('submit', function (e) {
        e.preventDefault()
        //获取文章的id 和状态 发送至后台 重新渲染页面//cateSelect 分类   //stateSelect 状态
        let id = $('#cateSelect').val()
        let state = $('#stateSelect').val()
        query.cate_id = id
        query.state = state
        query.pagenum = 1
        initArtList()
    })
    //添加分页面结构//页面切换功能
    function addPage(res) {
        laypage.render({
            elem: 'page-box' //注意，这里的 test1 是 ID，不用加 # 号
            , count: res.data.total //数据总数，从服务端得到
            , limit: query.pagesize//每页显示个数
            , curr: query.pagenum
            , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
            , limits: [1, 2, 5, 10, 20]
            , jump: function (obj, first) {
                query.pagenum = obj.curr
                query.pagesize = obj.limit//设置每页显示的动态个数
                // console.log(query.pagenum)
                // //首次不执行
                if (!first) {
                    //do something
                    initArtList()
                }
            }
        })
    }
    //格式化时间
    function formate(time) {
        let y = time.getFullYear()
        let mm = addZero(time.getMonth() + 1)
        let day = addZero(time.getDate())
        let h = addZero(time.getHours())
        let m = addZero(time.getMinutes())
        let s = addZero(time.getSeconds())
        return `${y}-${mm}-${day} ${h}:${m}:${s}`

    }
    //补零操作
    function addZero(n) {
        return n < 10 ? '0' + n : n
    }

    // //删除操作
    //判断当前页面的删除按钮的个数
    //如果只有一个 需要将pagenum - 1 且不能小于1
    $('body').on('click', '.btn_delete', function () {
        let id = $(this).attr('data-id')
        //设置提示框 确认是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            axios.get('/my/article/delete/' + id).then(res => {
                if ($('.btn_delete').length === 1) {
                    query.pagenum === 1 ? query.pagenum = 1 : query.pagenum--
                }
                if (res.data.status !== 0) {
                    return layer.msg('删除失败')
                }
                layer.msg('删除成功')
                initArtList()
                layer.close(index)
            });

        })
    })
    //编辑操作
    //点击效果: 会弹出发表文章的页面,数据初始化为点击表单的对应数据
    $('body').on('click', '.btn_edit', function () {
        // console.log($(this).attr('data-id'))
        let id = $(this).attr('data-id')
        axios.get('/my/article/' + id).then(res => {
            // console.log(res)
            if (res.data.status !== 0) {
                return layer.msg('进入编辑失败')
            }
            //发送ajax请求获取信息
            $('body').children().hide()
            $(`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Document</title>
            <link rel="stylesheet" href="../assets/lib/layui/css/layui.css" />
            <link rel="stylesheet" href="../assets/css/article/art_publish.css" />
            <link rel="stylesheet" href="../assets/lib/cropper/cropper.css" />
          </head>
        
          <body id="editBody">
            <!-- 面板区域 -->
            <div class="layui-card">
              <div class="layui-card-header">修改文章</div>
              <div class="layui-card-body">
                <!-- 表单区域 -->
                <form class="layui-form" id="editForm" lay-filter="editForm">
                  <!-- 文章标题 -->
                  <div class="layui-form-item">
                    <label class="layui-form-label">文章标题</label>
                    <div class="layui-input-block">
                      <input
                        id='editTitleInput'
                        type="text"
                        name="title"
                        required
                        lay-verify="required"
                        placeholder="请输入标题"
                        autocomplete="off"
                        class="layui-input"
                      />
                    </div>
                  </div>
                  <!-- 文章类别 -->
                  <div class="layui-form-item">
                    <label class="layui-form-label">文章类别</label>
                    <div class="layui-input-block" id="art_cate">
                      <select name="cate_id" lay-verify="required">
                        <option value="">请选择文章类别</option>
                      </select>
                    </div>
                  </div>
                  <!-- 文章内容 -->
                  <div class="layui-form-item">
                    <label class="layui-form-label">文章内容</label>
                    <div class="layui-input-block" style="height: 400px">
                      <textarea name="content"></textarea>
                    </div>
                  </div>
                  <!-- 文章封面 -->
                  <div class="layui-form-item">
                    <label class="layui-form-label">文章封面</label>
                    <div class="layui-input-block cropper-container">
                      <!-- 文件选择框 -->
                      <input
                        class="layui-hide"
                        type="file"
                        id="fileCover"
                        accept="image/jpeg,image/png,image/gif,image/bmp"
                      />
                      <div class="cropper-box">
                        <img id="image" src="../../assets/images/sample2.jpg" />
                      </div>
                      <div class="right-box">
                        <div class="img-preview"></div>
                        <button
                          type="button"
                          class="layui-btn layui-btn-danger"
                          id="btnChooseCoverImage"
                        >
                          选择封面
                        </button>
                      </div>
                    </div>
                  </div>
                  <!-- 按钮区域 -->
                  <div class="layui-form-item">
                    <div class="layui-input-block">
                      <button class="layui-btn" lay-submit id="btnPublish">确认修改</button>
                      <button class="layui-btn" lay-submit id="btnSave">存为草稿</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
        
            <script src="../assets/lib/layui/layui.all.js"></script>
            <script src="../assets/lib/jquery.js"></script>
            <script src="../assets/lib/axios.min.js"></script>
            <script src="../assets/js/ajaxBase.js"></script>
            <!-- 富文本编辑器 -->
            <script src="../assets/lib/tinymce/tinymce.min.js"></script>
            <script src="../assets/lib/tinymce/tinymce_setup.js"></script>
            <!-- 图片裁剪 -->
            <script src="../assets/lib/cropper/Cropper.js"></script>
            <script src="../assets/lib/cropper/jquery-cropper.js"></script>
            <!-- 页面的 JS 文件 -->
            <script src="../assets/js/article/art_publish.js"></script>
          </body>
        </html>
        `).appendTo('body')
            //给表单赋值
            form.val("editForm", res.data.data);
            //获取状态
            let state;
            $('#artListBody').on('click', '#btnPublish', function () {
                state = '已发布'
            })
            $('#artListBody').on('click', '#btnSave', function () {
                state = '草稿'
            })
            //form表单的submit事件 收集数据
            $('#artListBody').on('submit', '#editForm', function (e) {
                let $image = $('#image')

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
                        fd.append('Id', id)
                        // fd.forEach((value, item) => {
                        //     console.log(value, item)
                        // })
                        axios.post('/my/article/edit', fd).then(res => {
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


    })


})
