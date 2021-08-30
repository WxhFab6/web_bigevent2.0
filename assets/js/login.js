$(function () {
    //从layui中获得form对象
    var form = layui.form;
    //从layui中获得layer对象弹框提示消息
    var layer = layui.layer;


    //点击去注册账号的连接
    $('#link_reg').on('click', () => {
        $('.login-box').hide();
        $('.reg-box').show();
    });


    //点击去登录
    $('#link_login').on('click', () => {
        $('.reg-box').hide();
        $('.login-box').show();
    });


    //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义密码的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        //校验两次密码是否一致的规则
        repwd: (value) => {
            //通过形参拿到的是确认密码框中的内容作等于判断则弹出提示消息
            var pwd = $('#reg-password').val();
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }
    });

    //监听注册表单的提交事件
    $('#form_reg').on('submit', (e) => {
        //阻止表单默认提交行为
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data, (res) => {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！')
            //注册成功后用程序模拟点击事件
            $('#link_login').click();
        });
    });

    //监听登录表单的提交事件  (注意 只有用这种格式写才能够登陆成功！)
    $('#form_login').submit(function (e) {
        //阻止表单默认提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                //登录成功后将token存储到本地localStorage中
                localStorage.setItem('token', res.token);
                //登录成功后跳转到index主页
                location.href = '/index.html';
            }
        });
    });






























});