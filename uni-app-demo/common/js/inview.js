import 'intersection-observer';
/**
 * 某元素进入视线时触发
 * @param {Element} el 
 * @param {Function} callback 
 * */
 export function inview(el, callback) {
	 if (!el || !callback) {
		 throw new Error('参数错误！')
	 }
	 const io = new IntersectionObserver(entries => {
		 if (entries[0].isIntersecting) {
			 callback()
			 io.disconnect()
		 }
	 })
	 // io.observe(el)
	 Array.from(document.querySelectorAll(el)).forEach(item => {
		  io.observe(item)
	  })
 }
 
 /**
  * 懒加载
  * @param {Element} dom 
  * */
  export function lazyLoad(selectors) {
	  function query(selector) {
		  return Array.from(document.querySelectorAll(selector))
	  }
	  const obs = new IntersectionObserver(els => {
		  els.forEach(el => {
			  const container = el.target
			  // content报错
			  const content = container.querySelector('template').content
			  container.appendChild(content)
			  obs.unobserve(container)
		  })
	  })
	  query(selectors).forEach(item => {
		  obs.observe(item)
	  })
  }
  
  /**
   * 无限滚动
   * */
   export function ifiniteScroll(selector, callback) {
	   const ibs = new IntersectionObserver(els => {
		  // 如果不可见，就返回
		  if (els[0].intersectionRatio <= 0) return;
		  // loadItems(10);
		  callback()
		  console.log('Loaded new items');
	  })
	  // 开始观察
	  ibs.observe(
	    document.querySelector(selector)
	  )
   }
   
   /* var getDiv_md = $(".div_md");
   var offSet = getDiv_md.offset().top;
   $(window).scroll(function(){
   if ($(window).scrollTop() > offSet){
   $(".div_md").css({"position":"fixed","left":"10px","top":"10px","z-index":"2"});
   }else{
   $(".div_md").css({"position":"","left":"0px","top":"","z-index":""});
   }
   })
   });
   
   $(function() {
   $(".div_md a").click(function() {
   $("html, body").animate({
   scrollTop: $($(this).attr("href")).offset().top - 100 + "px"
   }, 1500);
   return false;
   }); */