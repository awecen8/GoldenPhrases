var Python = {

  requestCrypt: function(type,ctx,key){
    $.post('/cgi-bin/requestCrypt.py',
      {
        'crypttype':type,
        'ctx':ctx,
        'key':key,
      },function(data){

      });
  },

  responseCrypt: function(json){
      $('#outputContext').val(json.result);
  },

};

var Process = {

  start: function(){

    $('#btn-request-crypt').on('click',function(){
      var type = $('#selectCryptType').children('label[class*="active"]').attr('crypt-type');
      var ctx = $('#inputContext').val();
      var key = $('#inputKey').val();

      Python.requestCrypt(type,ctx,key);

    });

    $('#inputContext').on('keyup',function(){
      $('#inputLength').text($('#inputContext').val().length);
    });


  },

};

Process.start();
