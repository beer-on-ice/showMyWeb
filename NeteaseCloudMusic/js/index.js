let playWindow = null;
let timeObj = {};

///////////////////  基础的交互样式       //////////////////////
$(function () {
	// tab选项卡切换样式
	styleActive([$(".R_page .tabbtns"),".label_btn"],"click","active");
	// list切换样式
	styleActive([$("#listContainer>.list>.btngroups"),".btn"],"click","active");
	// tr切换样式
	styleActive([$(".infolist"),"tr"],"click","active");
	// 收起 | 展开 歌单列表
	$("#listContainer>.list>.title .unfoldlist").on("click",function () {
		var $btnGroups=$(this).parents(".list").find(".btngroups");
		if ($btnGroups.css("display")==="block") {
			$btnGroups.slideUp(500);
			$(this).html('<i class="fa fa-angle-right" aria-hidden="true"></i>');
		} else {
			$btnGroups.slideDown(500);
			$(this).html('<i class="fa fa-angle-down" aria-hidden="true"></i>');
		}
	});
});
/////////////////   一些基础的交互     /////////////////
// 顶部菜单input回车搜索
$("#inpSearch").on("keydown",function (ev) {
    var ev=ev || window.event;
    if (ev.keyCode===13) {
        funcSearch();
    }
});
// 顶部菜单query图标点击搜索
$("#top_searchBtn").on("click",function () {
    funcSearch();
});
// 展开与缩放歌曲详情页
$("#btnExpandPlayBox").on("click",function () {
	// style: 展开歌曲详情页
	$("#pageSongDetail").css({
		"top":"60px",
		"right":0,
		"opacity":1
	});
});
$("#btnCompressPlayBox").on("click",function () {
	// style: 缩放歌曲详情页
	$("#pageSongDetail").css({
		"top":"100%",
		"right":"100%",
		"opacity":0
	});
});

var media = $("#audio").get(0);
var currentPlay;
////////////////      搜索后生成歌曲    ////////////////
$('#top_searchBtn').on('click',function(str) {
    var str = $("#inpSearch").val().trim();
    if (!str) {
		showTipBox("error","不能为空哟！");
        return;
	}
    $.ajax({
        url: '/search',
        data: {
            keywords: $('#inpSearch').val()
        },
        success(data) {
            //  搜索概述
            $("#search_count").find(".input").html($('#inpSearch').val());
            $("#search_count").find(".count").html(data.result.songCount);

            var html = '';
            data.result.songs.forEach( function(song,i){
                let artists = song.artists.map(artist=> {
                    return artist.name;
                }).join('');
                timeObj = formatTime(song.duration/1000);
                html += `<tr data-musicid="${song.id}">
                    <td class="index" data-num="`+((+i+1)<10?"0"+(+i+1):(+i+1))+`">`+((+i+1)<10?"0"+(+i+1):(+i+1))+`</td>
                    <td><i class="fa fa-heart-o addMylove" aria-hidden="true"></i>&nbsp;
        <i class="fa fa-download" aria-hidden="true"></i></td>
                    <td>${song.name}</td>
                    <td>${artists}</td>
                    <td>${song.album.name}</td>
                    <td>`+timeObj.I+`:`+timeObj.S+`</td>
                    <td style="display:none">${song.album.picUrl}</td>
                </tr>`
                $('tbody').html(html);

                dblPlay();
            });
        }
    });
});

