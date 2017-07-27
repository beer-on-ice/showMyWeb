///////		整个桌面的右键菜单	///////
(function(){
	var menu = document.querySelector('#conTextMenu');
	document.addEventListener('contextmenu',function(e) {
		showContextMenu(e,data.menu.deskMenu,menu);
		//	移入时二级菜单创建并显示
		var menus = document.querySelectorAll('#conTextMenu>li');
		for(var i=0;i<data.menu.deskMenu.length;i++) {
			var hasSecond = data.menu.deskMenu[i].child;
			if(hasSecond) {
				var secondMenu = document.createElement('ul');
				hasSecond.forEach(function(item) {
					var secondMenuLi = document.createElement('li');
					var p = document.createElement('p');
					secondMenuLi.innerHTML = `<p>${item.name}</p>`;	
					
					secondMenuLi.onmousedown = contextmenuCallback[item.callBackName];
					
					secondMenu.appendChild(secondMenuLi);
					menus[i].appendChild(secondMenu);
				});
			}
		}
		for(var i=0;i<menus.length;i++) {
			menus[i].onmouseover = function() {
				var ul = this.children[1];
				if(ul) {
					ul.style.cssText = 'display: block;';
					resetUlOffset(ul)
				}
			};
			menus[i].onmouseout = function(){
				var ul = this.children[1];
				if(ul){
					ul.style.display = "none";
				}
			};
		}
	});
	window.addEventListener('resize', function(e) {
			var x = css(menu,'left');
			var y = css(menu,'top');
			var maxX = document.documentElement.clientWidth -  menu.offsetWidth;
			var maxY = document.documentElement.clientHeight -  menu.offsetHeight;
			menu.style.left = Math.min(maxX,x) + "px";
			menu.style.top = (y  > maxY? y  - menu.offsetHeight:y) + "px";
	});
	document.addEventListener('mousedown',function(e) {
		menu.style.display = 'none';
	});
	//	在窗口大小变化时调整ul位置
	function resetUlOffset(ul){
		var rect = ul.getBoundingClientRect();
		if(rect.right > document.documentElement.clientWidth){
			ul.style.left = -(rect.width - 5) + "px";
		}
		if(rect.bottom > document.documentElement.clientHeight){
			ul.style.top = (ul.offsetParent.clientHeight - rect.height) + "px";
		}
	}
	//	设置右键菜单内容数据
	function showContextMenu(e,menuData,which) {
		var menu = document.querySelector('#conTextMenu');
		e.preventDefault();
		menu.style.display = 'block';
		menu.innerHTML = '';
		menu.style.left = e.clientX + "px";
		menu.style.top = e.clientY + "px";
		menuData.forEach(function(item,index) {
			var li = document.createElement('li');
			var p = document.createElement('p');
			var label = document.createElement('label');
			li.onmousedown = contextmenuCallback[item.callBackName];
			li.innerHTML = `<p>${item.name}</p>`;
			which.appendChild(li);
		});
		resetOffset(menu);
		function resetOffset(menu) {
			var x = css(menu,'left');
			var y = css(menu,'top');
			var maxX = document.documentElement.clientWidth -  menu.offsetWidth;
			var maxY = document.documentElement.clientHeight -  menu.offsetHeight;
			menu.style.left = Math.min(maxX,x) + "px";
			menu.style.top = (y  > maxY? y  - menu.offsetHeight:y) + "px";
		}
	}
	//	创建文件夹事件
var contextmenuCallback = {
	createFloder: function() {
		setTimeout(function() {
			createFile('file');
		});
	},
	nameSort:function() {
		nameSort();
	},
	timeSort: function() {
		timeSort();
	},
	typeSort: function() {
		typeSort();
	},
	changeBg: function() {
		changeBg();
	},
	uploadFile:function() {
		//	代码操作代码点击
		fileBtn.click();
	}
}

////////	新建文件夹		////////
	var files = document.querySelector('#files');
	var start = "新建文件夹";
//	右键点击创建
//	快捷键创建	shift+n
	document.addEventListener('keyup',function(e) {
		if(e.keyCode ==78&&e.shiftKey) {
			createFile("file");
			e.preventDefault();
		}
	});
//	文件上传
var fileBtn = document.querySelector('#fileBtn');
fileBtn.onclick = uploadFile;
function uploadFile(){
	menu.style.display = "none";
	fileBtn.addEventListener('change',function(e) {
		var file = this.files[0];
		var fileType = file.type.split("/")[0]; 
		if(!(fileType == 'text'
			||fileType == "image"
			||fileType == "video"
			||fileType == "audio"
			)) {
			alert('不支持的格式(只支持图文音视)')
		}
		createFile(fileType,file);
		fileBtn.value = "";
	});
}
//	打开上传的文件
var fileDetail = document.querySelector('#fileDetail');
var fileDetailCols = document.querySelector('.fileDetailCols');
var fileDetailsC = fileDetail.children[0];
fileDetailCols.addEventListener('click',function(e) {
	fileDetailsC.innerHTML = "";
	fileDetail.style.display = "none";
});
fileDetail.addEventListener('click', function(e) {
	e.stopPropagation();
});
fileDetail.addEventListener('contextmenu', function(e) {
	e.stopPropagation();
	e.preventDefault();
});
fileDetail.addEventListener('mousedown', function(e) {
	e.stopPropagation();
});
function openFile(file,fileType) {
	fileDetailsC.innerHTML = '';
	var reader = new FileReader();
	reader.onload = function(e) {
		fileDetail.style.display = 'block';
		var result = e.target.result;
		if(fileType == 'text') {
			var p = document.createElement('p');
			p.innerHTML = result;
			fileDetailsC.addpendChild(p);
		}
		else if(fileType == 'image') {
			var img = new Image();
			img.src = result;
			fileDetailsC.appendChild(img);
		}
		else if(fileType == 'video') {
			var video = document.createElement('video');
			video.setAttribute('loop','');
			video.setAttribute('controls','');
			video.src = result;
			fileDetailsC.appendChild(video)
		}
		else if(fileType == 'audio') {
			var audio = document.createElement('video');
			audio.setAttribute('loop','');
			audio.setAttribute('controls','');
			audio.src = result;
			fileDetailsC.appendChild(audio)
		}
	};
	if(fileType == 'text') {
		reader.readAsText(file);
	} else {
		reader.readAsDataURL(file);
	}
}

//	creatFile新建文件夹
	var typeIndex = {
		"file": 0,
		"text": 1,
		"image": 2,
		"audio": 3,
		"video": 4
	}
	function createFile(fileType,file) {
		var newFile = document.createElement('div');
		var offset  = getfileOffset();
		var fileName,fileImage;
		newFile.style.left = offset.x + 'px';
		newFile.style.top = offset.y + "px";
		newFile.className = "file";
		newFile.fileType = typeIndex[fileType];
		newFile.time = Date.now();
		switch(fileType) {
			case 'file':
				fileName = getFileName();
				fileImage = 'img/img/file.png';
				break;
			case 'image':
				fileName = file.name;
				fileImage = 'img/img/img.png';
				break;
			case 'text':
				fileName = file.name;
				fileImage = 'img/img/txt.png';
				break;	
			case 'video':
				fileName = file.name;
				fileImage = 'img/img/video.png';
				break;
			case 'audio':
				fileName = file.name;
				fileImage = 'img/img/audio.png';
				break;	
		}
		newFile.innerHTML = `<div class="img" style="background-image:url(${fileImage})"></div><p>${fileName}</p><input type="text" value="">`;
		setEv(newFile,file,fileType);
		files.appendChild(newFile);
	}
	//	给创建出来的文件夹添加事件
	function setEv(file,fileDetails,fileType) {
		var subMenu = document.querySelector('#subMenu');
		var fileEls = files.getElementsByClassName('file');
		var timer;
		file.child= [];
		file.addEventListener('mouseenter',function(e) {
			if(window.inMove) {
				return;
			}
			this.classList.add('hover');
		});
		file.addEventListener('click',function(e) {
			subMenu.style.display = 'none';
			e.stopPropagation();
			if(!e.ctrlKey) {
				for(var i=0;i<fileEls.length;i++) {
					fileEls[i].classList.remove('active');
				}
			}
			this.classList.add('active');
		});
		file.addEventListener('mouseleave',function(e) {
			this.classList.remove('hover');
		});
	//	重命名
		var p = file.children[1];
		var input = file.children[2];
		var info = document.querySelector('.info');
		file.addEventListener('dblclick',function(e) {
			if(fileType != 'file') {
				openFile(fileDetails,fileType);
			} else {
				console.dir(this);
			}
		});
		function rename() {
			p.style.display = "none";
			input.style.display = "block";
			input.value = p.innerHTML;
			input.select();
		}
		input.onblur = function() {
			if(hasName(input.value,p)) {
				info.innerHTML = "文件夹重名了，请重新输入";
				startMove({
					el:info,
					target: {
						top: 0
					},
					time:500,
					type:'bounceOut'
				});
				clearTimeout(timer);
				this.focus();
				setTimeout(function() {
					startMove({
						el:info,
						target: {
							top: -50
						},
						time:300,
						type:'easeIn'
					})
				},1000);
				return;
			}
			if(input.value.trim("") != ""){
				p.innerHTML = input.value;
			}
			renameEnd();
		};
		function renameEnd(){
			p.style.display = "block";
			input.style.display = "none";
		}
		///////	单独文件夹的右键菜单	////////
		file.addEventListener('contextmenu',function(e) {
			e.stopPropagation();
			e.preventDefault();
			cancelActive();
			subMenu.innerHTML = '';
			file.classList.add('active');
			showContextMenu(e,data.menu.fileMenu,subMenu);
			subMenu.style.display = 'block';
			subMenu.style.left = e.clientX + "px";
			subMenu.style.top = e.clientY + "px";
			subMenu.children[0].onclick = function() {
				rename();
//				subMenu.style.display = 'block';
			};
			subMenu.children[1].onclick = function(){
				files.removeChild(file);
				resetOffset();
			};
			document.querySelector('#conTextMenu').style.display = "none";
		});
		//	桌面元素的拖拽删除
		var trash = document.querySelector('#trash');
		file.addEventListener('mousedown',function(e) {
			if(e.button == 2) {
				return;
			}
			var otherFiles = document.querySelectorAll('.file:not(.active)');
//			console.log(otherFiles)
			document.getElementById("conTextMenu").style.display = "none";
			e.stopPropagation();
			e.preventDefault();
			document.addEventListener('mousemove',move);
			document.addEventListener('mouseup',end);
			
			var nowNode = null;	//	克隆的节点
			var startX = e.clientX;
			var startY = e.clientY;
			var self = this;
			var cloneEls = [];
			var startElOffset = [];
			var activeNodes = null;
			function move(e) {
				if(!nowNode) {
					activeNodes = files.querySelectorAll('.hover,.active');
					for(var i=0;i<activeNodes.length;i++) {
						var node = activeNodes[i].cloneNode(true);
						node.style.opacity = '.5';
						cloneEls.push(node);
						files.appendChild(node);
						if(self == activeNodes[i]){
							nowNode = node;//找到当前点击的这个元素克隆出来的节点
						}
						startElOffset[i] = {x:css(activeNodes[i],"left"),y:css(activeNodes[i],"top")};
					}
				}
				var disX = e.clientX - startX;
				var disY = e.clientY - startY;
				for(var i = 0; i < cloneEls.length;i++){
					css(cloneEls[i],"left", disX + startElOffset[i].x);
					css(cloneEls[i],"top", disY + startElOffset[i].y);
				}
				if(getCollide(nowNode,trash)){
					trash.classList.add("hover");
				} else {
					trash.classList.remove("hover");
				}
			}
			function end(e) {
				document.removeEventListener('mousemove',move);
				document.removeEventListener('mouseup',end);
				if(!nowNode){
					return;
				}
				if(getCollide(nowNode,trash)){
					//files.removeChild(self);
					for(var i = 0; i < activeNodes.length; i++){
						files.removeChild(activeNodes[i]);
					}
					resetOffset();
				}
				//	碰撞文件夹，上传的文件放入文件夹
				else {
					for(var i=1;i<otherFiles.length;i++) {
						if(otherFiles[i] != self&&otherFiles[i].fileType === 0) {
							if(getCollide(otherFiles[i],nowNode)){
						 	for(var j = 0; j < activeNodes.length; j++){
								files.removeChild(activeNodes[j]);
								otherFiles[i].child.push(activeNodes[j]);
								}
								resetOffset();
					 			break;
							}
						}
					}
				}	
				for(var i = 0; i < cloneEls.length;i++){
					files.removeChild(cloneEls[i]);
				}
				trash.classList.remove("hover");
			}
		});
	}
	
	///	点击关闭右键菜单
document.addEventListener('contextmenu', function(e) {
	document.querySelector('#subMenu').style.display = "none";
});
document.addEventListener('click', function(e) {
	document.querySelector('#subMenu').style.display = "none";
});
/////	文件排序	/////
	//	字母排序
function nameSort() {
	var nameSort = document.querySelector('#nameSort');
		var file = document.querySelectorAll('.file');
		var fileArr = [];
		for(var i=1;i<file.length;i++) {
			fileArr.push(file[i])
		}
		fileArr.sort(function(a,b) {
			if(pinyin.getFullChars(a.children[1].innerHTML) > pinyin.getFullChars(b.children[1].innerHTML)){
				return 1;
			}
			return -1;
		});
		for(var i = 0; i < fileArr.length; i++){
			files.appendChild(fileArr[i]);
		}
		resetOffset();
}
	//	时间排序
function timeSort() {
var timeSort = document.querySelector('#timeSort');
	var file = document.querySelectorAll('.file');
	var fileArr = [];
	for(var i = 1; i < file.length; i++){
		fileArr.push(file[i]);
	}
	fileArr.sort(function(a,b){
		return a.time - b.time;
	});	
	for(var i = 0; i < fileArr.length; i++){
		files.appendChild(fileArr[i]);
	}
	resetOffset();
}
	//	类型排序
function typeSort() {
	var typeSort = document.querySelector('#typeSort');
	var file = document.querySelectorAll('.file');
	var fileArrs = [];
	var fileArr = [];	//	所有的文件夹
	var image = [];		//	所有的图片
	var video = [];		//	所有的视频
	var audio = [];		//	所有的音频;
	var text = [];		//	所有的文本
	for(var i=1;i<file.length;i++) {
		switch(file[i].fileType) {
			case 0:
				fileArr.push(file[i]);
				break;
			case 1:
				text.push(file[i]);
				break;	
			case 2:
				image.push(file[i]);
				break;
			case 3:
				audio.push(file[i]);
				break;
			case 4:
				video.push(file[i]);
				break;	
		}
	}
	//	每个单独类型的按字母排序
	fileArr.sort(function(a,b) {
		if(pinyin.getFullChars(a.children[1].innerHTML) > pinyin.getFullChars(b.children[1].innerHTML)){
			return 1;
		}
		return -1;
	});
	text.sort(function(a,b){
		if(pinyin.getFullChars(a.children[1].innerHTML) > pinyin.getFullChars(b.children[1].innerHTML)){
			return 1;
		}
		return -1;
	});
	image.sort(function(a,b){
		if(pinyin.getFullChars(a.children[1].innerHTML) > pinyin.getFullChars(b.children[1].innerHTML)){
			return 1;
		}
		return -1;
	});
	audio.sort(function(a,b){
		if(pinyin.getFullChars(a.children[1].innerHTML) > pinyin.getFullChars(b.children[1].innerHTML)){
			return 1;
		}
		return -1;
	});
	video.sort(function(a,b){
		if(pinyin.getFullChars(a.children[1].innerHTML) > pinyin.getFullChars(b.children[1].innerHTML)){
			return 1;
		}
		return -1;
	});
	fileArrs = fileArrs.concat(fileArr,text,image,audio,video);
	for(var i = 0; i < fileArrs.length; i++){
		files.appendChild(fileArrs[i]);
	}
	resetOffset();
}

///////		键盘事件		///////
(function() {
	var files = document.getElementById('files');
	var fileEls = document.getElementsByClassName('file');
	document.addEventListener('keydown',function(e) {
		//	是F2就重命名
		if(e.keyCode == 113) {
			for(var i=0;i<fileEls.length;i++) {
				if(fileEls[i].classList.contains('active')){
					rename(fileEls[i])
					return;
				}
			}
		}
		//	是delete就删除
		if(e.keyCode == 46) {
			for(var i=0;i<fileEls.length;i++) {
				if(fileEls[i].classList.contains("active")){
					files.removeChild(fileEls[i]);
					i--;
				}
			}
			resetOffset();
		}
	});
	function rename(file){
		var p = file.children[1];
		var input = file.children[2];
		p.style.display = "none";
		input.style.display = "block";
		input.value = p.innerHTML;
		input.select();
	}
})();


/* 窗口改变修改文件夹位置 */
window.addEventListener('resize', resetOffset);
///////		获取文件夹名字		////////
/* resetOffset 位置重新设置*/
function resetOffset(){
	var fileEls = document.querySelectorAll('.file');
	for(var i = 0; i < fileEls.length; i++){
		var offset = getfileOffset(i);
		startMove({
			el:fileEls[i],
			target:{
				left: offset.x,
				top: offset.y
			},
			time: 500,
			type: "easeOut"
		});
	}
}
//	获取文件夹名字
function getFileName() {
	var fileNames = document.querySelectorAll('.file>p');
	var names = [];
	fileNames.forEach(function(file) {
		names.push(file.innerHTML);
	});
	names = names.filter(function(value) {
		if(
			(value == start)||
			(value.substring(0,6) == "新建文件夹("	//	前6位是新建文件夹的
			&&
			value.charAt(value.length-1) == ")"//最后一位是‘)’的
			&&
			Number(value.substring(6,value.length-1))>1	///	不能是 新建文件夹(0)和新建文件夹(1)
			&&
			parseInt(value.substring(6,value.length-1))+"" === value.substring(6,value.length-1)	//	排除小数 和 前边有0的	
			)
		) {
			return true;
		}
		return false;
	});
	names.sort(function(a,b){
		a = a.length<6?0:a.substring(6,a.length -1);
		b = b.length<6?0:b.substring(6,b.length-1);
		return a-b;
	});
	//	单独补全第一个
	if(names.length ==0||names[0] != start) {
		return start
	}
	for(var i = 1; i < names.length;i++){
		if(start + "("+(i+1)+")" !== names[i]){
			return start + "("+(i+1)+")";
		}
	}
	return start + "("+(names.length+1)+")";
}

//	判断是否重名	name: 新名字  || now: 当前是第几个文件 
function hasName(name,now) {
	var fillNames = document.querySelectorAll('.file>p');
	for(var i=0;i<fillNames.length;i++) {
		if(now != fillNames[i]&&fillNames[i].innerHTML == name) {
			return true;
		}
	}
	return false;
}
//	获取文件夹位置，参数要获取的第几个文件夹
function getfileOffset(index){
	var fileEls = document.querySelectorAll('.file');
	index = (typeof (index) != "undefined")?index:fileEls.length;
	var filesW = css(fileEls[0],"width") + 5;
	var filesH = css(fileEls[0],"height") + 20;
	var ceils = Math.floor(files.clientHeight/filesH);//一竖列可以放几个
	var x = Math.floor(index/ceils);//算出元素在第几列
	var y = index%ceils;//算出元素在第几行
	return {x: x*filesW,y: y*filesH}; 
}
})();

