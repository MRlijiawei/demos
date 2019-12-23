var topTimer = setInterval(function(){
if (document.documentElement.scrollTop || document.body.scrollTop) {
$(".go-top").fadeIn()
}else{
$(".go-top").fadeOut(800)
}
}, 300)
 let gototop = document.getElementsByClassName("go-top")[0];

    gototop .onclick = function () {
// 清除定时器
            clearInterval(timer);  
            // 定义定时器
            var timer = setInterval(function() {  
                // 获取滚动距离
                let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;  
                // 定义步数
                let speed = -(scrollHeight / 14);    
                // 判断步长，取整 
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);  
                // 如果滚动距离为0，证明到达屏幕顶部，清除定时器
                if (scrollHeight === 0) clearInterval(timer);                             
                // 开始滚动，并处理兼容性问题
                document.documentElement.scrollTop = scrollHeight + speed;    
                document.body.scrollTop = scrollHeight + speed;      
            }, 14); 
            // 如果鼠标滚轮滚动，中断滚动
            window.onmousewheel = function(){
                clearInterval(timer);
            }
}