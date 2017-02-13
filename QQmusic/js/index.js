window.onload = function () {
	
	//QQ音乐轮播图效果
	var wrap1 = document.querySelector('#wrap1');
	var wp1_list1 = document.querySelector('#wp1_list1');
	var spots = document.querySelectorAll('#spot span');
	var translateX = startPoint = startEl = 0;
	var section_content = document.querySelector('.section_content');
	var wrap1W = wrap1.clientWidth;
	wp1_list1.innerHTML += wp1_list1.innerHTML;
	wp1_list1.style.width = wp1_list1.clientWidth*2 + 'px';
	//手指触碰的时候
	wp1_list1.addEventListener('touchstart',function (e) {
		wp1_list1.style.transition = 'none';
		var now = Math.round(translateX/wrap1W);
		//处理第一组的第一张与第二组的最后一张的情况
		if (now == 0) now = -spots.length;
		if (now == -(2*spots.length -1)) now = -(spots.length-1);
		translateX = now*wrap1W;
		wp1_list1.style.webkitTansform = wp1_list1.style.transform = 'translateX('+ translateX +'px)';
		startPoint = e.changedTouches[0].pageX;
		startEl = translateX;
	})
	//手指移动的时候
	wp1_list1.addEventListener('touchmove',function (e) {
		var nowPoint = e.changedTouches[0].pageX;
		var dis = nowPoint - startPoint;
		translateX = startEl + dis;
		wp1_list1.style.webkitTansform = wp1_list1.style.transform = 'translateX('+ translateX +'px)';
	})
	//手指离开的时候
	wp1_list1.addEventListener('touchend',function (e) {
		var now = Math.round(translateX/wrap1W);
		translateX = now*wrap1W;
		wp1_list1.style.transition = '0.5s';
		wp1_list1.style.webkitTansform = wp1_list1.style.transform = 'translateX('+ translateX +'px)';
		for (var i=0;i<spots.length;i++) spots[i].className = '';
		spots[-now%spots.length].className = 'active';
	})
	//
	var playBtn = document.querySelector('.play');
	var audio1 = document.querySelector('#audio1');
	var playStart = document.querySelector('#player');
	var mkhd_partlef = document.querySelector('.mkhd_partlef');
	var album_img = document.querySelector('.album_img');
	
	//进度条
	var line_pocess = document.querySelector('#line_pocess');
	var process_line = document.querySelector('#process_line');
	var isPlay = true;
	var timer1 = null;
	var lrcObj = [];
	var prevBtn = document.querySelector('#prev');
	var nextBtn = document.querySelector('#next');
	var n = 0;
	var lirc_list = document.querySelector('.wrap_list .lirc_list');
	
	var maskbd_box = document.querySelector('.maskbd_box');
	var bd_nav_spans = document.querySelectorAll('.mask_bd_nav span');
	var album = document.querySelector('.album');
	var play = document.querySelector('.play');
	var translateX1 = startPoint1 = startEl1 = leftDeg = 0;
	//初始化
	init(datas[0]);
	//手指摁下音乐播放器显示
	prevBtn.addEventListener('touchstart', function(e) {
		n++;
		if(n == datas.length) n = 0;
		init(datas[n]);
		isPlay = true;
	});
	//播放下一首
	nextBtn.addEventListener('touchstart', function(e) {
		n--;
		if(n == -1) n = datas.length -1;
		init(datas[n]);
		isPlay = true;
	});
	//播放上一首
	playBtn.addEventListener('touchstart', function(e) {
		$('#play_mask').show();
		isPlay = true;
	});
	//播放音乐
	playStart.addEventListener('touchstart', function(e) {
		if (isPlay) {
			this.src = "images/player2.png";
			audio1.play();
		} else{
			this.src = "images/player1.png";
			audio1.pause();
		}
		isPlay = !isPlay;
	});
	//暂停
	audio1.onpause = function () {
	    clearInterval(timer1);
	    playStart.src = "images/player1.png";
	    play.src = "images/play.png";
	    $('#songs_lrc').html("点击按钮开始播放音乐");
	}
	//正在播放中
	audio1.onplaying = function () {
//		console.log("开始播放音乐")
		play.src = "images/ftbn1.png";
		timer1 = setInterval(function () {
			leftDeg += 0.8;
            $('#line_pocess').css('width',18*(audio1.currentTime/audio1.duration) + 'rem');
            $('#process_pot').css('left',18*(audio1.currentTime/audio1.duration) + 'rem');
            $('#song_current').html(changeTime(audio1.currentTime));
            $('#songs_lrc').html(showLrc(audio1.currentTime,lrcObj));
            album_img.style.transform = "rotate("+ leftDeg +"deg)";
            album.style.transform = "rotate("+ leftDeg +"deg)";
            $('.song_lrc').html(showLrc(audio1.currentTime,lrcObj));
            renderLrc(lirc_list,showLrc(audio1.currentTime,lrcObj));
        },500);
	}
	//退出音乐播放器
	mkhd_partlef.addEventListener('touchstart', function(e) {
		$('#play_mask').hide();
	});
	//滑屏出现歌词
	//手指触碰的时候
	maskbd_box.addEventListener('touchstart',function (e) {
		maskbd_box.style.transition = 'none';
		var now1 = Math.round(translateX1/wrap1W);
		if (now1 > 0) {
			now1 = 0;
		}
		translateX1 = now1*wrap1W;
		maskbd_box.style.webkitTansform = maskbd_box.style.transform = 'translateX('+ translateX1 +'px)';
		startPoint1 = e.changedTouches[0].pageX;
		startEl1 = translateX1;
	})
	//手指移动的时候
	maskbd_box.addEventListener('touchmove',function (e) {
		var nowPoint1 = e.changedTouches[0].pageX;
		var dis1 = nowPoint1 - startPoint1;
		translateX1 = startEl1 + dis1;
		maskbd_box.style.webkitTansform = maskbd_box.style.transform = 'translateX('+ translateX1 +'px)';
	})
	//手指离开的时候
	maskbd_box.addEventListener('touchend',function (e) {
		var now1 = Math.round(translateX1/wrap1W);
		if(now1 == 1){
			now1 = 0;
			bd_nav_spans[1].className = 'fl color3';
			bd_nav_spans[0].className = 'fl';
		}
		if (now1 == -2) {
			now1 = -1;
			bd_nav_spans[0].className = 'fl color3';
			bd_nav_spans[1].className = 'fl';
		}
		translateX1 = now1*wrap1W;
		maskbd_box.style.transition = '0.5s';
		maskbd_box.style.webkitTansform = maskbd_box.style.transform = 'translateX('+ translateX1 +'px)';
	})
	//初始化函数
	function init(element) {
		lrcObj = [];
		audio1.src = element.song;
		clearInterval(timer1);
		album_img.style.transform = "rotate(0deg)";
        album.style.transform = "rotate(0deg)";
        $('#line_pocess').css('width','0rem');
            $('#process_pot').css('left','0rem');
		$('#song_current').html('00:00');
		$('#song_duration').html(element.time);
		$('#mk_song1').html(element.name);
		$('.mk_singer1').html('—  ' + element.singer + '  —');
		album_img.src = element.imge;
		lrcObj = getMusic(element);
		playStart.src = "images/player1.png";
		album.src = element.img;
		$('#songs_text').html(element.name);
		play.src = "images/play.png";
		$('.song_lrc').html(element.name + ' - ' + element.singer);
		renderLric(lrcObj);
	}
	function renderLric(element) {
		lirc_list.innerHTML = '';
		var html = '';
		for (var i=0;i<element.length;i++) {
			html += '<li>'+ element[i].l +'</li>';
		}
		lirc_list.innerHTML = html;
	}
}