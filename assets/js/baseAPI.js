//每次调佣$.get $.post $.ajax 会先调用这个函数  
//在这个函数中可以拿到我们给AJAX提供的对象
$.ajaxPrefilter(function (options) {
    //再发起真正的Ajax之前 统一拼接请求的地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    //统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    //全局统一挂载complete回调函数
    options.complete = function (res) {
        //在complete回调函数中可以使用res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 & res.responseJSON.message === '身份认证失败！') {
            //1强制清空token
            localStorage.removeItem('token');
            //2强制跳转到登录页
            location.href = '/login.html';
        }
    }
});