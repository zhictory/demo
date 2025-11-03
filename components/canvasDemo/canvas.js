var add = document.getElementById("add");
var del = document.getElementById("del");

if(add.getContext && del.getContext){
    var context = add.getContext("2d");
    context.fillStyle = "green";
    context.fillRect(0, 60, 300, 25);
    context.fillRect(122, 0, 50, 300);
    
    context = del.getContext("2d");
    context.fillStyle = "red";
    context.fillRect(0, 60, 300, 25);
}

$("#add").bind("click", function(){
    var $select = $("<select class='select'></select>");
    var $option = $(
        "<option>我想大声宣布</option>"+
        "<option>我想大声宣布</option>"+
        "<option>我想大声宣布</option>"+
        "<option>我想大声宣布</option>"
    );
    $select.append($option);
    $("#lesson").append($select);
});

$("#del").bind("click", function(){
    if($("#lesson select").length > 1){
        $("#lesson").children(":last").remove();
    }
});