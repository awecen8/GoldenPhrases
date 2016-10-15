
// 共通ユーティリティ
var CommonUtil = function(){

  /******* 日時操作 *******/
  //月の初日Dateを取得
  this.getFirstDateOfMonth = function(date){
    var resultDate = date;
	var tgtMonth = date.getMonth();
	while(resultDate.getMonth() == tgtMonth){
	  resultDate = new Date(resultDate.getFullYear(),
	                        resultDate.getMonth(),
                            resultDate.getDate() - 1);
	 }
	 return new Date(resultDate.getFullYear(),
	                 resultDate.getMonth(),
	                 resultDate.getDate() + 1);
  };

  //月の最終日Dateを取得
  this.getLastDateOfMonth = function(date){
    var resultDate = date;
	var tgtMonth = date.getMonth();
	while(resultDate.getMonth() == tgtMonth){
	  resultDate = new Date(resultDate.getFullYear(),
	                        resultDate.getMonth(),
	                        resultDate.getDate() + 1);
	}
    return new Date(resultDate.getFullYear(),
	                resultDate.getMonth(),
	                resultDate.getDate() - 1);
  };
  
  //年の初日Dateを取得
  this.getFirstDateOfYear = function(date){
	var resultDate = date;
	var tgtYear = date.getFullYear();
	while(resultDate.getFullYear() == tgtYear){
	  resultDate = new Date(resultDate.getFullYear(),
	                        resultDate.getMonth(),
	                        resultDate.getDate() - 1);
	  }
	return new Date(resultDate.getFullYear(),
	                resultDate.getMonth(),
	                resultDate.getDate() + 1);
  };

  //年の最終日Dateを取得
  this.getLastDateOfYear = function(date){
    var resultDate = date;
    var tgtYear = date.getFullYear();
    while(resultDate.getFullYear() == tgtYear){
      resultDate = new Date(resultDate.getFullYear(),
                            resultDate.getMonth(),
                            resultDate.getDate() + 1);
    }
    return new Date(resultDate.getFullYear(),
                    resultDate.getMonth(),
                    resultDate.getDate() - 1);
    
  };
  
  //Date型をYYYY-MM-DDに変換
  this.convertDateToString = function(date){
    var year =  date.getFullYear();
    var month = date.getMonth() + 1;
    if(month < 10){
      month = '0' + month;
    }
    var date = date.getDate();
    if(date < 10){
      date = '0' + date;
	    }
    return year + '-' + month + '-' + date;
  };
  
  //YYYY-MM-DDをDate型に変換
  this.convertStringToDate = function(date){
    if(date == undefined){
      date = '0001-01-01';
    }
    var y = date.substring(0,4);
    var m = date.substring(5,7);
    var d = date.substring(8,10);
    
    return new Date(y, m - 1, d);
  };

  // Date型をString(YYYY-MM-DD HH:MM:SS)に変換
  this.convertDateToDetailString = function(date){
    var year =  date.getFullYear();
	var month = date.getMonth() + 1;
	if(month < 10){
	  month = '0' + month.toString();
	}
	var day = date.getDate();
	if(day < 10){
	  day = '0' + day.toString();
	}
    var hours = date.getHours();
    if(hours < 10){
  	  hours = '0' + hours.toString();
  	}
    var minutes = date.getMinutes();
    if(minutes < 10){
  	  minutes = '0' + minutes.toString();
  	}
    var seconds = date.getSeconds();
    if(seconds < 10){
  	  seconds = '0' + seconds.toString();
  	}	
 	return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  
  }
    
  //日付比較
  this.whichDateLatest = function(dA, dB){
    var mean = dA.getTime() - dB.getTime();
	if(mean > 0){
		return dA;
	}
	if(mean < 0){
		return dB;
	}
	return undefined;
  };
	
  // 基準日の属する集計期間[開始日,終了日]を取得
  this.getCollectSpan = function(basedate){
	var start = new Date(basedate.getFullYear(),
			basedate.getMonth(),
			basedate.getDate(),
			basedate.getHours(),
			basedate.getMinutes(),
			basedate.getSeconds());
	// 木曜日(4)～
	while(start.getDay() != 4){
      start.setDate(start.getDate()-1);
	}
	var end = new Date(basedate.getFullYear(),
			basedate.getMonth(),
			basedate.getDate(),
			basedate.getHours(),
			basedate.getMinutes(),
			basedate.getSeconds());
	// ～水曜日(3)
	while(end.getDay() != 3){
	  end.setDate(end.getDate()+1);
	}
	return [start, end];  
  };
 
  /******* 画面操作 *******/
  
  //スクロール位置 最下部へ
  this.scrollToBottom = function(){
    var wy = window.scrollY;
    var bodyHeight = $('body')[0]['clientHeight'];
    var y = bodyHeight - window.innerHeight
    window.scroll(0,y);
  };
  
  //スクロール位置 最上部へ
  this.scrollToTop = function(){
    window.scroll(0,0);
  };
  
  //先頭0パディング
  this.padZeroHead = function(val, totalLength){
    for(var i = val.toString().length; i < totalLength; i++){
      val = '0' + val.toString();
    }
    return val;  
  };

  /******** DB ACCESS ********/
  // テーブルから情報取得
  this.getDbData = function(table, columns, joinItems, whereItems, orderItems){
    
	var sql = 'SELECT ';
	
	// 選択列
	if(columns === undefined ||
        (Array.isArray(columns) && columns.length === 0) ||
        (!Array.isArray(columns) && columns.trim() === '')){
	  return;
	}
	if(Array.isArray(columns)){
      sql += columns.join(',');
    }else{
	  sql += columns;
	}
	sql += ' ';
	 
	// 選択テーブル
	if(table === undefined ||
        table.trim() === ''){
	  return;
	}
	sql += 'FROM ' + table + ' ';
	
    // 結合テーブル
	// table: 結合テーブル 
	// whereItems: 結合条件以下複数 
    //// u1: 結合[AND, OR]
    //// t1: 結合条件1テーブル
	//// c1: 結合条件1カラム
	//// t2: 結合条件2テーブル
	//// c2: 結合条件2カラム
	if(joinItems.length > 0){
	  joinItems.forEach(function(item){
        item.whereItems.forEach(function(where, index){
		  if(index > 0){
            sql +=  where.u[0] + ' ' + where.t[0] + '.' + where.c[0] +
		           ' = ' + where.t[1] + '.' + where.c[1] + ' ';
		  }else{
            sql += 'JOIN ' + item.table +
	               ' ON ' + where.t[0] + '.' + where.c[0] +
	               ' = ' + where.t[1] + '.' + where.c[1] + ' ';
		  }
		});
	  });
	}
	
	// 検索条件
	// u[] : 結合[AND,OR]
	// t[] : 対象テーブル
	// c[] : 対象カラム
	// o[] : オペランド[=,<=,>=,<,>,BETWEEN, LIKE]
	// d[] : [obj, prim]
	// v[] : 値
	if(whereItems.length > 0){
      whereItems.forEach(function(item,index){
        if(index > 0){
          sql += item.u[0] + ' ' + item.t[0] + '.' + item.c[0] + ' ';
        }else{
          sql += 'WHERE ' + item.t[0] + '.' + item.c[0] + ' '; 	
        } 
        if(item.o[0] === 'BETWEEN'){
          sql += item.o[0] + ' ' + item.v[0] + ' AND ' + item.v[1] + ' ';
        }else if(item.o[0] === 'IN'){
          sql += ' IN(' + item.v.join(',') + ') ';
        }else{
          sql += item.o[0] + ' ' + item.v[0] + ' ';	
        }      
      });
	}
	
	// ソート条件
	// t[] = 対象テーブル
	// c[] = 対象カラム
	// o[] = 順序[ASC, DESC]
	if(orderItems.length > 0){
	  orderItems.forEach(function(item, index){
        if(index > 0){
          sql += ', ' + item.t[0] + '.' + item.c[0] + ' ' + item.o[0] + ' ';
        }else{
          sql += 'ORDER BY ' + item.t[0] + '.' + item.c[0] + ' ' + item.o[0] + ' ';
        }      
	  });
	}
	
	console.log(sql);
	return alasql(sql);
	
  };  
  
  // テーブルにレコード挿入
  this.insertDb = function(table, values){
    var sql = 'INSERT INTO ';
    
    if(table === undefined ||
      table.trim() === '' ||
       values.length === 0){
      return;
    }
	
    sql += table + ' VALUES (';
    for(var i = 0; i < values.length - 1; i++){
      sql += '?,';
    }
    sql += '?) '
    
    alasql(sql, values);
  }
  
  // テーブル結合条件用配列生成
  // u[]: 結合[AND, OR]
  // t[]: 対象テーブル配列
  // c[]: 対象カラム配列
  this.generateJoinItem = function(u, t, c){
    return {u: u, t: t, c: c};
  };
  // テーブル検索条件用配列生成
  // u[]: 結合[AND, OR]
  // t[]: 対象テーブル配列
  // c[]: 対象カラム配列
  // o[]: オペランド[=,<=,>=,<,>,BETWEEN,LIKE]
  // v[]: 値配列
  this.generateWhereItem = function(u,t,c,o,v){
	    return {u: u, t: t, c: c, o: o, v: v};
  };

  // ******** ELEMENT ********
  
  this.createElement = function(tagName){
	return $('<' + tagName + '></' + tagName + '>');  
  };  

  // ******** WAIT **********
  
  // 画面暗転
  this.redraw = function(beforeFunc, innerFunc, afterFunc){
	$('#overlay').remove();
	$('body').append('<div id="overlay"></div>')
	  
	var windowInWidth = window.innerWidth;
	var windowInHeight = window.innerHeight;
	var bodyWidth = $('body').css('width');
	bodyWidth = parseInt(bodyWidth.substring(0, bodyWidth.length - 2),10);
	var bodyHeight = $('body').css('height');
	bodyHeight = parseInt(bodyHeight.substring(0, bodyHeight.length - 2),10);
	var w, h = '';
	if(windowInWidth > bodyWidth){
	  w = windowInWidth + 'px';
	}else{
	  w = bodyWidth + 'px';
	}
	if(windowInHeight > bodyHeight){
	  h = windowInHeight + 'px';
	}else{
	  h = bodyHeight + 'px';
	}
	
	
	if(beforeFunc !== ''){
	  beforeFunc.call(this);
	}
	
	$('#overlay').css({
	  'width': w,
	  'height': h,
	  'display':'initial',
	}).animate({
	  'opacity': '0.5',
	},'fast');
	window.setTimeout(function(){
     
	  if(innerFunc !== ''){
	    innerFunc.call(this);
	  }
      $('#overlay').animate({
	    'opacity':'0.0',
	  },'fast','',function(){
        $('#overlay').css({
    	    'display':'none',
    	});
	  });
	},250);
	
	if(afterFunc !== ''){
      afterFunc.call(this);
	}
  };
  
  //********* MESSAGE ************
  // メッセージひらく
  this.showMessage = function(type, msg, element){
    $('#alert-message').remove();
    
    var msgClass = 'alert ';
    var iconClass = 'user';
    switch(type){
      case'success':
    	msgClass += 'alert-success';
    	iconClass = 'ok-circle';
    	break;
      case'info':
      	msgClass += 'alert-info';
      	iconClass = 'info-sign';
      	break;
      case'warning':
    	msgClass += 'alert-warning';
      	iconClass = 'warning-sign';
    	break;
      case'danger':
    	msgClass += 'alert-danger';
      	iconClass = 'remove-sign';
    	break;
    }
    
    var baseDiv = $('<div></div>');
    baseDiv.addClass(msgClass)
           .attr('id', 'alert-message')
           .css('opacity','0.0')
           .insertAfter(element);
    
    var iconDiv = $('<div></div>');
    iconDiv.css({
    	     'display':'inline-block',
    	     'font-size':'30px',
    	     'float':'left',
    	   })
           .append('<span class="glyphicon glyphicon-' + iconClass + '" aria-hidden="true"></span>')
           .appendTo(baseDiv);
     
    var msgDiv = $('<div></div>');
    if(msg.indexOf('<br>') === -1){
      msgDiv.css('padding','10px');
    }
    msgDiv.css({
	        'display':'inline-block',
	        'margin-left': '20px',
	        'min-height':'30px',
          })
          .append(msg)
          .appendTo(baseDiv);
    var closeBtn = $('<button></button>');
    closeBtn.addClass('close')
            .attr({
              'type':'button',
              'data-dismiss':'alert'
            })
            .append('<span aria-hidden="true">&times;</span>')
            .appendTo(baseDiv);
    
    baseDiv.animate({
      'opacity':'1.0',
    });
    
    
  };

  // メッセージとじる(消す)
  this.hideMessage = function(time){
    $('#alert-message').hide(time,function(){
    	$('#alert-message').remove();
    });
  };
  
};