//	歌曲时长设置和歌曲当前进度设置
$(media).on("timeupdate",function () {
	var objTimeCurTime = formatTime(this.currentTime);
	var objTimeDuration = formatTime(this.duration);
	$('#audio_currentTime').html(objTimeCurTime.I+":"+objTimeCurTime.S);
	$('#audio_duration').html(objTimeDuration.I+":"+objTimeDuration.S);
	$('#progress_box div:nth-child(2)').css("width",(this.currentTime/this.duration).toFixed(4)*100+"%");
});
//播放按钮变化
$('#playBtnGroup').find(".play").on("click",function () {
    if (!media.src) {
        showTipBox("info","没有播放资源，请选择曲目");
    } else {
        if (!media.paused) {
            media.pause();
            // play按钮样式
            stylePlayBtn($('#playBtnGroup').find(".play"),"pause");
        } else {
            media.play();
            // play按钮样式
            stylePlayBtn($('#playBtnGroup').find(".play"),"play");
        }
    }
});
// 切换下一首
$('#playBtnGroup').find(".next").on("click",function () {
	if (!media.src) {
		showTipBox("info","没有播放资源，请选择曲目");
	} else {
        currentPlay.className = '';
        if(!currentPlay.nextSibling) {
            showTipBox("info","已经是最后一首了！");
            return;
        }
        currentPlay.nextSibling.className = 'nowPlay';
        $('tr').eq(0).find("td.index").html('<i class="fa fa-volume-up" aria-hidden="true"></i>').addClass("active");
        $('.songname').html(currentPlay.nextSibling.children[2].innerHTML);
        $('.singersname').html(currentPlay.nextSibling.children[3].innerHTML);
        $('.albumname').html(currentPlay.nextSibling.children[4].innerHTML);
        $('.poster img').attr("src",currentPlay.nextSibling.children[6].innerHTML);
        $('#smallwindow_singerName').html(currentPlay.nextSibling.children[3].innerHTML);
        $('#smallwindow_albumPic').attr("src",currentPlay.nextSibling.children[6].innerHTML);
        $.ajax({
            url: '/music/url',
            data: {
              id: currentPlay.nextSibling.dataset.musicid
            },
            success(data) {
                //播放按钮变化
                stylePlayBtn($('#playBtnGroup').find(".play"),"play");
                //当前播放行高亮
                $('tr').find("td.index").each(function (index,item) {
                    $(item).html(item.dataset.num).removeClass("active");
                });
                $('.nowPlay').find("td.index").html('<i class="fa fa-volume-up" aria-hidden="true"></i>').addClass("active");
                $(media).attr("src",data.data[0].url);
                media.play();
            }
          })
        currentPlay = currentPlay.nextSibling
	}
});
// 切换上一首
$('#playBtnGroup').find(".prev").on("click",function () {
	if (!media.src) {
		showTipBox("info","没有播放资源，请选择曲目");
	} else {
        if(!currentPlay.previousSibling) {
            showTipBox("info","已经是第一首了！");
            return;
        }
        currentPlay.className = '';
        currentPlay.previousSibling.className = 'nowPlay2';
        $('tr').eq(0).find("td.index").html('<i class="fa fa-volume-up" aria-hidden="true"></i>').addClass("active");
        $('.songname').html(currentPlay.previousSibling.children[2].innerHTML);
        $('.singersname').html(currentPlay.previousSibling.children[3].innerHTML);
        $('.albumname').html(currentPlay.previousSibling.children[4].innerHTML);
        $('.poster img').attr("src",currentPlay.previousSibling.children[6].innerHTML);
        $('#smallwindow_singerName').html(currentPlay.previousSibling.children[3].innerHTML);
        $('#smallwindow_albumPic').attr("src",currentPlay.previousSibling.children[6].innerHTML);
        $.ajax({
            url: '/music/url',
            data: {
              id: currentPlay.previousSibling.dataset.musicid
            },
            success(data) {
                //播放按钮变化
                stylePlayBtn($('#playBtnGroup').find(".play"),"play");
                //当前播放行高亮
                $('tr').find("td.index").each(function (index,item) {
                    $(item).html(item.dataset.num).removeClass("active");
                });
                $('.nowPlay2').find("td.index").html('<i class="fa fa-volume-up" aria-hidden="true"></i>').addClass("active");
                $(media).attr("src",data.data[0].url);
                media.play();
            }
          })
        currentPlay = currentPlay.previousSibling
	}
});
//静音
$('#muteBtn').on("click",function () {
	if (!media.muted) {
		media.muted=true;
		$('#muteBtn').html('<i class="fa fa-volume-off" aria-hidden="true"></i>').attr("title","恢复音量");
		$('#vol_progressBar').css("display","none");
	} else {
		media.muted=false;
        $('#muteBtn').html('<i class="fa fa-volume-up" aria-hidden="true"></i>').attr("title","静音");
		$('#vol_progressBar').css("display","block");
	}
});
//专辑封面旋转(播放旋转，暂停不旋转)
$(media).on("play",function () {
	// 转盘动画恢复
	$('#bgDisc').css({
		"-webkit-animation-play-state":"running",
		"animation-play-state":"running"
	});
	// 磁针放下
	$('#discNeedle').addClass("play");
});
$(media).on("pause",function () {
	// 转盘动画停止
	$('#bgDisc').css({
		"-webkit-animation-play-state":"paused",
		"animation-play-state":"paused"
	});
	// 磁针抬起
	$('#discNeedle').removeClass("play");
});

// 播放完成 自动播放下一首 直至最后一首停止
$(media).on("ended",function () {
	console.log(1);
});

var volume = 0.5;
// 进度条初始化
$('#progress_box div:nth-child(2)').css("width","0%");
$('#vol_progress_box div:nth-child(1)').css("width","50%");
$('#vol_progress_box div:nth-child(1) div').css("width","14px");

//改变音乐进度条
dragProgress({
	progressBar:$('#progress_bar'),
	progressArc:$('#progress_arc'),
	progressBox:$('#progress_box'),
	audio:$(media),
	callback_move:function (nowdisX) {
		// 改变播放时间
			//计算出移动了多少秒
       	var changeVal=(media.duration * nowdisX /100).toFixed(2);
       	var objTime = formatTime(changeVal);
       	$('#audio_currentTime').html(objTime.I+":"+objTime.S);
       	return changeVal;
	},
	callback_up:function (changeVal) {
		// 改变播放位置
		media.currentTime = changeVal;
		stylePlayBtn($('#playBtnGroup').find(".play"),"play");
	}
})

// 调节音量
	// 音量初始化
