//优化axios发送请求的根路径
axios.defaults.baseURL = 'http://ajax.frontend.itheima.net'
//拦截优化请求的头信息以及登录身份失效操作
//拦截优化请求的头信息
// 添加请求拦截器 会在then和catch之前 拦截操作
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (config.url.indexOf('/my') !== -1) {
        config.headers.Authorization = localStorage.getItem('token')
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    console.log('response', response)
    //删除token
    if (response.data.status !== 0 && response.data.message !== "获取用户基本信息成功！") {
        localStorage.removeItem('token')
        // 跳转值登录页
        location.href = '/login.html'
    }

    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});