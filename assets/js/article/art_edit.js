$(function () {
    var layer = layui.layer;
    var form = layui.form;
    //初始化富文本编辑器
    initEditor();
    initArtList();
    var id = window.parent.deliveryId();























    //定义得到需要修改文章的内容
    function initArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败！');
                }
                $('[name = title]').attr('placeholder', res.title);
            }
        });
    }

});