media.volume = volume;
dragProgress({
	progressBar:$('#vol_progress_bar'),
	progressArc:$('#vol_progress_arc'),
	progressBox:$('#vol_progress_box'),
	audio:$(media),
	callback_move:function (nowdisX) {
		// 更新音量
    	media.volume=(1*nowdisX/100).toFixed(2);
		//为0则是静音
       	if (media.volume <= 0) {
       		$('#muteBtn').html('<i class="fa fa-volume-off" aria-hidden="true"></i>')
       	} else {
       		$('#muteBtn').html('<i class="fa fa-volume-up" aria-hidden="true"></i>')
       	}
       	return 0;
	}
});

dblPlay();

////////////// 添加收藏  //////////////
var loveList = [];
$('table').delegate('.addMylove', 'click', function() {
	var love = this.parentNode.parentNode;
	//用sessionStorage来记录已经加入歌单的
	loveList = sessionStorage.getItem('loveList');
	if (!loveList) {
		loveList = [{
			id: this.parentNode.parentNode.dataset.musicid,
			name: this.parentNode.parentNode.children[2].innerHTML,
			singer: this.parentNode.parentNode.children[3].innerHTML,
			album: this.parentNode.parentNode.children[4].innerHTML,
			time:  this.parentNode.parentNode.children[5].innerHTML,
			picUrl: this.parentNode.parentNode.children[6].innerHTML
		}];
	} else {
		loveList = JSON.parse(loveList);
		loveList.push({
			id: love.dataset.musicid,
			name: love.children[2].innerHTML,
			singer: love.children[3].innerHTML,
			album: love.children[4].innerHTML,
			time:  love.children[5].innerHTML,
			picUrl: love.children[6].innerHTML
		});
	}
	// 数组对象去重（百度来，不理解）
	var hash = {};
	loveList = loveList.reduce(function(item, next) {
	    hash[next.id] ? '' : hash[next.id] = true && item.push(next);
	    return item
	}, [])
	sessionStorage.setItem('loveList', JSON.stringify(loveList));
})
var loveHtml = '';
//////////////////     我喜欢的音乐点击打开          ////////////////
$('.list_create_001').on('click',function() {
	loveHtml = '';
	loveList = sessionStorage.getItem('loveList');
	if (!loveList) {
		loveList = [];
	} else {
		loveList = JSON.parse(loveList);
	}
	var length = loveList.length;
	loveList.forEach(function(item,i) {
		loveHtml += `<tr data-musicid="${item.id}">
			<td class="index" data-num="`+((+i+1)<10?"0"+(+i+1):(+i+1))+`">`+((+i+1)<10?"0"+(+i+1):(+i+1))+`</td>
			<td><i class="fa fa-heart-o addMylove" aria-hidden="true"></i>&nbsp;
		<i class="fa fa-download" aria-hidden="true"></i></td>
			<td>${item.name}</td>
			<td>${item.singer}</td>
			<td>${item.album}</td>
			<td>${item.time}</td>
			<td style="display:none">${item.picUrl}</td>
		</tr>`
	})
	$('tbody').html(loveHtml);

	dblPlay();
})


//	存储已存在的首页歌曲
	var indexList = $('.indexS');
	var len = indexList.length;
	var len2 = 0;
	indexList = $.makeArray( indexList );
	//每次刷新，sessionStorage就存一次
	indexList.forEach(function(item) {
		indexList = sessionStorage.getItem('indexList');
		if (!indexList) {
			indexList = [{
				id: item.dataset.musicid,
				name: item.children[2].innerHTML,
				singer: item.children[3].innerHTML,
				album: item.children[4].innerHTML,
				time:  item.children[5].innerHTML,
				picUrl: item.children[6].innerHTML
			}];
		} else {
			indexList = JSON.parse(indexList);
			indexList.push({
				id: item.dataset.musicid,
				name: item.children[2].innerHTML,
				singer: item.children[3].innerHTML,
				album: item.children[4].innerHTML,
				time:  item.children[5].innerHTML,
				picUrl: item.children[6].innerHTML
			});
		}
		sessionStorage.setItem('indexList', JSON.stringify(indexList));
	});
	
	len2 = indexList.length;
	if(len > len2) {
		console.log('要存储');
	} else {
		console.log('不存储');
	}


//////////////// 首页歌单点击		////////////////
$('.list_create_like ').on('click',function() {
	loveHtml = '';
	indexList = sessionStorage.getItem('indexList');
	if (!indexList) {
		indexList = [];
	} else {
		indexList = JSON.parse(indexList);
	}
	indexList.forEach(function(item,i) {
		loveHtml += `<tr data-musicid="${item.id}">
			<td class="index" data-num="`+((+i+1)<10?"0"+(+i+1):(+i+1))+`">`+((+i+1)<10?"0"+(+i+1):(+i+1))+`</td>
			<td><i class="fa fa-heart-o addMylove" aria-hidden="true"></i>&nbsp;
		<i class="fa fa-download" aria-hidden="true"></i></td>
			<td>${item.name}</td>
			<td>${item.singer}</td>
			<td>${item.album}</td>
			<td>${item.time}</td>
			<td style="display:none">${item.picUrl}</td>
		</tr>`
	})
	$('tbody').html(loveHtml);
	dblPlay();
});
