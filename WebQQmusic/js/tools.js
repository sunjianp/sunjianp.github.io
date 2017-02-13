var tools = {
    //用正则把歌词与时间剥离
    getMusic:function (element) {
        //歌词数组
        var lrcArr = [];
        //歌词、时间数组对象
        var lrcObj = [];
        var _this = this;
        lrcArr = element.liric.match(/\[[\d\:\.]+\].+?↵/gi);
        for (var i=0;i<lrcArr.length;i++) {
            var s = '';
            var l = '';
            lrcArr[i].replace(/\[(.+)\](.+)↵/i,function ($0,$1,$2) {
                // console.log($1,$2)
                s = _this.getTime($1);
                l = $2;
            })
            lrcObj.push(
                {
                    l:l,
                    s:s
                }
            )
        }
        return lrcObj;
    },
    //获取歌词
    getTime:function (str) {
        return str.replace(/(\d+)\:(\d+\.\d+)/,function ($0,$1,$2) {
            var m = Number($1*60);
            return m + Number($2);
        })
    },
    //歌词高亮
    showLrc:function (t,data) {
        var lrc = '';
        for (var i=0;i<data.length;i++) {
            var s = parseInt(data[i].s)
            if (t<s) {
                break
            }
            lrc = data[i].l;
        }
        return lrc;
    },
    //换算成分钟和秒钟
    changeTime:function (v) {
        var _this = this;
        v = parseInt(v);
        var m = _this.toTwo(Math.floor(v/60));
        var s = _this.toTwo(Math.floor(v%60));
        return m + ":" + s;
    },
    //当前时间补0
    toTwo:function (n) {
        if (n<10) {
            return "0" + n;
        } else{
            return "" + n;
        }
    },
    //歌词高亮
    renderLrc:function (obj,str) {
        var lis = obj.getElementsByTagName('li');
        var n = parseFloat(getComputedStyle(lis[0]).height);
        for (var i=0;i<lis.length;i++){
            if (lis[i].innerHTML == str){
                lis[i].className = 'color1';
                if(i>4){
                    obj.style.top = -n*(i-2.2) + "px";
                }
            }else {
                lis[i].className = '';
            }
        }
    }
}