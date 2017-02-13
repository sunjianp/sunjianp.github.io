//工具函数

/*login登录页的封装函数*/
//1、大清洗
function clearClass(obj) {
	for (var i=0;i<obj.length;i++) {
		obj[i].className = '';
	}
}

//2、检测是否有value值
function checkValue(obj) {
	for (var i=0;i<obj.length;i++) {
		if (obj[i].value == "") {
			return false
		} 
	}
	return true
}
//3、清空value值
function clearValue(obj) {
	for (var i=0;i<obj.length;i++) {
		obj[i].value = '';
	}
}

//运动函数
function startMove(obj,attrs,duration,fx,endFn) {
	var j = {};
	for (var att in attrs) {
		j[att] = {};
		j[att].b = parseFloat(getComputedStyle(obj)[att]);
		j[att].c = attrs[att] - j[att].b;//运行总路程
	}
	var d = duration;
	var past = new Date();
	obj.timer = setInterval(function () {
		var now = new Date();
		var t = now - past;
		if (t>d) {
			t = d;
		}
		for (var att in j) {
			var b = j[att].b;
			var c = j[att].c;
			var v = Tween[fx](t, b, c, d);
			if (att == "opacity") {
				obj.style[att] = v;
			} else{
				obj.style[att] = v + "px";
			}
		}
		if (t==d) {
			clearInterval(obj.timer);
			endFn && endFn();
		}
	},20)
}
var Tween = {
    linear: function (t, b, c, d){  //匀速
        return c*t/d + b;
    },
    easeIn: function(t, b, c, d){  //加速曲线
        return c*(t/=d)*t + b;
    },
    easeOut: function(t, b, c, d){  //减速曲线
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){  //加速减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d){  //加加速曲线
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function(t, b, c, d){  //减减速曲线
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p/4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
	}
}
