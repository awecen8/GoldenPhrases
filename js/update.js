var v = {

  auth : new Auth(),
  dbData: undefined,
};

var Python = {

  requestUserInfo: function(){
    $.post('/cgi-bin/requestUserInfo.py',
      {
        'user': a = docCookies.getItem("auth"),
      },function(data){

      });
  },

  responseUserInfo: function(json){
    if(json.permission != 'A'){
        $('#container').empty();
    }
  },

  requestDbData: function(){
    $.post('/cgi-bin/getData.py');
  },

  responseDbData: function(json){
    v.dbData = json;
    DataList.refresh();
  },

  requestUpdate: function(inputs){
    $.post('/cgi-bin/updateData.py',
      { "num":inputs.length,
        "inputs":inputs,
      },function(data){

      });
  },

  responseUpdate: function(){
    alert('UPDATED')
  },

};

var DataList = {

  refresh:function(){

    $('#datalist-detail-body-l1').empty();
    $('#datalist-detail-body-l2').empty();
    $('#datalist-detail-body-l3').empty();
    $('#datalist-detail-body-l4').empty();
    $('#datalist-detail-body-l5').empty();
    for(var i = 0; i < v.dbData.result.length; i++){
      var d = v.dbData.result[i];
      d.modified = false;
      var tgtbody = $('#datalist-detail-body-l' + d.genre);
      var tr = $('<tr data-index="' + i + '"></tr>');
      var qnum = $('<th class="datalist-detail-qnum">1</th>');
      var td = $('<th class="datalist-detail-qnum">' + d.qnum + '</th>');
      td.appendTo(tr);
      var td = $('<td></td>');
      td.append('<input class="form-control datalist-detail-qjp" type="text" value="' + d.qjp + '">')
      .appendTo(tr);
      var td = $('<td></td>');
      td.append('<input class="form-control datalist-detail-qst" type="text" value="' + d.qst + '">')
      .appendTo(tr);
      var td = $('<td></td>');
      td.append('<input class="form-control datalist-detail-ans" type="text" value="' + d.ans + '">')
      .appendTo(tr);
      var td = $('<td></td>');
      td.append('<textarea class="form-control datalist-detail-com" rows="3">' + d.com + '</textarea>')
      .appendTo(tr);
      tr.appendTo(tgtbody);
    }

    Event.attatch();

  },

  update:function(){
    var inputs = [];
    for(var i = 0; i < v.dbData.result.length; i++){
      var d = v.dbData.result[i];
      if(d.modified){
        var reg = new RegExp('\'', "g" ) ;
        rpqjp = d.qjp.replace(reg,'\\\'');
        rpqst = d.qst.replace(reg,'\\\'');
        rpans = d.ans.replace(reg,'\\\'');
        rpcom = d.com.replace(reg,'\\\'');

        inputs.push({
          'genre': d.genre,
          'qnum': d.qnum,
          'qjp': rpqjp,
          'qst': rpqst,
          'ans': rpans,
          'com': rpcom,
        });
      }
    }
    Python.requestUpdate(inputs);
  },

};

var Event = {

  attatch: function(){

    $('#btnUpdate').on('click',function(){
      DataList.update();
    });

    $('.datalist-detail-qjp').on('change',function(){
      var inp = $(this);
      var td = inp.parent();
      var ind = td.parent().attr('data-index');
      v.dbData.result[ind].qjp = inp.val();
      v.dbData.result[ind].modified = true;
    });

    $('.datalist-detail-qst').on('change',function(){
      var inp = $(this);
      var td = inp.parent();
      var ind = td.parent().attr('data-index');
      v.dbData.result[ind].qst = inp.val();
      v.dbData.result[ind].modified = true;
    });

    $('.datalist-detail-ans').on('change',function(){
      var inp = $(this);
      var td = inp.parent();
      var ind = td.parent().attr('data-index');
      v.dbData.result[ind].ans = inp.val();
      v.dbData.result[ind].modified = true;
    });

    $('.datalist-detail-com').on('change',function(){
      var inp = $(this);
      var td = inp.parent();
      var ind = td.parent().attr('data-index');
      v.dbData.result[ind].com = inp.val();
      v.dbData.result[ind].modified = true;
    });

  },

}

var Process = {

  start: function(){

    Python.requestUserInfo();

    Python.requestDbData();

    $('#a-log-out').on('click',function(){
      v.auth.logout();
    });

  },

}

Process.start();
