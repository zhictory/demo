$(document).ready(function(){
    if($(".listen").css("left") == "0px"){
        $(".lbtn").css("display", "block");
        $(".rbtn").css("display", "none");
    }
    else{
        $(".lbtn").css("display", "none");
        $(".rbtn").css("display", "block");
    }
    $(".lbtn").bind("click", function(){
        $(".listen").css("left", "-1366px");
        $(".channel").css("left", "0px");
        $(".lbtn").css("display", "none");
        $(".rbtn").css("display", "block");
    });
    $(".rbtn").bind("click", function(){
        $(".listen").css("left", "0px");
        $(".channel").css("left", "1366px");
        $(".lbtn").css("display", "block");
        $(".rbtn").css("display", "none");
    });
});