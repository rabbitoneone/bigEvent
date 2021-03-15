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
                  <button type="button" class="layui-btn layui-btn-xs btn_edit">
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
})