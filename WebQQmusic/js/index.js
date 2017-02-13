window.onload = function () {
    (
        function () {
            var QQmusic = {
                lrcObj:[],  //歌词时间对象数组
                isPlay:false,   //是否播放
                isTab:false,
                timer:null,     //定时器名字
                currentTime:0,       //当前时间
                currentSong:null, //当前播放的歌曲
                element:{
                    songlist_content1:document.getElementById('songlist_content1'),
                    progress_singer:document.getElementById('progress_singer'),
                    timer_current:document.getElementById('timer_current'),
                    timer_total:document.getElementById('timer_total'),
                    progress_singer:document.getElementById('progress_singer'),
                    //qq音乐右上部封面元素
                    bg_pic:document.getElementById('bg_pic'),
                    song_name1:document.getElementById('song_name1'),
                    singer_name1:document.getElementById('singer_name1'),
                    album_name1:document.getElementById('album_name1'),
                    //首页右下脚歌词列表
                    song_liric:document.getElementById('song_liric'),
                    player_mask:document.getElementById('player_mask'),
                    mask:document.getElementById('mask'),
                    //功能按钮
                    prev:document.getElementById('prev'),
                    sto:document.getElementById('sto'),
                    next:document.getElementById('next'),
                    audio1:document.getElementById('audio1'),
                    voice_rect:document.getElementById('voice_rect'),
                    dot:document.getElementById('dot'),
                    menu_btn:document.getElementById('menu_btn'),
                    voice_dot:document.getElementById('voice_dot'),
                    progress_timer1:document.querySelector("#progress_timer span"),
                    player_bd1:document.getElementById('player_bd1')
                },
                //初始化函数
                init:function () {
                    var _this = this;
                    //页面加载时初始化页面
                    this.renderSonglist();
                    //渲染歌词列表
                    this.renderSongLrc(datas[0]);
                    //播放下一首
                    this.element.next.onclick = function () {
                        _this.currentSong++;
                        if (_this.currentSong == datas.length) _this.currentSong = 0;
                        _this.element.audio1.pause();
                        _this.element.sto.className = "sto";
                        _this.isPlay = !_this.isPlay;
                        _this.nextFn(_this.currentSong);
                    };
                    //播放上一首
                    this.element.prev.onclick = function () {
                        _this.currentSong--;
                        if (_this.currentSong == -1) _this.currentSong = datas.length-1;
                        _this.element.audio1.pause();
                        _this.element.sto.className = "sto";
                        _this.isPlay = !_this.isPlay;
                        _this.prevFn(_this.currentSong);
                    };
                    //点击播放
                    this.element.sto.onclick = function () {
                        if(_this.isPlay){
                            // console.log('暂停')
                            _this.element.audio1.pause();
                            _this.element.sto.className = "sto";
                        }else{
                            // console.log('播放')
                            _this.element.audio1.play();
                            _this.element.sto.className = "active";
                        }
                        _this.isPlay = !_this.isPlay;
                    };
                    //切换窗口
                    $('#menu_btn').on('click',function () {
                        if(_this.isTab){
                            $('#player_bd1').show();
                            $('#mask').hide();
                        }else{
                            $('#mask').show();
                            $('#player_bd1').hide()
                        }
                        _this.isTab = !_this.isTab;
                    })
                    //调节音量大小
                    this.element.voice_dot.onmousedown = function (e) {
                        var disX = e.clientX - _this.element.voice_dot.offsetLeft;
                        document.onmousemove = function (e) {
                            var L = e.clientX - disX;
                            if(L<50) L = 50
                            if (L > 150 - _this.element.voice_dot.offsetWidth) L = 150 - _this.element.voice_dot.offsetWidth;
                            var m = L/150;
                            _this.element.voice_dot.style.left = L + "px";
                            var n = _this.element.audio1.volume;
                            n -= m;
                            n = Math.min(1,m);
                            n = Math.max(0,m);
                            _this.element.audio1.volume = n;
                        }
                        document.onmouseup = function () {
                            document.onmousemove = null;
                        }
                        return false;
                    }
                    //进度条
                    this.element.audio1.onplaying = function () {
                        _this.timer = setInterval(function () {
                            _this.element.voice_rect.style.width = 545*(_this.element.audio1.currentTime/_this.element.audio1.duration) + "px";
                            _this.element.dot.style.left = 545*(_this.element.audio1.currentTime/_this.element.audio1.duration) + "px";
                            _this.element.progress_timer1.innerHTML = tools.changeTime(_this.element.audio1.currentTime);
                            if(_this.isTab){
                                tools.renderLrc(_this.element.player_mask,tools.showLrc(_this.element.audio1.currentTime,_this.lrcObj));
                            }else{
                                tools.renderLrc(_this.element.song_liric,tools.showLrc(_this.element.audio1.currentTime,_this.lrcObj));
                            }
                        },500);
                    };
                    this.element.audio1.onpause = function () {
                        _this.element.sto.className = "sto";
                        clearInterval(_this.timer);
                    }
                },
                //渲染歌曲列表
                renderSonglist:function () {
                    var html = '';
                    for (var i=0;i<datas.length;i++){
                        html += `
                        <li class="clearfix">
                            <input type="checkbox" name="" id="" value="" />
                            <em class="ems">${datas[i].num}</em>
                            <span class="spans"></span>
                            <div>
                                ${datas[i].name}
                            </div>
                            <div>
                                ${datas[i].singer}
                            </div>
                            <div>
                                ${datas[i].time}
                            </div>
                        </li>
                        `
                    }
                    this.element.songlist_content1.innerHTML = html;
                },
                //渲染页面上歌词信息
                renderSongLrc:function (element) {
                    var html = '';
                    this.lrcObj = tools.getMusic(element);
                    // console.log(this.lrcObj)
                    for (var i=0;i<this.lrcObj.length;i++){
                        html += `
                            <li>${this.lrcObj[i].l}</li>
                        `
                    }
                    this.element.song_liric.innerHTML = html;
                    this.element.player_mask.innerHTML = html;

                    this.element.timer_total.innerHTML = element.time;
                    this.element.timer_current.innerHTML = '00 : 00';
                    this.element.bg_pic.src = element.imge;
                    this.element.song_name1.innerHTML = '歌曲名：   ' + element.name;
                    this.element.singer_name1.innerHTML = '歌手名：  ' + element.singer;
                    this.element.album_name1.innerHTML = '专辑名：   ' + element.album;
                    this.element.audio1.src = element.song;
                    this.element.progress_singer.innerHTML = element.singer + '    /    ' + element.name;
                },
                //点击播放下一首
                nextFn:function (v) {
                    var element = datas[v];
                    this.renderSongLrc(element);
                },
                //点击播放上一首
                prevFn:function (v) {
                    var element = datas[v];
                    this.renderSongLrc(element);
                }
            }
            QQmusic.init();
        }()
    )
}