/////	全局取消选中	//////
function cancelActive() {
	var files = document.querySelectorAll('.file');
	for(var i = 0; i < files.length; i++){
		files[i].classList.remove("active");
	}
}
(function(){
	document.addEventListener('mousedown', function(e) {
		cancelActive();
	});
	document.addEventListener('contextmenu', function(e) {
		cancelActive();
	});
})();

///////		框选		///////
(function() {
	var subMenu = document.querySelector('#subMenu');
	var contextmenu = document.querySelector('#conTextMenu');
	//	阻止冒泡
	subMenu.addEventListener('mousedown', function(e) {
		e.stopPropagation();
	});
	contextmenu.addEventListener('mousedown', function(e) {
		e.stopPropagation();
	});
	subMenu.addEventListener('click', function(e) {
		this.style.display = "none";
	});
	contextmenu.addEventListener('click', function(e) {
		this.style.display = "none";
	});
	document.addEventListener('mousedown',function(e) {
		if(e.button==2){
			return;
		}
		var div = document.createElement("div");
		var files = document.querySelectorAll('.file');
		var startX = e.clientX;
		var startY = e.clientY;
		div.className = 'selectArea';
		div.style.left = e.clientX + "px";
		div.style.top = e.clientY + "px";
		document.body.appendChild(div);
		document.addEventListener('mousemove',move);
		document.addEventListener('mouseup',end);
		function move(e) {
			window.isMove = true;
			var nowX = e.clientX;
			var nowY = e.clientY;
			div.style.width = Math.abs(nowX - startX) + "px";
			div.style.height = Math.abs(nowY - startY) + "px";
			
			if(nowX < startX) {
				div.style.left = nowX + "px";
			} else {
				div.style.left = startX + "px";
			}
			if(nowY < startY){
				div.style.top = nowY + "px";
			} else {
				div.style.top = startY + "px";
			}
			for(var i = 1; i < files.length; i++){
				if(getCollide(div,files[i])){
					files[i].classList.add("active");
				} else {
					files[i].classList.remove("active");
				}
			}
		}
		function end(){
			document.removeEventListener('mousemove', move);
			document.removeEventListener('mouseup', end);
			document.body.removeChild(div);
			window.isMove = false;
		}
	});
})();

/////	更换壁纸	//////
var nub=0;
function changeBg() {
	var bg = document.querySelector('#bg');
	var changeBg = document.querySelector('#changeBg');
	var bgArr = ['url(img/bg/1.jpg)','url(img/bg/2.jpg)','url(img/bg/3.jpg)','url(img/bg/4.jpg)'];
	nub++;
	bg.style.backgroundImage = bgArr[nub%bgArr.length];
}

////	检测碰撞	/////
function getCollide(el,el2){
	var rect = el.getBoundingClientRect();
	var rect2 = el2.getBoundingClientRect();
	if(rect.right < rect2.left
	||rect.left > rect2.right
	||rect.bottom<rect2.top
	||rect.top>rect2.bottom){
		return false;
	}
	return true;
};