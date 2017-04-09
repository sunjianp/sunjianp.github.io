document.addEventListener('touchstart',function (ev) {
	ev.preventDefault();
})
var wrap = document.querySelector('#wrap'),
	child = wrap.children[0],
	pics = document.querySelector('.pics'),
	lis = pics.getElementsByTagName('li'),
	footer = document.querySelector('footer'),
	bar = document.querySelector('#bar');
var length = 12,
	start = 0,
	minTop = wrap.getBoundingClientRect().top,
	maxTop = minTop + wrap.getBoundingClientRect().height,
	maxScroll = wrap.clientHeight - child.offsetHeight,
	isLoad = false,
	isOver = false,
	footerH = footer.offsetHeight,
	scaleBar = wrap.clientHeight / child.offsetHeight;
var canvas = document.querySelector('#canvas'),
	canvasXT = canvas.getContext('2d'),
	clos = document.querySelector('#close'),
	bigImg = document.querySelector('#bigImg');
//console.log(minTop,maxTop)
cssTransform(footer,'scale',0);
create();//初始化
cssTransform(child,'translateZ',0.01);
cssTransform(bar,'translateZ',0.01);
clos.addEventListener('touchend',function () {
	cssTransform(bigImg,'scale',0);
});
gesConvas();
function gesConvas() {
	cssTransform(canvas,'translateZ',0.01);
	var startS = 0;
	var startR = 0;
	var callBack = {
		start: function (ev) {
			startS = cssTransform(this,'scale');;
			startR = cssTransform(this,'rotate');
		},
		change: function (ev) {
			var disS = e.scale;
			var disR = e.rotation;
			cssTransform(this,'scale',startS*disS);
			cssTransform(this,'rotate',startR*disR);
		}
	};
	gesture(canvas,callBack);
}
callBack = {
	start: function () {
		child.style.transition = 'none';
		var scrollTop = cssTransform(child,'translateY');//滚动条的位置
		maxScroll = wrap.clientHeight - child.offsetHeight;//到底部了
		scaleBar = wrap.clientHeight / child.offsetHeight;
		bar.style.height = wrap.clientHeight*scaleBar + 'px';
		var barTop = -(scrollTop*scaleBar);
		cssTransform(bar,'translateY',barTop);
//		console.log(scrollTop,maxScroll);
		bar.style.opacity = 1;
		if(!isOver && scrollTop <= maxScroll){
			isLoad = true;
		}
	},
	in: function(){
		createImg();
		var scrollTop = cssTransform(child,'translateY');//滚动条的位置
		var barTop = -(scrollTop*scaleBar);
		cssTransform(bar,'translateY',barTop);
		if (!isOver && isLoad) {
			var over = maxScroll - scrollTop;//超出的值
			var iScale = over/footerH;//拉动的缩放动画
			iScale = iScale > 1 ? 1 : iScale;
			iScale = iScale < 0 ? 0 : iScale;
			cssTransform(footer,'scale',iScale);
		}
	},
	end: function () {//手指抬起
		var scrollTop = cssTransform(child,'translateY');//滚动条的位置
		if (!isOver && isLoad && maxScroll - scrollTop > footerH) {
			clearInterval(child.scroll);//清除定时器，不再执行回弹动画
//			console.log('该加载新图了');
			start += length;
			create();
			bar.style.opacity = 0;//加载更多不显示
		}
		isLoad = false;
	},
	over: function () {
		bar.style.opacity = 0;
	}
};
mscroll(wrap,callBack);

function create() {
//	console.log(start,dataUrl.length);
	if (!isOver && start > dataUrl.length) {
		footer.innerHTML = '没有更多的图片了';
		setTimeout(function () {
			child.style.transition = '.5s';
			cssTransform(child,'translateY',maxScroll);
			isOver = true;
			footer.style.opacity = 0;
		},800)
		return;
	}
	var end = start + length;
	end = end > dataUrl.length ? dataUrl.length : end;
	for (var i=start;i<end;i++) {
		var li = document.createElement('li');
		li.src = dataUrl[i];//li的src的自定义属性
		li.isLoad = false;
		li.isMove = false;
		li.addEventListener('touchstart',function () {
			this.isMove = false;
		});
		li.addEventListener('touchmove',function () {
			this.isMove = true;
		});
		li.addEventListener('touchend',function () {
			if (this.isMove) {
				return;
			}
			var iLeft = this.getBoundingClientRect().left;
			var iTop = this.getBoundingClientRect().top;
			var img = new Image();
			img.src = this.src;
			img.onload = function () {
				canvas.width = img.width;
				canvas.height = img.height;
				cssTransform(canvas,'scale',1);
				cssTransform(canvas,'rotate',0);
				canvasXT.drawImage(img,0,0,canvas.width,canvas.height);
				bigImg.style.WebkitTransformOrigin = bigImg.style.transformOrigin = iLeft + 'px ' + iTop + 'px';
				bigImg.style.opacity = 1;
				cssTransform(bigImg,'scale',1);
			};
		});
		pics.appendChild(li);
	}
	createImg();
	cssTransform(footer,'scale',0);
}
function createImg() {
	for (var i=0;i<lis.length;i++) {
		var iTop = lis[i].getBoundingClientRect().top;
		if (!lis[i].isLoad && iTop >= minTop && iTop <= maxTop) {
			lis[i].isLoad = true;
			showImg(lis[i]);
//			console.log(i)
		}
	}
}
function showImg(li) {
	var img = new Image();
	img.src = li.src;
	img.onload = function () {
		var cvs = document.createElement('canvas');
		var ctx = cvs.getContext('2d');
		cvs.width = img.width;
		cvs.height = img.height;
		ctx.drawImage(img,0,0,cvs.width,cvs.height);
		li.appendChild(cvs);
		setTimeout(function () {
			cvs.style.opacity = 1;	
		},100)
	}
}