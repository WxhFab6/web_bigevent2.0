$(function () {
    //导入layer
    var layer = layui.layer;
    //调用getUserInfo获取用户基本信息
    getUserInfo();


    //退出按钮功能
    $('#btnLogout').on('click', function () {
        //提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1清空本地token
            localStorage.removeItem('token');

            //2重新跳回登录页
            location.href = '/login.html';

            //3关闭confirm询问框
            layer.close(index);
        });
    });




























});
//获取用户基本信息的方法
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //请求头配置对象
        //headers: {
        //   Authorization: localStorage.getItem('token') || ''
        //},
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！');
            }
            //调用渲染用户头像函数
            renderAvatar(res.data);
        },
        //不论成功还是失败都会调用complete函数 必须登陆之后才能进入后台主页
        //complete: function (res) {
        //在complete回调函数中可以使用res.responseJSON拿到服务器响应回来的数据
        //  if (res.responseJSON.status === 1 & res.responseJSON.message === '身份认证失败！') {
        //1强制清空token
        //  localStorage.removeItem('token');
        //  //2强制跳转到登录页
        //  location.href = '/login.html';
        // }
        //}
    });
}

//这是渲染用户信息的头像
function renderAvatar(user) {
    //1.获取用户名称
    var name = user.nickname || user.username;
    //2.设置欢迎的文本
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name);
    //3.按需渲染用户的头像
    if (user.user_pic !== null) {
        //3.1渲染用户自己设置的头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //3.2渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}