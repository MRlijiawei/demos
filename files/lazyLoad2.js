	let imgList = [...document.querySelectorAll('img')]
	let lazyLoad = (() => {
		// 实例化观察者
		let observer = new IntersectionObserver(entries => {
			// 观察配置
			entries.forEach(entry => {
				if (entry.intersectionRatio > 0) {
					entry.target.src = entry.target.getAttribute('lazy-src')
					// 动画，仿https://creddy.ru/
					entry.target.style.transform = 'translateZ(0) scale(1) rotate(0deg)'
					// 取消观察
					observer.unobserve(entry.target)
				}
			})
		})
		imgList.forEach(img => {
			observer.observe(img)
		})
	})
	lazyLoad()