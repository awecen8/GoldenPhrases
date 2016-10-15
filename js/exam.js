var v = {

  auth : new Auth(),
  dbData: undefined,
};

var Question = {

  display: function(et){
    Python.requestExam(et);
  },

};

var Elements = {

  hideMenu: function(){
    $('#div-exam-items').hide();
  },

  showMenu: function(){
    $('#div-exam-items').show();
  },

  hideExam: function(){
    $('#div-exam-input-forms').hide();
    $('#btn-answer').off('click');
  },

  showExam: function(){
    $('#div-exam-input-forms').show();
    // $('#btn-answer').on('click', function(){
    //   var genre = $('#question-area').attr('genre');
    //   var qnumber = $('#question-area').attr('qnumber');
    //   var inputAnswerValue = $('#inputAnswerValue').val();
    //   Python.requestAnswer(genre, qnumber, inputAnswerValue);
    // });
  },

  hideFinish: function(){
    $('#div-exam-finish').hide();
    $('#tbody-finish-list').empty();
    $('#btn-finish-menu').off('click');
    $('#btn-finish-home').off('click');
    $('#btn-finish-retry').off('click');
  },

  showFinish: function(){
    $('#div-exam-finish').show();
    //$('#tbody-finish-list');
    $('#btn-finish-menu').on('click',function(){
      window.location = "exam.html";
    });
    $('#btn-finish-home').on('click',function(){
      window.location = "index.html";
    });
    $('#btn-finish-retry').on('click',function(){
      var a = $('a[class*="exam-selected"]');
      Question.display(a.attr('exam-type'));
      Elements.hideFinish();
      Elements.hideMenu();
      Elements.showExam();
      Elements.showAnswerButton();
      Elements.showGiveupButton();
      Elements.showBackToMenuButton();
    });
    $('#btn-finish-retry').focus();

  },

  hideAnswer: function(){
    $('#animation-area').empty();
    $('#comment-area').empty();
    $('#button-area').empty();
    $('#answer-area').hide();
  },

  showAnswer: function(json){
    var tgt = $('#answer-area');
    tgt.animate({
      'opacity':'0.0',
    },'fast','swing',function(){
      $('#answer-canvas').remove();
      if(json.result === "true"){
        Elements.displayTrue();
        $('#comment-area').html(json.comment);
      }else{
        Elements.displayFalse();
        $('#comment-area').html('<span style="font-size:large;font-weight:bold;">A: ' + json.ans + '</span><br><br>' + json.comment);
      }

      tgt.animate({
        'opacity':'1.0',
      },10,'swing',function(){

      })
    })
    if(tgt.css('display') == 'none'){
      tgt.slideDown();
    }
    $('#btn-next').focus();
  },

  displayTrue: function(){
    var canvas = $('<canvas></canvas>');
    canvas.attr({
      'id':'answer-canvas',
      'height':'80',
      'width':'80',
    });
    var ctx = canvas[0].getContext('2d');
    var sA = 0;
    var eA = Math.PI*(360/180);
    ctx.arc(40,40,30,sA,eA,true);
    ctx.strokeStyle = 'rgb(80, 192, 77)';
    ctx.lineWidth = 3.0;
    ctx.stroke();
    $('#animation-area').append(canvas);
  },

  displayFalse: function(){
    var canvas = $('<canvas></canvas>');
    canvas.attr({
      'id':'answer-canvas',
      'height':'80',
      'width':'80',
    });
    var ctx = canvas[0].getContext('2d');
    ctx.beginPath();
    ctx.moveTo(20,20)
    ctx.lineTo(60,60);
    ctx.closePath();
    ctx.moveTo(60,20)
    ctx.lineTo(20,60);
    ctx.closePath();
    ctx.strokeStyle = 'rgb(192, 80, 77)';
    ctx.lineWidth = 3.0;
    ctx.stroke();
    $('#animation-area').append(canvas);
  },

  hideNextButton:function(){
    $('#btn-next').hide();
    $('#btn-next').off('click');
  },

  showNextButton:function(){
    $('#btn-next').show();
    $('#btn-next').on('click',function(){
      $('#inputAnswerValue').val("");
      Question.display($('#question-area').attr('exam-type'));
      Elements.hideAnswer();
      Elements.hideNextButton();
      Elements.showAnswerButton();
      Elements.showGiveupButton();
    });
  },

  hideAnswerButton: function(){
    $('#btn-answer').hide();
    $('#btn-answer').off('click');
  },

  showAnswerButton: function(){
    $('#btn-answer').show();
    $('#btn-answer').on('click',function(){
      if($('#inputAnswerValue').val() !== ""
      && $('#inputAnswerValue').val() !== undefined){
        Python.requestAnswer(
          $('#question-area').attr('exam-type'),
          $('#question-area').attr('genre'),
          $('#question-area').attr('qnumber'),
          $('#inputAnswerValue').val());
        Elements.hideAnswerButton();
        Elements.hideGiveupButton();
        Elements.showNextButton();
        Elements.showBackToMenuButton();
      }
    });
  },

  hideGiveupButton: function(){
    $('#btn-give-up').hide();
    $('#btn-give-up').off('click');
  },

  showGiveupButton: function(){
    $('#btn-give-up').show();
    $('#btn-give-up').on('click',function(){
      Question.display($('#question-area').attr('exam-type'));
    });
  },

  hideBackToMenuButton: function(){
    $('#btn-back-to-menu').hide();
    $('#btn-back-to-menu').off('click');
  },

  showBackToMenuButton: function(){
    $('#btn-back-to-menu').show();
    $('#btn-back-to-menu').on('click',function(){
      window.location = "exam.html";
    });
  },

};

