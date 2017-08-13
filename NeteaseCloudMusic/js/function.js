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

//	各类进度条拖拽事件
function dragProgress(data) {
	var progressArc = data.progressArc;
	var progressBar = data.progressBar;
	var progressBox = data.progressBox;
	var audio = data.audio
	//获取进度条初始位置
	var progressBoxOffset = progressBox.get(0).getBoundingClientRect();
	var changeVal = 0;
	//	鼠标按下
	progressArc.on('mousedown',function(e) {
		var x = e.clientX;
		//获取拖动按钮的位置
		var arcOffset = progressArc.get(0).getBoundingClientRect();
		var arcOffsetL = arcOffset.left;
	    var disX = x - arcOffsetL;
		function moveArc(e) {
			var nowX = e.clientX;
			// 计算出移动了多少(鼠标当前位置 - 进度条距离左边框位置 - 鼠标点击初始位置/进度条可视宽)得出比例
			var nowdisX = (((nowX- progressBoxOffset.left - disX)/progressBoxOffset.width)*100).toFixed(2);
			// 过界处理
			nowdisX = nowdisX <= 0 ? 0:( nowdisX >= 100?100 : nowdisX);
			// 判断是否可以播放
	        if (!!audio.attr("src")) {
				//	进度条样式更新
		        progressBar.css("width", nowdisX + "%");
	           	// 改变系统音量同步
	           	changeVal = data.callback_move && data.callback_move( nowdisX );
	        }
		}
		function onmouseup() {
			$(document).off("mousemove",moveArc);
			$(document).off("mouseup",onmouseup);
			// 判断是否可以播放
				//转换成布尔值
			if (!!audio.attr("src")) {
	        	// 改变音乐进度同步
				data.callback_up && data.callback_up(changeVal);
	        }
		};
		// 鼠标移动
		$(document).on('mousemove',moveArc)
		// 鼠标抬起
		$(document).on('mouseup',onmouseup)
	});
};


function dblPlay() {
	//  单独tr的双击播放后，左下小窗变成对应音乐的信息
	$('tr').on('dblclick',function() {
		var _this = this;
		currentPlay = this
		$('tr').eq(0).find("td.index").html('<i class="fa fa-volume-up" aria-hidden="true"></i>').addClass("active");
		$('.songname').html(this.children[2].innerHTML);
		$('.singersname').html(this.children[3].innerHTML);
		$('.albumname').html(this.children[4].innerHTML);
		$('.poster img').attr("src",this.children[6].innerHTML);
		$('#smallwindow_singerName').html(this.children[3].innerHTML);
		$('#smallwindow_albumPic').attr("src",this.children[6].innerHTML);
		$.ajax({
			url: '/music/url',
			data: {
			  id: this.dataset.musicid
			},
			success(data) {
				//播放按钮变化
				stylePlayBtn($('#playBtnGroup').find(".play"),"play");
				//当前播放行高亮
				$('tr').find("td.index").each(function (index,item) {
					$(item).html(item.dataset.num).removeClass("active");
				});
				$(_this).find("td.index").html('<i class="fa fa-volume-up" aria-hidden="true"></i>').addClass("active");
				$(media).attr("src",data.data[0].url);
				//	歌曲播放
				$(media).on("canplay",function () {
					this.play();
				});
			}
		});
	});
}
