var angle = 36;
$("#J_start").on("click", function() {
	rotateFunc(1, 324, "Apple iPad Air 2", 1);
})
var rotateFunc = function(awards, angle, txt, time) {
    $("#img").css({"padding-bottom":"84px"});
    $("#img").stopRotate();
    $("#img").rotate({
        angle: 36,
        duration: 5e3,
        animateTo: angle+1800,
        callback: function() {
            // dLucky.dialog1(txt, time);
        }
    });
};