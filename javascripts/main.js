function goToTop(acceleration, time) {
	clearInterval(ss.intervalID);
	
	acceleration = acceleration || 0.1;
	time = time || 16;

	var dx = 0;
	var dy = 0;
	var bx = 0;
	var by = 0;
	var wx = 0;
	var wy = 0;

	if (document.documentElement) {
		dx = document.documentElement.scrollLeft || 0;
		dy = document.documentElement.scrollTop || 0;
	}
	if (document.body) {
		bx = document.body.scrollLeft || 0;
		by = document.body.scrollTop || 0;
	}
	var wx = window.scrollX || 0;
	var wy = window.scrollY || 0;

	var x = Math.max(wx, Math.max(bx, dx));
	var y = Math.max(wy, Math.max(by, dy));

	var speed = 1 + acceleration;
	window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));
	if(x > 0 || y > 0) {
		var invokeFunction = "goToTop(" + acceleration + ", " + time + ")"
		window.setTimeout(invokeFunction, time);
	}
}

var SmoothScroll = function (win, opt) {  
    //操作对象  
    this.win = win;  
    //每次滚动位移  
    this.step = opt ? opt.step || 180 : 180;  
    //缓动系数  
    this.f = opt ? opt.f || 0.1 : 0.1;  
    this.interval = 10;  
    this.intervalID = null;  
    this.isFF = navigator.userAgent.toLowerCase().indexOf("firefox") >= 0;  
    this.upOrDown = "";  
    this.init();  
}

SmoothScroll.prototype = {  
    init: function () {  
        var _this = this;  
        if (_this.isFF) {  
            _this.win.addEventListener('DOMMouseScroll', function (e) {  
                _this.upOrDown = e.detail < 0 ? "up" : "down";  
                _this.scrollHander();  
                e.preventDefault();  
            }, false);  
        } else {  
            _this.win.onmousewheel = function (e) {  
                e = e || window.event;  
                _this.upOrDown = e.wheelDelta > 0 ? "up" : "down";  
                _this.scrollHander();  
                e.returnValue = false;  
            }  
        }  
    },
    scrollHander: function () {  
        var _this = this;  
        clearInterval(_this.intervalID);  
        //目标位置  
        var tar = _this.win.scrollTop + _this.step * (_this.upOrDown == "up" ? -1 : 1);  
        _this.intervalID = setInterval(function () {  
            //缓动  
            _this.win.scrollTop += (tar - _this.win.scrollTop) * _this.f;  
            if (Math.abs(tar - _this.win.scrollTop) <= 10) {  
                clearInterval(_this.intervalID);  
            }  
        }, _this.interval);  
    }  
}

var ss = new SmoothScroll(document.getElementsByTagName('body')[0], {f:0.2});

window.onkeydown = function(e){
  clearInterval(ss.intervalID);
  e = e || window.event;
  var kc = e.keyCode || e.which;
  if(kc==36){
    goToTop();
    e.preventDefault();
    e.returnValue = false;
  }
}

window.onmousedown = function(){
  clearInterval(ss.intervalID);
}
