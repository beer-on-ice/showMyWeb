// 歌曲时间转换
function formatTime(seconds) {
	var h=0,
		i=0,
		s=Math.floor(seconds);
		h=Math.floor(s/3600);
		i=Math.floor((s%3600)/60);
		s=s%3600%60;
	return {
		H:h=h<10?"0"+h:h,
		I:i=i<10?"0"+i:i,
		S:s=s<10?"0"+s:s
	};
};

// 搜索歌曲功能函数
function funcSearch() {
    // 显示搜索页 隐藏列表页
    $("#pageMain").slideUp(300);
    $("#pageSearch").slideDown(300);
    // 缩放歌曲详情页
    $("#pageSongDetail").css({
        "top":"100%",
        "right":"100%",
        "opacity":0
    });
};

//  给对应的添加class
function styleActive(eles,eventType,className) {
	if (eles instanceof Array) {
		eles[0].on(eventType,eles[1],function () {
			eles[0].find(eles[1]).each(function (index,item) {
				$(item).removeClass(className);
			});
			$(this).addClass(className);
		});
	} else {
		eles.on(eventType,function () {
			eles.each(function (index,item) {
				$(item).removeClass(className);
			});
			$(this).addClass(className);
		});
	}
}

// 各种提示框信息
function showTipBox(tipType,tipText) {
	$("#tipsBox").find(".tip").each(function (index,item) {
		$(item).removeClass("show");
	});
	$("#tipsBox").find(".tip_"+tipType).addClass("show").find(".tiptext").html(tipText);
	$("#backScreen").css("display","block");
	$("#tipsBox").css("display","block").on("animationend",function () {
		$(this).css("display","none");
		$("#backScreen").animate({
			"opacity":"0"
		},30,function () {
			$(this).css({
				"display":"none",
				"opacity":1
			});
		});
	});
};

//按钮样式
function stylePlayBtn($ele,playType) {
	var html_play='<i class="fa fa-play" aria-hidden="true"></i>';
	var html_pause='<i class="fa fa-pause" aria-hidden="true"></i>';
	$ele.html((playType==="play"?html_pause:html_play));

};
