	let imgList = [...document.querySelectorAll('img')],
		imgNum = imgList.length,
		delay = 100,
		timer
	/*window.onscroll = () => {
		clearInterval(timer)
	}*/

	let lazyLoad = (() => {
		// clearInterval(timer)
		let count = 0
		return function() {
			let newArr = []
			imgList.forEach((img, index) => {
				let rect = img.getBoundingClientRect()
				if (rect.top < window.innerHeight) {
					img.src = img.getAttribute('lazy-src')
					img.style.transform = 'translateZ(0) scale(1) rotate(0deg)'
					// document.body.animate({scrollTop: `20`})animate没有scroll相关属性
					// 自动将图片滚动到视口--begin
					/*clearInterval(timer)
					timer = setInterval(function() {
						// 可视区域高度大于图片，底对齐，否则顶对齐=
						let toScrollHeight = (document.documentElement.scrollTop || document.body.scrollTop)+Math.max((img.height||0), window.innerHeight)
		                let speed = -(toScrollHeight / 14);
		                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
		                if (toScrollHeight === 0) clearInterval(timer);
		                document.documentElement.scrollTop = toScrollHeight + speed;
		                document.body.scrollTop = toScrollHeight + speed;
		            }, 14);*/
		            // 自动将图片滚动到视口--end
					newArr.push(index)
					count++
					if (count === imgNum) {
						// document.removeEventListener("srcoll" , lazyLoad, false)
						document.body.onscroll = null
					}
				}
			})
			// 删除已加载的图片
			imgList = imgList.filter((_ , index)=> !newArr.includes(index))
		}
	})()// 自执行以加载初始化时可见的图片
	/* 节流 */
    function throttle(func, wait) {
        var previous = 0;
        return function () {
            var now = +new Date();
            if (now - previous > wait) {
                func.apply(this, arguments);
                previous = now;
            }
        }
    }
	lazyLoad = throttle(lazyLoad , delay)
	// document.body.addEventListener("srcoll" , lazyLoad, false)
	document.body.onscroll = lazyLoad
	// 由于加了旋转，所以这里需要在初始化的时候调用一次，否则上边自执行的初始化只能加载图片不能调整样式
	lazyLoad()