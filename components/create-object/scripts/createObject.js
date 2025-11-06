$(document).ready(function(){
    //用循环总有意想不到的错误
    $("nav>ul>li:eq(0)").bind("click", function(){
        $(".outline2").load('content.html #content1');
    });
    $("nav>ul>li:eq(1)").bind("click", function(){
        $(".outline2").load('content.html #content2');
    });
    $("nav>ul>li:eq(2)").bind("click", function(){
        $(".outline2").load('content.html #content3');
    });
    $("nav>ul>li:eq(3)").bind("click", function(){
        $(".outline2").load('content.html #content4');
    });
    $("nav>ul>li:eq(4)").bind("click", function(){
        $(".outline2").load('content.html #content5');
    });
    $("nav>ul>li:eq(5)").bind("click", function(){
        $(".outline2").load('content.html #content6');
    });
    $("nav>ul>li:eq(6)").bind("click", function(){
        $(".outline2").load('content.html #content7');
    });
});