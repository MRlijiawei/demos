// 一些小动作
$("#navList li").mouseover(function(){
$(this).fadeOut().fadeIn();
});
$(".postTitle2").mouseover(function(){
$(this).fadeOut().fadeIn();
});
//title设置
// 浏览器标题切换  
var OriginTitile = document.title;    // 保存之前页面标题  
var titleTime;  
document.addEventListener('visibilitychange', function(){  
    if (document.hidden){  
        document.title ='I am here! Q~~Q';  
        clearTimeout(titleTime);  
    }else{  
        document.title = 'Welcome (o°ω°o) happy ';  
        titleTime = setTimeout(function() {  
            document.title = OriginTitile;  
        }, 1000); // 2秒后恢复原标题  
    }  
});  
jQuery.fn.shake = function (intShakes /*Amount of shakes*/, intDistance /*Shake distance*/, intDuration /*Time duration*/) {
    this.each(function () {
        var jqNode = $(this);
        jqNode.css({ position: 'relative' });
        for (var x = 1; x <= intShakes; x++) {
            if(5 < Math.random()*10) {
                jqNode.animate({ left: (intDistance * -1) }, (((intDuration / intShakes) / 4)))
                .animate({ left: intDistance }, ((intDuration / intShakes) / 2))
                .animate({ left: 0 }, (((intDuration / intShakes) / 4)));
            } else {
                jqNode.animate({ top: (intDistance * -1) }, (((intDuration / intShakes) / 4)))
                .animate({ top: intDistance }, ((intDuration / intShakes) / 2))
                .animate({ top: 0 }, (((intDuration / intShakes) / 4)));
            }
        }
    });
    return this;
}

$("#blogTitle span").mouseover(function(){
$(this).shake(5*Math.random(), 15*Math.random(), 1000*Math.random());
})