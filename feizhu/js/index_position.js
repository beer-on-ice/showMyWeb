document.addEventListener('touchstart',function(e) {
	e.preventDefault();
});
(function() {
	var box = document.querySelector('#box');
	box.style.position = "absolute";
	var start,startEl,lastTime,lastDis,lastSpeed;
	var min = 0;
	var max = 0;
	var TC = .25;
	
	box.addEventListener('touchstart',function(e) {
		var touch = e.changedTouches[0];
		startY = touch.pageY;
		startEl = css(box,'top');
		lastTime = Date.now();	//	上一次时间
		lastDis = touch.pageY;	//	上一次位置
		min = window.innerHeight - box.offsetHeight;
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
		css(box,'top',y);
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
		var target = translate + css(box,'top');
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
		var time = Math.abs((target - css(box,'top'))*1.3);
		time = (time>0&&time<200)?200:time;
		startMove({
			el:box,
			target: {
				top:target
			},
			time:time,
			type:type
		});
	});
})();


///	轮播
(function() {
	var banner = document.querySelector('.banner')
	var bannerList = document.querySelector('.bannerList');
	var bannerW = css(bannerList,'width');
	var banImg = document.querySelectorAll('.banner>img');
	var bannerBtn = document.querySelectorAll('label');
	var nub = 0;
	var timer;
	
	//	拖拽部分
	var startMouseX,elX,nowMouseX;
	var nowBanner = 0;
	bannerList.addEventListener('touchstart',function(e) {
		clearInterval(timer);
		startMouseX = e.changedTouches[0].pageX;
		//	当是第0张时，将它切换到第2组第一张
		if(Math.abs(nowBanner) == 0) {
			nowBanner = - bannerBtn.length;
			css(banner,'left',nowBanner*bannerW)
		}
		//当是最后一张时，切换到第一组的最后一张
		if(Math.abs(nowBanner) == banImg.length-1) {
			nowBanner = - (bannerBtn.length-1);
			css(banner,'left',-nowBanner*bannerW)
		}
		
		elX = css(banner,"left");
	});		
	
	bannerList.addEventListener('touchmove',function(e) {
		nowMouseX = e.changedTouches[0].pageX;
		css(banner,'left',nowMouseX - startMouseX + elX);
	});
	
	bannerList.addEventListener('touchend',function(e) {
		//	获取走到了第几张
		nowBanner = Math.round(css(banner,'left')/bannerW);	
		var target = nowBanner*bannerW;
		startMove({
			el: banner,
			target: {
				left: target
			},
			type: "easeOutStrong",
			time: 800
		});
		//	label选中时事件
		for(var i = 0; i < bannerBtn.length; i++){
			bannerBtn[i].className = "";
		}
		bannerBtn[Math.abs(nowBanner)%bannerBtn.length].className = "btnHover";
	});
})();


//	轮播部分
(function() {
	
})();