/*
 * @build  : 20-07-2013
 * @author : Ram swaroop
 * @site   : Compzets.com
 */
(function($){
    
    $.fn.animatescroll = function(options) {
        
        // fetches options
        var opts = $.extend({},$.fn.animatescroll.defaults,options);

        // make sure the callback is a function
        if (typeof opts.onScrollStart == 'function') {
            // brings the scope to the callback
            opts.onScrollStart.call(this);
        }

        if(opts.element == "html,body") {
            // Get the distance of particular id or class from top
            var offset = this.offset().top;
        
            // Scroll the page to the desired position
            $(opts.element).stop().animate({ scrollTop: offset - opts.padding}, opts.scrollSpeed, opts.easing);
        }
        else {
            // Scroll the element to the desired position
            $(opts.element).stop().animate({ scrollTop: this.offset().top - this.parent().offset().top + this.parent().scrollTop() - opts.padding}, opts.scrollSpeed, opts.easing);
        }

        setTimeout(function() {

            // make sure the callback is a function
            if (typeof opts.onScrollEnd == 'function') {
                // brings the scope to the callback
                opts.onScrollEnd.call(this);
            }
        }, opts.scrollSpeed);
        
    };
    
    // default options
    $.fn.animatescroll.defaults = {        
        easing:"swing",
        scrollSpeed:800,
        padding:0,
        element:"html,body"
    };   
    
}(jQuery));