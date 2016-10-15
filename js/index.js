var v = {

  auth : new Auth(),
  dbData: undefined,

};

var Init = {

  setUserInfo: function(){
    Python.requestUserInfo();

  },

  setUserStats: function(){

  },

};

var Python = {

  requestUserInfo: function(g,q){
    $.post('/cgi-bin/requestUserInfo.py',
      {
        'user': docCookies.getItem("auth"),
      },function(data){

      });
  },

  responseUserInfo: function(json){
    var tr = $('<tr></tr>');
    tr.append('<th>識別ID</th>')
      .append('<td>'+json.id+'</td>')
    tr.appendTo($('#tbody-user-info'));


    var tr = $('<tr></tr>');
    tr.append('<th>ユーザー名</th>')
      .append('<td>'+json.name+'</td>')
    tr.appendTo($('#tbody-user-info'));


    // var tr = $('<tr></tr>');
    // tr.append('<th>パスワード</th>')
    //   .append('<td>'+json.pass+'</td>')
    // tr.appendTo($('#tbody-user-info'));

    $('#nav-user-name').html(json.name);

  },

  requestUserStats: function(level){
    $.post('/cgi-bin/requestUserStats.py',
      {
        'user': docCookies.getItem("auth"),
        'level':level,

      },function(data){

      });
  },

  responseUserStats: function(json){
    $('#tbody-user-stats').empty();
    if(json.result == true){
      v.UserStats = json.response[0];
      for(var i = 0; i < v.UserStats.length; i++){
        var us = v.UserStats[i];

        var tdProg = $('<td></td>')
        var divProg = $('<div class="progress"></div>')
        divProg.appendTo(tdProg);
        var progClass = "";
        var progCaption = "";
        var progStyle="width: " + (parseInt(us.usr) * 20) + "%;";
        switch(parseInt(us.usr)){
          case 0:
            progCaption = "None";
            progClass="progress-bar progress-bar-danger";
            break;
          case 1:
            progCaption = "1 / 5";
            progClass="progress-bar progress-bar-danger";
            break;
          case 2:
            progCaption = "2 / 5";
            progClass="progress-bar progress-bar-danger";
            break;
          case 3:
            progCaption = "3 / 5";
            progClass="progress-bar progress-bar-warning";
            break;
          case 4:
            progCaption = "4 / 5";
            progClass="progress-bar progress-bar-success";
            break;
          case 5:
            progCaption = " Perfect ";
            progClass="progress-bar progress-bar-info";
            break;
        }
        var divProgBar = $('<div></div>');
        divProgBar.addClass(progClass)
                  .attr('style',progStyle)
                  .attr('role','progressbar')
                  .append(progCaption)
                  .appendTo(divProg);

        var tr = $('<tr></tr>');
        tr.css({
          'padding': '3px',
        })
        tr.append('<td>'+us.qnum+'</td>')
        tr.append('<td>'+us.ans+'</td>')
        tr.append(tdProg)
        $('#tbody-user-stats').append(tr);
      }
    }else{
      var tr = $('<tr></tr>');
      tr.append('<td colspan="3"> NO DATA</td>')
      $('#tbody-user-stats').append(tr);
    }
  },

};

var Process = {

  start: function(){
    Init.setUserInfo();
    Init.setUserStats();

    $('#a-log-out').on('click',function(){
      v.auth.logout();
    });

    $('.stats-items').on('click',function(){
      Python.requestUserStats($(this).attr('level'));
    });

  },

}

Process.start();
