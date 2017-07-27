
//	生成石英钟
(function() {
	function keFu() {
		var kedu = document.querySelector('.roundKedu');
		var inner = '';
		for(var i =0;i<60;i++) {
			inner += '<span style="transform:rotate('+ i*6 +'deg)"></span>'		// 分针指向的每根相差6度
		}
		kedu.innerHTML = inner;
	}
	keFu();
	var h = document.querySelector('.roundHours');
	var m = document.querySelector('.roundMinutes');
	var s = document.querySelector('.roundSeconds');
	var icon = document.querySelector('.roundIcons');
	timeNow();
	setInterval(timeNow,100);
	function timeNow() {
		var date = new Date();
		var seconds = date.getSeconds();
		var minutes = date.getMinutes()+seconds/60;			
		var hours = date.getHours()+minutes/60;				
		h.style.transform = "rotate("+ hours*30 +"deg)";	//时针每小时转30度
		m.style.transform = "rotate("+ minutes*6 +"deg)";	//分针每分钟转6度
		s.style.transform = "rotate("+ seconds*6 +"deg)";	//秒针每秒钟转6度
		icon.style.transform = "rotate("+ minutes*6 +"deg)";
	}	// 91行 秒针不停走,分针也在一点点动  //92行 分针不停走,时针也在一点点动,也可(+seconds/3600)
})();

//	生成日历
(function() {
	var table = document.querySelectorAll('table');
	var tbody = document.querySelector('tbody');
	var yearSelect = document.querySelector('#yearSelect');
    var monthSelect = document.querySelector('#monthSelect');
    var strong = document.querySelector('#showM');
	var nowDate = new Date();
	var monthLen;
	var day2Week;
	
	calendar(nowDate.getFullYear(),nowDate.getMonth());
	var body1=''
	for(var i=1970;i<2100;i++) {
		if(i == nowDate.getFullYear()) {
			body1 = '<option selected>'+i+'</option>'+ body1;
		} else {
			body1 = '<option>'+i+'</option>'+ body1;
		}
	}
	var body2 = '';
    for (var i=0; i<12; i++) {
        if (i == nowDate.getMonth()) {
            body2 += '<option value="'+i+'" selected>'+ (i+1) +'</option>';
        } else {
            body2 += '<option value="'+i+'">'+ (i+1) +'</option>';
        }
    }
	yearSelect.innerHTML = body1;
    monthSelect.innerHTML = body2;
    
     //	改变input值日历对应改变
    yearSelect.onchange = monthSelect.onchange = function() {
    	calendar(yearSelect.value,monthSelect.value);
    }
    function calendar(year, month) {
	//	strong的值等于我们选择的input值
		year = Number(year);
        month = Number(month);
        day = Number(nowDate.getDate());
		strong.innerHTML = year + '年' + month + '月' +	day + '日';
		
	 	var body = '<tr>';
 	  	for (var i=1; i<=42; i++) {
 	  		// 每7列换一行
 	  		if (i%7 == 1) {
                body += '</tr><tr>';
            }
 	  		//	让每一个月第一天显示在正确的星期上
 	  		var v = i- changeDay2Week(year, month);
   	  		//	console.log(v)
			//	大于当月长度的和小于第一天的不显示
 	  		if(v < 1 || v>getMonthLen(year, month)) {
 	  			body +='<td>&nbsp;</td>'
 	  		} else {
 	  		//	每个周末都显示红色
 	  			if(i %7 == 0 || i%7 == 1) {
 	  			 	body += '<td style="color:red">'+ v +'</td>';
 	  		//	 	console.log(v)
 	  			} else if(
 	  		//	当前天显示不同色，注意严格至年月日完全相同
 	  				year == nowDate.getFullYear()
 	  				&&
 	  				month == nowDate.getMonth()
 	  				&&
 	  				v == nowDate.getDate()
 	  			) {
 	  				 body += '<td style="background: rgba(0,0,0,.6); color:white;">'+ v +'</td>';
 	  			}	else {
	           			body += '<td>'+ v +'</td>';
	        		}
 	  		} 
 	  	}
 	  	body += '</tr>';
        tbody.innerHTML = body;
	 }
    
	//	获取某年某月有多少天
	function getMonthLen(year,month) {
		monthLen = new Date(year,month+1,1,-1,0,0).getDate(); 
		return monthLen;
	}
	// 获取某年某月的第一天是周几
	function changeDay2Week(year,month) {
		day2Week = new Date(year, month, 1).getDay();
		return day2Week;
	}
})();

(function() {
	var clock = document.querySelector('.roundClock');
	var calendar = document.querySelector('#calendar');
	clock.addEventListener('contextmenu',function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
	calendar.addEventListener('contextmenu',function(e) {
		e.preventDefault();
		e.stopPropagation();
	})
	clock.addEventListener('mouseover',function(e) {
		clock.style.transform = 'scale(.8)';
		clock.style.opacity = '1';
		startMove({
			el:calendar,
			target: {
				bottom:0
			},
			time:500,
			type:'easeOut'
		})
	});
	clock.addEventListener('mouseout',function(e) {
		e.stopPropagation();
		clock.style.transform = 'scale(.7)';
		clock.style.opacity = '0.3';
		startMove({
			el:calendar,
			target: {
				bottom:-300
			},
			time:500,
			type:'easeOut'
		})
	});
})();
