$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    //定义一个查询参数Q，将来请求数据的时候
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//页码值
        pagesize: 2,//每件显示几条数据 默认显示两页
        cate_id: '',//文章分类的id
        state: ''//文章的发布状态
    }

    initTable();
    initCate();

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //为查询参数对象对应的属性q赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的筛选条件 重现渲染表格数据
        initTable();
    });


    //通过事件代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        //获取
        var len = $('.btn-delete').length;
        //获取文章Id
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    //数据删除成功后需要判断当前这一页是否还有剩余的数据 如果没有则让页码值-1
                    //重新调用initTable();
                    if (len === 1) {
                        //如果len =1证明删除完毕后 页面上无数据
                        //页面最小值=1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });
            layer.close(index);
        });
    });
















    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }


    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                //调用模板引擎渲染文章分类的下拉菜单子选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //通知layui重新渲染表单区域的UI结构
                form.render();
            }
        });
    }


    //定义渲染分页的方法
    function renderPage(total) {
        //调用layer.render()方法渲染分页结构
        laypage.render({
            elem: 'pageBox',//分页容器ID
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//默认选中那一页
            //分页发生切换时触发jump回调
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                //把最新的条目数Q赋值到q pagesize属性中
                q.pagesize = obj.limit;
                initTable();
                //根据最新的q获取对应的数据列表并渲染表格
                //根据first值通过哪种方式触发jump回调 first=true（laypage.render）
                //first=undefined(点击页码出发回调jump)
                if (!first) {
                    initTable();
                }
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10]
        });
    }


});