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
var curPlayLine = 0,volume = 0.5,currentPlay;
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
                    <td style="display:none">${song.album.picUrl}</td>
                </tr>`
                $('tbody').html(html);

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
                            media.play();
                        }
                      })
                });
            });
        }
    });
});

media.volume = volume;


//播放按钮变化
$('#playBtnGroup').find(".play").on("click",function () {
    console.log(media);
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







//////////////////     收藏的歌单点击打开          ////////////////
$('.list_create_001').on('click',function() {

})
