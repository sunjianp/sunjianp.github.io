//设置图吧的长度
var dataImg = new Array();
for(var i = 0; i < 100; i++){
	dataImg.push("pics/"+(i%16+1)+".jpg");
}
console.log(dataImg)
var wrap = document.querySelector('.wrap'),
	imgs = document.querySelector('#imgs'),
	footer = document.querySelector('footer'),
	lis = imgs.children;

var start = 0,
	length = 8,
	wrapRect = wrap.getBoundingClientRect(),//获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
	wrapTop = wrapRect.top,
	wrapBottom = wrapRect.top + wrapRect.height,
	isEnd = false;

var wrapScroll = new MScroll({
	element: wrap,
	showBar: true
});
//console.log(wrapScroll.minTranslate);
//用户手指按下
wrapScroll.onscrollstart = function () {
	if (wrapScroll.iScroll.y <= wrapScroll.minTranslate.y) {
//		console.log('从底部开始滑屏')
		footer.style.opacity = 1;
		isEnd = true;
	}
}
////用户手指抬起
wrapScroll.onscrollend = function () {
	if (isEnd && (this.iScroll.y < this.minTranslate.y)) {
//		console.log('加载更多')
		clearTimeout(this.timer);
		start += length;
		createLi();
		isEnd = false;
	}
}

//滑动中
wrapScroll.onscroll = function () {
	showImg();
}
//滑动结束
wrapScroll.onscrollover = function () {
	showImg();
}
createLi();
//在页面创建li
function createLi() {
	if(start >= dataImg.length){
//		console.log("该结束");
		footer.innerHTML = "没有更对图片了";
		setTimeout(function(){
			wrapScroll.iScroll.y =  wrapScroll.minTranslate.y;
			wrapScroll.move();
			footer.style.opacity = 0;
			wrapScroll.onscrollstart = null;
			wrapScroll.onscrollend = null;
			wrapScroll.onscroll = null;
			wrapScroll.onscrollover = null;
		},500);
		return;
	}
	//li初始化
	var end = start + length;
	end = end > dataImg.length?dataImg.length:end;
	for (var i=start;i<end;i++) {
		var li = document.createElement('li');
		li.dataset.img = dataImg[i];
		li.dataset.iscreate = 'false';//是否正在创建
		imgs.appendChild(li);
	}
	showImg();
	wrapScroll.reSize(); //修改了元素内容之后，记得重置最大移动距离
	wrapScroll.scrollYBar.style.opacity = 0;//滚动条透明度变为0
	footer.style.opacity = 0;
}
//在页面创建img
function showImg() {
	for (var i=0;i<lis.length;i++) {
		var iRect = lis[i].getBoundingClientRect();
		var rectTop = iRect.top,
			rectBottom = iRect.top + iRect.height;
		if (rectBottom > wrapTop && rectTop < wrapBottom && lis[i].dataset.iscreate === 'false') {
			lis[i].dataset.iscreate = 'true';
			createImg(lis[i]);
		}
	}
}
//在页面创建img
function createImg(li) {
	var img = new Image();
	img.src = li.dataset.img;
	img.onload = function () {
		li.appendChild(img);
		setTimeout(function () {
			img.style.opacity = 1;
		},40)
	}
}