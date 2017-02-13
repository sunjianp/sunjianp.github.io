(function () {
	setLoading();
	setPerc();//设置景深
})()
/* 根据当前屏幕大小，动态计算景深*/
function setPerc() {
	resetView();
	window.onresize = resetView;	//当屏幕大小尺寸改变的时候
	function resetView() {
		var view = document.querySelector('#view');
		var main = document.querySelector('#main');
		var deg = 52.5,
			height = document.documentElement.clientHeight;
			R = Math.round(Math.tan(deg*Math.PI/180)*(height/2));
		view.style.WebkitPerspective = view.style.perspective = R + 'px';
		css(main,'translateZ',R);
	}
}
//清除默认行为
document.addEventListener('touchstart',function (e) {
	e.preventDefault();
})
/* 做图片预加载 */
function setLoading() {
	var logoText = document.querySelector('.logoText');
	var data = [];
	var nub = 0;
	for (var s in imgData) {
		data = data.concat(imgData[s]);
	}
	for (var i=0;i<data.length;i++) {
		var img = new Image();
		img.src = data[i];
		img.onload = function () {
			nub++;
			logoText.innerHTML = '已加载  ' +(Math.floor(nub/data.length*100))+ '%';
			if (nub == data.length) {
				anmt();//图片加载完成之后，要执行的
			}
		}
	}
}
/* 隐藏loding动画，开始让logo2显示 */
function anmt() {
	var view = document.querySelector('#view');
	var logo1 = document.querySelector('#logo1');
	var logo2 = document.createElement('div');	//实现logo2和logo3的无缝切换
	var logo3 = document.createElement('div');
	var img = new Image();
	var img2 = new Image();
	img.src = imgData.logo[0];
	img2.src = imgData.logo[1];
	logo2.id = 'logo2';
	logo3.id = 'logo3';
	logo2.className = logo3.className = 'logoImg';
	logo2.appendChild(img);
	logo3.appendChild(img2);
	css(logo2,'opacity',0);
	css(logo3,'opacity',0);
	css(logo2,'translateZ',-1000);
	css(logo3,'translateZ',-1000);
	view.appendChild(logo2);
	view.appendChild(logo3);
	MTween({
		el: logo1,
		target: {opacity: 0},
		time: 1000,
		type: 'easeOut',
		callBack: function () {
			//删除logo1，让logo2显示
			view.removeChild(logo1);
			css(logo2,'opacity',100);
			MTween({
				el: logo2,
				target: {translateZ: 0},
				time: 300,
				type: 'easeBoth',
				callBack: function () {
					anmt2();
					playMusic();
				}
			})
		}
	})
}
//背景音乐入场
function playMusic() {
	var music = document.querySelector('#music');
	var bgm = document.querySelector('#bgm');
	var isPlay = false;
	music.addEventListener('touchend',function () {
		!isPlay ? bgm.pause():bgm.play();
		isPlay = !isPlay;
	})
}
/* 隐藏logo2，让logo3显示出来 */
function anmt2() {
	var view = document.querySelector('#view');
	var logo2 = document.querySelector('#logo2');
	var logo3 = document.querySelector('#logo3');
	var img = new Image();
	setTimeout(function () {
		MTween({
			el: logo2,
			target: {translateZ: -1000},
			time: 800,
			type: 'linear',
			callBack: function () {
				//删除logo2，让logo3显示
				view.removeChild(logo2);
				css(logo3,'opacity',100);
				setTimeout(function () {
					MTween({
						el: logo3,
						target: {translateZ: 0},
						time: 300,
						type: 'easeBoth',
						callBack: anmt3
					})
				},300)
			}
		})
	},2000)
}
/* 隐藏logo3，显示小的爆炸效果*/
function anmt3(){
	var view = document.querySelector('#view');
	var logo3 = document.querySelector('#logo3');
	setTimeout(function () {
		MTween({
			el: logo3,
			target: {translateZ: -1000},
			time: 2000,
			type: 'linear',
			callBack: function () {
				view.removeChild(logo3);
				anmt4();//开始爆炸效果
			}
		})
	},2000)
}
/* logo4生成 */
function anmt4() {
	var view = document.querySelector('#view');
	var logo4 = document.createElement('div');
	var logoIcos = document.createElement('div');
	var logo4Img = new Image();
	var icosLength = 27;
	logo4.id = 'logo4';
	logo4Img.id = 'logo4Img';
	logoIcos.id = 'logoIcos';
	logo4Img.src = imgData.logo[2];
	css(logo4,'translateZ',-2000);
	for (var i=0;i<icosLength;i++) {
		var span = document.createElement('span');
		var xR = 20+Math.round(Math.random()*240);	//前后的错落
		var yR = 10+Math.round(Math.random()*240);	//上下的错落
		var xDeg = Math.round(Math.random()*360);	//(360/9)*(i%9);
		var yDeg = Math.round(Math.random()*360);
		css(span,'rotateY',xDeg);
		css(span,'translateZ',xR);
		css(span,'rotateX',yDeg);
		css(span,'translateY',yR);
		span.style.backgroundImage = 'url('+imgData.logoIco[i%3]+')';
		logoIcos.appendChild(span);
	}
	logo4.appendChild(logoIcos);
	logo4.appendChild(logo4Img);
	view.appendChild(logo4);
	MTween({
		el: logo4,
		target: {'translateZ': 0},
		time: 500,
		type: 'easeOutStrong',
		callBack: function () {
			setTimeout(function () {
				MTween({
					el: logo4,
					target: {'translateZ': -1000,'scale': 0},
					time: 4000,
					type: 'linear',
					callBack: function () {
						view.removeChild(logo4);
						anmt5();
					}
				})
			},200)
		}
	})
}
/* 主体开始入场 */
function anmt5() {
	var tZ = document.querySelector('#tZ');
	css(tZ,'translateZ',-2000);//主体入场
	anmt7();//云朵入场
	anmt6();
	createPano();//生成漂浮层
	//让tZ由远到近做动画
	MTween({
		el: tZ,
		target: {translateZ: -160},
		time: 3600,
		type: 'easeBoth'
	})
}
/* 生成主体的背景圆柱，圆柱入场 */
function anmt6() {
	var panoBg = document.querySelector('#panoBg');
	var govr = document.querySelector('#govr');
	var width = 129;
	var deg = 360/imgData.bg.length;
	var R = parseInt(Math.tan((180-deg)/2*Math.PI/180)*(width/2))-1;
	var startDeg = 180;
	css(panoBg,'rotateX',0);
	css(panoBg,'rotateY',-695);
	for (var i=0;i<imgData.bg.length;i++) {
		var span = document.createElement('span');
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		span.style.backgroundImage = 'url('+ imgData.bg[i] +')';
		span.style.display = 'none';
		panoBg.appendChild(span);
		startDeg -= deg;
	}
	var nub = 0;
	var timer = setInterval(function () {
		panoBg.children[nub].style.display = 'block';
		nub++;
		if (nub >= panoBg.children.length) {
			clearInterval(timer);
		}
	},3600/2/20);
	//panoBg出场旋转
	MTween({
		el: panoBg,
		target: {rotateY: 25},
		time: 3600,
		type: 'linear',
		callBack: function () {
			MTween({
				el: govr,
				target: {opacity: 100},
				time: 50,
				type: 'linear'
			})
			setDrag();//拖拽
			setTimeout(function () {
				setSensors();//添加陀螺仪
			},1000)
		}
	})
}
/* 添加云朵，及云朵入场动画 */
function anmt7() {
	var cloud = document.querySelector('#cloud');
	css(cloud,'translateZ',-400);
	//生成云朵
	for (var i=0;i<9;i++) {
		var span = document.createElement('span');
		span.style.backgroundImage = 'url('+ imgData.cloud[i%3] +')';
		var R = 200+(Math.random()*150);	//300;//随机半径
		var deg = (360/9)*i;	// Math.random()*360;//随机的角度
		//生成云的圆柱
		var x = Math.sin(deg*Math.PI/180)*R;//x坐标
		var y = Math.cos(deg*Math.PI/180)*R;//y坐标
		var z = (Math.random()-.5)*200;
		css(span,'translateX',x);
		css(span,'translateZ',y);
		css(span,'translateY',z);
		span.style.display = 'none';
		cloud.appendChild(span);
	}
	var nub = 0;
	var timer = setInterval(function () {
		cloud.children[nub].style.display = 'block';
		nub++;
		if (nub >= cloud.children.length) {
			clearInterval(timer);
		}
	},50)
	MTween({
		el: cloud,
		target: {rotateY: 540},
		time: 3500,
		type: 'easeIn',
		callIn: function () {
			var deg = -css(cloud,'rotateY');
			for (var i=0;i<cloud.children.length;i++) {
				css(cloud.children[i],'rotateY',deg);
			}
		},
		callBack: function () {
			cloud.parentNode.removeChild(cloud);//云朵消失
			bgShow();//背景加入
		}
	})
}
/* 拖拽  */
function setDrag() {
	var panoBg = document.querySelector('#panoBg');
	var pano = document.querySelector('#pano');
	var tZ = document.querySelector('#tZ');
	var startPoint = {x: 0,y: 0},
		panoBgDeg = {x: 0,y: 0};
	var scale = {x: 129/18,y:1170/30},
		startZ = css(tZ,'translateZ');
	var lastDeg = {x: 0,y: 0},
		lastDis = {x: 0,y: 0};	//上一次的角度和上一次的差值
	//手指按下
	document.addEventListener('touchstart',function (e) {
		window.isTouch = true;
		clearInterval(pano.timer);
		clearInterval(panoBg.timer);
		clearInterval(tZ.timer);
		startPoint.x = e.changedTouches[0].pageX;
		startPoint.y = e.changedTouches[0].pageY;
		panoBgDeg.x = css(panoBg,'rotateY');
		panoBgDeg.y = css(panoBg,'rotateX');
	})
	//手指移动
	document.addEventListener('touchmove',function (e) {
		var nowPoint = {};//当前值
		var nowDeg = {};
		var nowDeg2 = {};
		nowPoint.x = e.changedTouches[0].pageX;
		nowPoint.y = e.changedTouches[0].pageY;
		var dis = {};
		dis.x = nowPoint.x - startPoint.x;
		dis.y = nowPoint.y - startPoint.y;
		var disDeg = {};
		disDeg.x = -dis.x/scale.x;//换算成度数
		disDeg.y = dis.y/scale.y;//换算成度数
		nowDeg.y = panoBgDeg.y + disDeg.y;
		nowDeg.x = panoBgDeg.x + disDeg.x;
		nowDeg2.x = panoBgDeg.x + (disDeg.x)*.95;//为漂浮层加上缓冲
		nowDeg2.y = panoBgDeg.y + (disDeg.y)*.95;
		if (nowDeg.y > 45) {
			nowDeg.y = 45;
		} else if(nowDeg.y < -45){
			nowDeg.y = -45;
		}
		if (nowDeg2.y > 45) {
			nowDeg2.y = 45;
		} else if(nowDeg2.y < -45){
			nowDeg2.y = -45;
		}
		lastDis.x = nowDeg.x - lastDeg.x;
		lastDis.y = nowDeg.y - lastDeg.y;
		lastDeg.x = nowDeg.x;
		lastDeg.y = nowDeg.y;
		css(panoBg,'rotateX',nowDeg.y);
		css(panoBg,'rotateY',nowDeg.x);
		css(pano,'rotateX',nowDeg2.y);//漂浮层与背景圆柱同步旋转
		css(pano,'rotateY',nowDeg2.x);
		var disZ = Math.max(Math.abs(dis.x),Math.abs(dis.y));
		if (disZ > 300) {
			disZ = 300;
		}
		//让tZ沿着水平或者竖直方向中的一个运动
		css(tZ,'translateZ',startZ - Math.abs(disZ));
	})
	//手指抬起
	document.addEventListener('touchend',function (e) {
		var nowDeg = {x: css(panoBg,'rotateY'),y: css(panoBg,'rotateX')};//当前的角度
		var disDeg = {x: lastDis.x*10,y: lastDis.y*10};	//相差的角度
		//缓冲动画
		MTween({
		 	el: tZ,
		 	target: {translateZ: startZ},
		 	time: 700,
		 	type: 'easeOut'
		})
		MTween({
		 	el: panoBg,
		 	target: {rotateY: nowDeg.x+disDeg.x,rotateX: nowDeg.y+disDeg.y},
		 	time: 800,
		 	type: 'easeOut'
		})
		MTween({
		 	el: pano,
		 	target: {rotateY: nowDeg.x+disDeg.x,rotateX: nowDeg.y+disDeg.y},
		 	time: 800,
		 	type: 'easeOut',
		 	callBack: function () {
		 		window.isTouch = false;//拖拽结束，陀螺仪为true
		 		window.isStart = false;
		 	}
		})
	})
}
/* 添加陀螺仪效果 */
function setSensors() {
	var tZ = document.querySelector('#tZ');
	var pano = document.querySelector('#pano');
	var panoBg = document.querySelector('#panoBg');
	var start = {},
		now = {},
		startEl = {},
		scale = 129/18,
		lastTime = Date.now();//获取时间戳	修复陀螺仪执行时间间隔bug
	var startZ = -160;//tZ的初始值
	var dir = window.orientation;//检测横竖屏
	window.isStart = false,
	window.isTouch = false;//处理陀螺仪和拖拽的冲突
	//横竖屏切换	左右不再是-ev.gamma 	上下不再是ev.beta
	window.addEventListener('orientationchange',function (e) {
		dir = window.orientation;//用户修改横竖屏，重置横竖屏
	})
	window.addEventListener('deviceorientation',function (e) {
		if (window.isTouch) {
			return;
		}
		switch (dir){
			case 0:
				var x = e.beta,
					y = e.gamma;//ev.beta (rotateX)	-ev.gamma (rotateY)
				break;
			case 90:
				var x = e.gamma,
					y = e.beta;
				break;
			case -90:
				var x = -e.gamma,
					y = -e.beta;
				break;
			case 180:
				var x = -e.beta,
					y = -e.gamma;
				break;
			default:
				break;
		}
		var x = e.beta,
			y = e.gamma;//ev.beta (rotateX)	-ev.gamma (rotateY)
		var nowTime = Date.now();
		if (nowTime - lastTime < 30) {
			return;
		}
		lastTime = nowTime;
		if (!isStart) {
			//start
			window.isStart = true;
			start.x = x;
			start.y = y;
			startEl.x = css(pano,'rotateX');//元素初始的角度
			startEl.y = css(pano,'rotateY');
		} else{
			//move
			now.x = x;
			now.y = y;
			var dis = {};//记录差值
			dis.x = now.x - start.x;//围绕上下旋转的差值
			dis.y = now.y - start.y;//左右旋转的差值
			var deg = {};//记录当前值
			deg.x = startEl.x + dis.x;
			deg.y = startEl.y + dis.y;//旋转目标值
			if (deg.x > 45) {
				deg.x = 45;
			} else if(deg.x < -45){
				deg.x = -45;
			}
			var disXZ = Math.abs(Math.round((deg.x - css(pano,'rotateX'))*scale));//tZ上下旋转的差值
			var disYZ = Math.abs(Math.round((deg.y - css(pano,'rotateY'))*scale));//tZ左右旋转的差值
			var disZ = Math.max(disXZ,disYZ);
			if (disZ > 300) {
				disZ = 300;
			}
			MTween({
				el: tZ,
				target: {translateZ: startZ - disZ},
				time: 300,
				type: 'easeOut',
				callBack: function () {
					MTween({
						el: tZ,
						target: {translateZ: startZ},
						time: 400,
						type: 'easeOut'
					})
				}
			});
			MTween({
				el: pano,
				target: {
					rotateX: deg.x,
					rotateY: deg.y
				},
				time: 800,
				type: 'easeOut'
			});
			MTween({
				el: panoBg,
				target: {
					rotateX: deg.x,
					rotateY: deg.y
				},
				time: 800,
				type: 'easeOut'
			});
		}
	})
}
/* 加入背景 */
function bgShow() {
	var pageBg = document.querySelector('#pageBg');
	MTween({
		el: pageBg,
		target: {opacity: 100},
		time: 1000,
		type: 'easeBoth'
	})
}
/* 生成漂浮层 */
function createPano() {
	var pano = document.querySelector('#pano');
	var deg = 18,
		R = 406,
		nub = 0;
	var startDeg = 180;
	css(pano,'rotateX',0);
	css(pano,'rotateY',-180);
	css(pano,'scale',0);
	var pano1 = document.createElement('div');
	pano1.className = 'pano';
	css(pano1,'translateX',1.564); //改变tanslate修复漂浮层入场动画闪的bug
	css(pano1,'translateZ',-9.877);
	for (var i=0;i<2;i++) {
		var span = document.createElement('span');
		span.style.cssText = 'height: 344px;margin-top: -172px;';
		span.style.background = 'url('+ imgData['pano'][nub] +')';
//		span.style.background = 'url('+ imgData.pano[nub] +')';
		css(span,'translateY',-163);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		nub++;
		startDeg -= deg;
		pano1.appendChild(span);
	}
	pano.appendChild(pano1);
	
	var pano2 = document.createElement('div');
	pano2.className = 'pano';
	css(pano2,'translateX',20.225); //修复漂浮层入场动画闪的bug
	css(pano2,'translateZ',-14.695);
	for (var i=0;i<3;i++) {
		var span = document.createElement('span');
		span.style.cssText = 'height: 326px;margin-top: -163px;';
		span.style.background = 'url('+ imgData['pano'][nub] +')';
//		span.style.background = 'url('+ imgData.pano[nub] +')';
		css(span,'translateY',278);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		nub++;
		startDeg -= deg;
		pano2.appendChild(span);
	}
	pano.appendChild(pano2);
	
	var pano3 = document.createElement('div');
	pano3.className = 'pano';
	css(pano3,'translateX',22.275); //修复漂浮层入场动画闪的bug
	css(pano3,'translateZ',11.35);
	for (var i=0;i<4;i++) {
		var span = document.createElement('span');
		span.style.cssText = 'height: 195px;margin-top: -97.5px;';
		span.style.background = 'url('+ imgData['pano'][nub] +')';
		css(span,'translateY',192.5);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		nub++;
		startDeg -= deg;
		pano3.appendChild(span);
	}
	pano.appendChild(pano3);
	
	var pano4 = document.createElement('div');
	pano4.className = 'pano';
	startDeg = 90;
	css(pano4,'translateX',20.225); //修复漂浮层入场动画闪的bug
	css(pano4,'translateZ',14.695);
	for (var i=0;i<5;i++) {
		var span = document.createElement('span');
		span.style.cssText = 'height: 468px;margin-top: -234px;';
		span.style.background = 'url('+ imgData['pano'][nub] +')';
		css(span,'translateY',129);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		nub++;
		startDeg -= deg;
		pano4.appendChild(span);
	}
	pano.appendChild(pano4);
	
	var pano5 = document.createElement('div');
	pano5.className = 'pano';
	startDeg = 18;
	css(pano5,'translateX',-4.54); //修复漂浮层入场动画闪的bug
	css(pano5,'translateZ',8.91);
	for (var i=0;i<6;i++) {
		var span = document.createElement('span');
		span.style.cssText = 'height: 444px;margin-top: -222px;';
		span.style.background = 'url('+ imgData['pano'][nub] +')';
		css(span,'translateY',-13);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		nub++;
		startDeg -= deg;
		pano5.appendChild(span);
	}
	pano.appendChild(pano5);
	
	var pano6 = document.createElement('div');
	pano6.className = 'pano';
	startDeg = 18;
	css(pano6,'translateX',-11.35); //修复漂浮层入场动画闪的bug
	css(pano6,'translateZ',22.275);
	for (var i=0;i<6;i++) {
		var span = document.createElement('span');
		span.style.cssText = 'height: 582px;margin-top: -291px;';
		span.style.background = 'url('+ imgData['pano'][nub] +')';
		css(span,'translateY',256);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		nub++;
		startDeg -= deg;
		pano6.appendChild(span);
	}
	pano.appendChild(pano6);
	
	var pano7 = document.createElement('div');
	pano7.className = 'pano';
	startDeg = -108;
	css(pano7,'translateX',-20.225); //修复漂浮层入场动画闪的bug
	css(pano7,'translateZ',-14.695);
	for (var i=0;i<3;i++) {
		var span = document.createElement('span');
		span.style.cssText = 'height: 522px;margin-top: -261px;';
		span.style.background = 'url('+ imgData['pano'][nub] +')';
		css(span,'translateY',176.5);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		nub++;
		startDeg -= deg;
		pano7.appendChild(span);
	}
	pano.appendChild(pano7);
	
	var pano8 = document.createElement('div');
	pano8.className = 'pano';
	startDeg = -72;
	css(pano8,'translateX',-17.82); //修复漂浮层入场动画闪的bug
	css(pano8,'translateZ',-9.08);
	for (var i=0;i<6;i++) {
		var span = document.createElement('span');
		span.style.cssText = 'height: 421px;margin-top: -210.5px;';
		span.style.background = 'url('+ imgData['pano'][nub] +')';
		css(span,'translateY',-19.5);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		nub++;
		startDeg -= deg;
		pano8.appendChild(span);
	}
	pano.appendChild(pano8);
	
	setTimeout(function () {
		MTween({
			el: pano,
			target: {
				rotateY: 25,
				scale: 100
			},
			time: 1200,
			type: 'easeBoth'
		})
	},2800)
}