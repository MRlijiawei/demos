var bktging = false
var toggleInterval
$(".toggleBackCls").click(function(){
	if (bktging) {
		$(this).text('动态切换背景')
		$(this).css('color', 'green')
		clearInterval(toggleInterval)
		$("canvas")[1].style.opacity = 0.5
		bktging = false
		return
	}
	bktging = true
	$(this).text('停止动态背景')
	$(this).css('color', 'bule')
	var backurl1 = "https://images2018.cnblogs.com/blog/1348134/201808/1348134-20180809164956043-1160023081.jpg";
	var backurl2 = "https://images2018.cnblogs.com/blog/1348134/201808/1348134-20180810091059829-1105630129.jpg";
	var backurl3 = "https://images2018.cnblogs.com/blog/1348134/201808/1348134-20180810091105789-1559480364.jpg";
	var backurl4 = "https://images2018.cnblogs.com/blog/1348134/201808/1348134-20180810091118340-2054625643.jpg";
	var backurl5 = "https://images2018.cnblogs.com/blog/1348134/201808/1348134-20180810091124302-821821908.jpg";
	var backurl6 = "https://images2018.cnblogs.com/blog/1348134/201808/1348134-20180810092257221-558066876.jpg";
	// $(this).css("display", "none");
	var toggleFlag = true;
	$("canvas")[1].style.transitionProperty = "opacity";
	$("canvas")[1].style.transitionDuration = "2s";
	toggleInterval = setInterval(function(){
		if($("canvas")[1].style.opacity == 0.3) {
			toggleFlag = true;
			$("canvas")[1].style.opacity = Number($("canvas")[1].style.opacity) + 0.1;
		} else  if($("canvas")[1].style.opacity == 1) {
			toggleFlag = false;
			if(1 == Math.ceil(Math.random()*12/2)){
				var totoggleurl =backurl1; 
			} else if(2 == Math.ceil(Math.random()*12/2)){
				var totoggleurl =backurl2;
			} else if(3 == Math.ceil(Math.random()*12/2)){
				var totoggleurl = backurl3
			} else if(4 == Math.ceil(Math.random()*12/2)){
				var totoggleurl = backurl4;
			} else if(5 == Math.ceil(Math.random()*12/2)){
				var totoggleurl = backurl5;
			} else {
				var totoggleurl = backurl6;
			}
			$("body").css("background-image",  "url('" + totoggleurl  + "')") ;
			$("canvas")[1].style.opacity = Number($("canvas")[1].style.opacity) - 0.1;
		} else if(!toggleFlag) {
			$("canvas")[1].style.opacity = Number($("canvas")[1].style.opacity) - 0.1;
		} else if(toggleFlag) {
			$("canvas")[1].style.opacity = Number($("canvas")[1].style.opacity) + 0.1;
		}

	}, 500);
});