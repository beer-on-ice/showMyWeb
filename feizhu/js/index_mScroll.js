document.addEventListener('touchstart', function(e) {
	e.preventDefault();
});

//	设置图片左右切换
(function() {
	var bannerList = document.querySelector('.bannerList');
	var banner = document.querySelector('.banner');
	var list = banner.children;
	var listW = list[0].offsetWidth;
	var bannerBtn = document.querySelectorAll('label');
	var now = 0;
	//	按下时切换
	function start() {
		if(now == 0) {
			now = bannerBtn.length;
		} else if(now == list.length - 1) {
			now = bannerBtn.length - 1;
		}
		css(banner,'translateX',-now*listW);
	}
	function up() {
		clearInterval(banner.timer);
		//	获取走到了第几张
		now = -Math.round(css(banner,'translateX')/listW);
		console.log(now)
		var target = -now*listW;
		startMove({
			el:banner,
			target: {
				translateX:target
			},
			time: 400,
			type:'easeOut'
		})
		for(var i = 0 ; i< bannerBtn.length; i++){
			bannerBtn[i].className = "";
		}
		bannerBtn[now%bannerBtn.length].className = "btnHover";
	}
	mScroll({
		wrap:bannerList,
		dir:'x',
		showBar:false,
		over:'none',
		start:start,
		up:up
	});
})();
