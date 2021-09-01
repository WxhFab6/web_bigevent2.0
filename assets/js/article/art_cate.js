$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var indexAdd = null;
    //1获取文章分类的列表
    initArtCateList();


    //添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });


    //由于form表单不是一开始就存在于HTML结构中的 是点击了添加类别按钮后才生成的
    //所以要利用事件代理来绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
            }
        });
        //添加成功后重新获取表格数据
        initArtCateList();

        layer.msg('新增分类成功！');

        //根据索引关闭弹出层
        layer.close(indexAdd);

    });

    var indexEdit = null;
    //通过事件代理的形式为btn-edit按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-edit').html()
        });

        //已有信息填充到表单按钮 根据ID
        var id = $(this).attr('data-id');
        //发起请求获取对应的信息
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        });


        //通过代理方式为修改分类的表单绑定submit
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('更新数据失败！');
                    }
                    layer.msg('更新数据成功！');
                    layer.close(indexEdit);
                    initArtCateList();
                }

            });
        })
    });


    //通过事件代理为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            });
        });
    });


    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
            }
        });
    }
});