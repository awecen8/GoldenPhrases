var v = {

  auth : new Auth(),
  dbData: undefined,

};

var Init = {

  setTextbookInfo: function(lev){
    var qnum = parseInt($('#page-num-lev'+lev).val());
    var tgtIndex = 0;
    for(var i = 0; i < v.dbData.result.length; i++){
      var d = v.dbData.result[i];
      if(parseInt(d.genre) == lev && parseInt(d.qnum) == qnum){
        tgtIndex = i;
      }
    }

    $('#tbody-lev'+lev).empty();
    var tr = $('<tr></tr>');
    tr.append('<th style="width:15%;">フレーズ</th>');
    tr.append('<td>' + v.dbData.result[tgtIndex].qst + '</td>');
    tr.appendTo($('#tbody-lev'+lev));
    var tr = $('<tr></tr>');
    tr.append('<th style="width:15%;">意味</th>');
    tr.append('<td>' + v.dbData.result[tgtIndex].qjp + '</td>');
    tr.appendTo($('#tbody-lev'+lev));
    var tr = $('<tr></tr>');
    tr.append('<th style="width:15%;">単語</th>');
    tr.append('<td>' + v.dbData.result[tgtIndex].ans + '</td>');
    tr.appendTo($('#tbody-lev'+lev));
    var tr = $('<tr></tr>');
    tr.append('<th style="width:15%;">解説</th>');
    tr.append('<td>' + v.dbData.result[tgtIndex].com + '</td>');
    tr.appendTo($('#tbody-lev'+lev));

  },

};

var Python = {

    requestDbData: function(){
      $.post('/cgi-bin/getData.py');
    },

    responseDbData: function(json){
      v.dbData = json;
      Init.setTextbookInfo(1);
      Init.setTextbookInfo(2);
      Init.setTextbookInfo(3);
      Init.setTextbookInfo(4);
      Init.setTextbookInfo(5);

    },
};

var Event = {

  searchTargetIndex: function(genre, qnum){

  },

  refreshButtons: function(lev){

    $('#page-slider-lev'+lev).on('change',function(){
      $('#page-num-lev'+lev).val($('#page-slider-lev'+lev).val());
      $('#qnum-lev'+lev).text($('#page-slider-lev'+lev).val());
      Init.setTextbookInfo(lev);
    });
    $('#page-num-lev'+lev).on('change',function(){
      var selectNum = $('#page-num-lev'+lev).val();
      if(selectNum > parseInt($('#page-slider-lev'+lev).attr('max'))){
        selectNum = parseInt($('#page-slider-lev'+lev).attr('max'));
      }
      if(selectNum < parseInt($('#page-slider-lev'+lev).attr('min'))){
        selectNum = parseInt($('#page-slider-lev'+lev).attr('min'));
      }

      $('#page-num-lev'+lev).val(selectNum);
      $('#page-slider-lev'+lev).val(selectNum);
      $('#qnum-lev'+lev).text(selectNum);
      Init.setTextbookInfo(lev);
    })

    $('#page-prev-lev'+lev).on('click',function(){
      var pagenum = parseInt($('#page-slider-lev'+lev).val());
      if(pagenum > parseInt($('#page-slider-lev'+lev).attr('min'))){
        pagenum -= 1;
      }
      $('#page-slider-lev'+lev).val(pagenum);
      $('#page-num-lev'+lev).val(pagenum);
      $('#qnum-lev'+lev).text(pagenum);
      Init.setTextbookInfo(lev);
    });

    $('#page-next-lev'+lev).on('click',function(){
      var pagenum = parseInt($('#page-slider-lev'+lev).val());
      if(pagenum < parseInt($('#page-slider-lev'+lev).attr('max'))){
        pagenum += 1;
      }
      $('#page-slider-lev'+lev).val(pagenum);
      $('#page-num-lev'+lev).val(pagenum);
      $('#qnum-lev'+lev).text(pagenum);
      Init.setTextbookInfo(lev);
    });
  }

}

var Process = {

  start: function(){

    $('#a-log-out').on('click',function(){
      v.auth.logout();
    });

    Python.requestDbData();

    Event.refreshButtons(1);
    Event.refreshButtons(2);
    Event.refreshButtons(3);
    Event.refreshButtons(4);
    Event.refreshButtons(5);
  },

}

Process.start();