var Event = {

  finishExam: function(e,g,q){

    var examtype = e;
    var genre = g;
    var qnum = q;

    Elements.hideMenu();

    Elements.hideExam();
    Elements.hideAnswerButton();
    Elements.hideNextButton();
    Elements.hideGiveupButton();
    Elements.hideBackToMenuButton();

    Elements.showFinish();

    Python.requestExamFinish(examtype,genre,qnum);

    Python.requestReflectExamResult(examtype,genre,qnum);

  },

};

var Python = {

  requestExam: function(et){
    $.post('/cgi-bin/requestExam.py',
      {
        'examtype':et,
        'user': docCookies.getItem("auth"),
      },function(data){

      });
  },

  responseExam: function(json){
    $('#inputAnswerValue').focus();
    var response = json.result;
    $("#span-true-count").text('TRUE : ' + json.tcnt);
    $("#span-false-count").text('FALSE : ' + json.fcnt);
    $("#span-rest-count").text('REST : ' + json.rem);
    if(response == 'true'){
      $('#questionNumber').text('Q' + json.qnum);
      $('#question-context').html('<div>' + json.ctx + '</div><div style="font-size:large;margin-top:10px;">' + json.qst + '</div>');
      $('#question-area').attr({
        'genre':json.genre,
        'qnumber':json.qnum,
        'exam-type':json.examtype,
      });
      $('.btn-next-question').off('click');
      AnswerArea.prototype.generateNextButton(json.genre,json.qnumr);
      $('.btn-next-question').on('click',function(){
        var qnumber = parseInt(json.qnum) + 1;
        Question.display(1,qnumber);
        $('#answer-area').slideultUp('fast');
        $('#btn-next-question').remove();
        $('#inputAnswerValue').val("");
      });

    }else if(response == 'finish'){

      var examtype = json.examtype;
      var genre = json.genre;
      var qnum = json.qnum;

      Event.finishExam(examtype,genre,qnum);

    }else{
      $('#question-context').html('<span style="color:F44;">ERROR:Rx00000001</span>');
      $('#question-area').attr({
        'genre':0,
        'qnumber':0,
      });
    }
  },

  //Post Input Answer To Python
  requestAnswer:function(t, g, q, v){
    $.post('/cgi-bin/requestAnswerExam.py',
      {
        'examtype': t,
        'genre':g,
        'qNumber': q,
        'inputAnswerValue': v,
        'user':docCookies.getItem("auth"),
      },function(data){

      });
  },

  //Callback Answer
  responseAnswer: function(json){
    Elements.showAnswer(json);
    //alert(result + '\n' + comment);
  },

  requestExamFinish: function(t,g,q){
    $.post('/cgi-bin/requestExamFinish.py',
      {
        'examtype':t,
        'genre':g,
        'user':docCookies.getItem("auth"),
      },function(data){

      });
  },

  responseExamFinish: function(json){
    v.finishList = json.response[0];
    for(var i = 0; i < v.finishList.length; i++){
      var f = v.finishList[i]
      var tr = $('<tr></tr>');
      tr.append('<td>' + f.qnum + '</td>');
      tr.append('<td>' + f.qjp + '</td>');
      tr.append('<td>' + f.ans + '</td>');
      if(f.usr === "1"){
        tr.append('<td style="color:green;"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>');
      }else if(f.usr === "2"){
        tr.append('<td style="color:red;"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>');
      }else{
        tr.append('<td>-</td>');
      }
      $('#tbody-finish-list').append(tr);
    };
  },

  requestReflectExamResult: function(t,g,q){
    $.post('/cgi-bin/requestReflectExamResult.py',
      {
        'examtype':t,
        'genre':g,
        'user':docCookies.getItem("auth"),
      },function(data){

      });
  },

  responseReflectExamResult: function(json){

    if(json.result === true){
      var resp = json.response;
      var resultRows = $('#tbody-finish-list').children('tr');
      for(var i = 0; i < resultRows.length; i++){
        resultRows.eq(i).append('<td>' + resp[i] + '</td>');
      }
    }

  },


};

var Process = {

  start: function(){

    Elements.hideExam();
    Elements.hideAnswerButton();
    Elements.hideNextButton();
    Elements.hideGiveupButton();
    Elements.hideBackToMenuButton();

    Elements.hideFinish();

    Elements.showMenu();

    $('.list-group-item').css('cursor','pointer').on('click',function(){
      var a = $(this);
      a.addClass("exam-selected");
      Question.display(a.attr('exam-type'));
      Elements.hideMenu();
      Elements.showExam();
      Elements.showAnswerButton();
      Elements.showGiveupButton();
      Elements.showBackToMenuButton();
    });

    $('#inputAnswerValue').focus();

    $("body").keypress( function(e){
      if(e.which === 13 && $('#inputAnswerValue').is(':focus')){
        $('#btn-answer').click();
      }
    });

    $('#a-log-out').on('click',function(){
      v.auth.logout();
    });

  },

}

Process.start();
