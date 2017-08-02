document.addEventListener('touchstart',function(e) {
	e.preventDefault();
});
(function() {
	var box = document.querySelector('#box');
	box.style.position = "absolute";
	var startY,startEl,lastTime,lastDis,lastSpeed;
	var min = 0;
	var max = 0;
	var TC = .25;
	css(box,'translateY',0)
	css(box,'translateZ',0.01)
	box.addEventListener('touchstart',function(e) {
		var touch = e.changedTouches[0];
		startY = touch.pageY;
		startEl = css(box,'translateY');
		lastTime = Date.now();	//	上一次时间
		lastDis = touch.pageY;	//	上一次位置
		min = window.innerHeight - box.offsetHeight;
		console.log(min)
	});
	box.addEventListener('touchmove',function(e) {
		var touch = e.changedTouches[0];
		var nowY = touch.pageY;
		var y = nowY - startY +startEl;
		var nowTime = Date.now();
		
		////	拉力系数	/////
		if(y > max) {
			y *= TC;
		} else if(y < min) {
			y = (y - min)*TC + min;
		}
		css(box,'translateY',y);
		lastSpeed = (nowY - lastDis)/(nowTime - lastTime);
		lastDis = touch.pageY;
		lastTime = nowTime;
	});
	box.addEventListener('touchend',function(e) {
		if(Date.now() - lastTime >100) {
			lastSpeed = 0;
		}
		lastSpeed = Math.abs(lastSpeed) <.1?0:lastSpeed;
		var translate = lastSpeed*200;
		translate = Math.abs(translate) >1000?1000*(translate/Math.abs(translate)):translate;
		var target = translate + css(box,'translateY');
		var type = 'easeOutStrong';
		//	橡皮筋部分
		if(target > max) {
			target = 0;
			type = "backOut";
		} else if(target < min) {
			target = min;
//			console.log(target)
			type = 'backOut';
		}
		//	控制回弹时间
		var time = Math.abs((target - css(box,'translateY'))*1.3);
		time = (time>0&&time<200)?200:time;
		startMove({
			el:box,
			target: {
				translateY:target
			},
			time:time,
			type:type
		});
	});
})();


///	推拽
(function() {
	var bannerList = document.querySelector('.bannerList');
	var banner = document.querySelector('.banner')
	var bannerW = css(bannerList,'width');
	var banImg = document.querySelectorAll('.banner>img');
	var bannerBtn = document.querySelectorAll('label');
	var nub = 0;
	var timer = 0;
	var startMouseX,startMouseY,elX,nowMouseX,nowMouseY,disX,disY;
	var nowBanner = 0;
	var isMove = true;
	var isFirst = true;
	//	使用startmove中translate必须先获取下位置
	css(bannerList,"translateX",0);
	css(bannerList,"translateZ",0.01);
	css(banner,"translateX",0);
	
	//	拖拽部分
	bannerList.addEventListener('touchstart',function(e) {
		
		clearInterval(timer);
		clearInterval(bannerList.timer);
		nowBanner = -nub;
		
		startMouseX = e.changedTouches[0].pageX;
		startMouseY = e.changedTouches[0].pageY;
		isMove = true;
		isFirst = true;
		//	当是第0张时，将它切换到第2组第一张
		if(Math.abs(nowBanner) == 0) {
			nowBanner = - bannerBtn.length;
			css(banner,'translateX',nowBanner*bannerW)
		}
		//当是最后一张时，切换到第一组的最后一张
		if(Math.abs(nowBanner) == banImg.length-1) {
			nowBanner = - (bannerBtn.length-1);
			css(banner,'translateX',nowBanner*bannerW)
		}
		
		elX = css(banner,"translateX");
	});		
	
	bannerList.addEventListener('touchmove',function(e) {
		if(!isMove){
			return
		}
		nowMouseX = e.changedTouches[0].pageX;
		nowMouseY = e.changedTouches[0].pageY;
		disX = nowMouseX - startMouseX;
		disY = nowMouseY - startMouseY;
		if(isFirst){//在第一次滑动的时候，判断用户是想左右滑动，还是想上下滑动
			isFirst = false;
			if(Math.abs(disY) > Math.abs(disX)){
				isMove = false;
				return;
			}
		}
		css(banner,'translateX',disX + elX);
	});
	
	bannerList.addEventListener('touchend',function(e) {
		if(!isMove){
			return
		}
		//	获取走到了第几张
		nowBanner = Math.round(css(banner,'translateX')/bannerW);	
		var target = nowBanner*bannerW;
		startMove({
			el: banner,
			target: {
				translateX: target
			},
			type: "easeOutStrong",
			time: 800
		});
		
		nub = -nowBanner;
				//	label选中时事件
		for(var i = 0; i < bannerBtn.length; i++){
			bannerBtn[i].className = "";
		}
		bannerBtn[Math.abs(nowBanner)%bannerBtn.length].className = "btnHover";
		
		autoAct();
	});

//	轮播部分
	autoAct();
	function autoAct() {
		clearInterval(timer)
		timer = setInterval(function() {
			if(nub == banImg.length -1) {
				nub = bannerBtn.length -1;
				css(banner,'translateX',-nub*bannerW)
			}
			nub++;
			startMove({
				el: banner,
				target: {
					translateX: - nub*bannerW
				},
				type: "easeOutStrong",
				time: 500
			});
			//	label选中时事件
			for(var i = 0; i < bannerBtn.length; i++){
				bannerBtn[i].className = "";
			}
			bannerBtn[nub%bannerBtn.length].className = "btnHover";
			console.log(nub,nowBanner)
		},1000)
	};
	
})();