/* 创建一个构造函数 */
function FreeSlider(selector,speed) {

    /* 变量改为属性 */
    this.oContainer = document.querySelector(selector);
    this.oWrapper = this.oContainer.querySelector('ul');
    this.oSlide = this.oWrapper.querySelectorAll('li');

    /* 当不传入轮播速度时，速度默认为100 */
    this.speed = speed || 100;

    this.containerW = this.oContainer.offsetWidth;
    this.wrapperW = this.oSlide[0].offsetWidth * this.oSlide.length;
    this.x = 0;
    this.timer = null;

    this.init();

}

/* 构造函数的原型对象 */
FreeSlider.prototype = {

    constructor: FreeSlider,

    /* 功能抽离，此处实现初始化 */
    init: function(){
        this.oWrapper.style.width = this.wrapperW * 2 + 'px';
        this.oWrapper.innerHTML += this.oWrapper.innerHTML;

        if(this.wrapperW < this.containerW){
            this.oContainer.style.width = this.wrapperW + 'px';
        }

        this.slideMove();
    },

     /* 图片自动无限轮播 */
    slideMove: function(){
        /* 此处需要注意this的指向，
           在setInterval回调函数中的this指向为window */
        var that = this;  
        this.timer = setInterval(function () {
            that.x++;
            if(that.x > that.wrapperW){
                that.x = 0;
            }
            that.oWrapper.style.transform = 'translate('+ (-that.x) +'px)';
        },this.containerW / this.speed);   // 将速度转化成定时器时间
    },

    /* 图片停止轮播 */
    stopSlideMove: function () {
        clearInterval(this.timer);
    }
};

window.onload = function(){

    var oContainer = document.querySelector('.container');

    // 新建图片轮播对象
    var mySlider = new FreeSlider('.container',300);

    // 鼠标移入时清除定时器，图片停止轮播
    oContainer.addEventListener('mouseover',function () {
        mySlider.stopSlideMove();
    });

    // 鼠标移出时图片继续轮播
    oContainer.addEventListener('mouseout',function () {
        mySlider.slideMove();
    });

}