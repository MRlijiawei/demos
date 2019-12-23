function SiriWave(opt){
	this.opt = opt || {};

	this.K = 2;
	this.F = 6;
	this.speed = this.opt.speed || 0.1;
	this.noise = this.opt.noise || 0; // noise 噪声
	this.phase = this.opt.phase || 0; // phase 相

	if (!devicePixelRatio) devicePixelRatio = 1;
	this.width = devicePixelRatio * (this.opt.width || 320);
	this.height = devicePixelRatio * (this.opt.height || 100);
	this.MAX = (this.height/2)-4;

	// this.canvas = document.createElement('canvas');
	this.canvas = document.getElementById(opt.id);
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.canvas.style.width = (this.width/devicePixelRatio)+'px';
	this.canvas.style.height = (this.height/devicePixelRatio)+'px';
	(this.opt.container || document.body).appendChild(this.canvas);
	this.ctx = this.canvas.getContext('2d');

	this.run = false;
}

SiriWave.prototype = {
	_globalAttenuationFn: function(x){
		return Math.pow(this.K*4/(this.K*4+Math.pow(x,4)),this.K*2);
	},

	// 参数：衰减、颜色、线的宽度
	_drawLine: function(attenuation, color, width, offsetY){
		var startRightX = this.width/2+115;
		var startLeftX = this.width/2-115;

		// 绘制右边波浪
		// this.ctx.moveTo(0,0);
		this.ctx.moveTo(startRightX, 0);
		this.ctx.beginPath();
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = width || 1;
		offsetY = offsetY || 0;
		var rx, ry;
		for (var i = -this.K; i <=this.K; i += 0.01) {
			rx = startRightX + 500*((i+this.K)/(this.K*2));
			ry = this.height/2 + this.noise * this._globalAttenuationFn(i) * (1/attenuation) * Math.sin(this.F*i-this.phase) + offsetY;
			this.ctx.lineTo(rx, ry);
		}
		this.ctx.lineTo(this.width, this.height/2+ offsetY);
		this.ctx.stroke();

		// 绘制左边波浪
		this.ctx.moveTo(startLeftX, 0);
		this.ctx.beginPath();
		var lx, ly;
		for (var i = -this.K; i <=this.K; i += 0.01) {
			lx = startLeftX - 500*((i+this.K)/(this.K*2));
			ly = this.height/2 + this.noise * this._globalAttenuationFn(i) * (1/attenuation) * Math.sin(this.F*i-this.phase) + offsetY;
			this.ctx.lineTo(lx, ly);
		}
		this.ctx.lineTo(0, this.height/2+ offsetY);
		this.ctx.stroke();
	},

	_drawImg: function(x, y){
		var img = new Image();
		img.src = "circle.png";
		this.ctx.drawImage(img, this.width/2-239, 0);
	},

	_clear: function(){
		this.ctx.globalCompositeOperation = 'destination-out';
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.globalCompositeOperation = 'source-over';
	},

	_draw: function(){
		if (!this.run) return;

		this.phase = (this.phase+this.speed)%(Math.PI*64);
		this._clear();
		this._drawLine(-2, 'rgba(255, 255, 255, 0.15)', 1, 15);
		this._drawLine(1, '#1FDB84', 1.5);

		requestAnimationFrame(this._draw.bind(this), 50);
		this._drawImg();
	},

	start: function(){
		this.phase = 0;
		this.run = true;
		this._draw();
	},

	stop: function(){
		this.run = false;
		this._clear();
	},

	setNoise: function(v){
		this.noise = Math.min(v, 1)*this.MAX;
	},

	setSpeed: function(v){
		this.speed = v;
	},

	set: function(noise, speed) {
		this.setNoise(noise);
		this.setSpeed(speed);
	}

};

var SW = new SiriWave({
	// width: 845,
	width: 1920,
	height: 477,
	id: 'canvasOne'
});

SW.setSpeed(0.05);
SW.start();

var range = document.getElementById('range');
setInterval(function(){
	// SW.setNoise(range.value);
	SW.setNoise(0.3);
}, 100);

