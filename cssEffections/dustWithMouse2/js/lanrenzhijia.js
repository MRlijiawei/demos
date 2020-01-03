// 代码整理：懒人之家 www.lanrenzhijia.com
var VELOCITY = 1;
			var PARTICLES = 400;
			
			var mouse = {x:0, y:0};
			var particles = [];
			var colors = [ "#000000","#FF0000","#FFFF00" ];
			var canvas = document.getElementById('projector');
			var context;
			
			if (canvas && canvas.getContext) {
				context = canvas.getContext('2d');
				
				for( var i = 0; i < PARTICLES; i++ ) {
					particles.push( { 
						x: Math.random()*window.innerWidth, 
						y: Math.random()*window.innerHeight, 
						vx: ((Math.random()*(VELOCITY*2))-VELOCITY),
						vy: ((Math.random()*(VELOCITY*2))-VELOCITY),
						size: 1+Math.random()*3,
						color: colors[ Math.floor( Math.random() * colors.length ) ]
					} );
				}
				
				Initialize();
			}
			
			function Initialize() {
				canvas.addEventListener('mousemove', MouseMove, false);
				window.addEventListener('mousedown', MouseDown, false);
				window.addEventListener('resize', ResizeCanvas, false);
				setInterval( TimeUpdate, 40 );
				
				ResizeCanvas();
			}
			
			function TimeUpdate(e) {
				
				context.clearRect(0, 0, window.innerWidth, window.innerHeight);
				
				var len = particles.length;
				var particle;
				
				for( var i = 0; i < len; i++ ) {
					particle = particles[i];
					
					if (!particle.frozen) {
						particle.x += particle.vx;
						particle.y += particle.vy;
						
						if (particle.x > window.innerWidth) {
							particle.vx = -VELOCITY - Math.random();
						}
						else if (particle.x < 0) {
							particle.vx = VELOCITY + Math.random();
						}
						else {
							particle.vx *= 1 + (Math.random() * 0.005);
						}
						
						if (particle.y > window.innerHeight) {
							particle.vy = -VELOCITY - Math.random();
						}
						else if (particle.y < 0) {
							particle.vy = VELOCITY + Math.random();
						}
						else {
							particle.vy *= 1 + (Math.random() * 0.005);
						}
						
						var distanceFactor = DistanceBetween( mouse, particle );
						distanceFactor = Math.max( Math.min( 15 - ( distanceFactor / 10 ), 10 ), 1 );
						
						particle.currentSize = particle.size*distanceFactor;
					}
					
					context.fillStyle = particle.color;
					context.beginPath();
					context.arc(particle.x,particle.y,particle.currentSize,0,Math.PI*2,true);
					context.closePath();
					context.fill();
					
				}
			}
			
			function MouseMove(e) {
				mouse.x = e.layerX;
				mouse.y = e.layerY;
			}
			
			function MouseDown(e) {
				var len = particles.length;
				
				var closestIndex = 0;
				var closestDistance = 1000;
				
				for( var i = 0; i < len; i++ ) {
					var thisDistance = DistanceBetween( particles[i], mouse );
					
					if( thisDistance < closestDistance ) {
						closestDistance = thisDistance;
						closestIndex = i;
					}
					
				}
				
				if (closestDistance < particles[closestIndex].currentSize) {
					particles[closestIndex].frozen = true;
				}
			}
			
			function ResizeCanvas(e) {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			}
			
			function DistanceBetween(p1,p2) {
				var dx = p2.x-p1.x;
				var dy = p2.y-p1.y;
				return Math.sqrt(dx*dx + dy*dy);
			}