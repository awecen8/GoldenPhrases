var v = {
}
var Python = {

  requestRegist: function(u,p){
    $.post('/cgi-bin/requestRegist.py',
      {
        'user': u,
        'pass': p,
      },function(data){

      });
  },

  responseRegist: function(json){
    var result = json.result;
    if(result != 'false'){
      window.location = 'login.html';
      docCookies.getItem("auth");
    }else{
      $("#div-login-message").html('<span style="color:#F44;">ごめん。登録できんかった。多分、ユーザー名が被ってるわ。</span>');
    }
  },
};

var Login = {

  checkAuth: function(user, pass, passr){

    $('#input-login-user').parent().removeClass('has-error');
    $('#input-login-pass').parent().removeClass('has-error');
    $('#input-login-pass-re').parent().removeClass('has-error');
    $("#regist-message").html();

    var isValid = true;

    if(user == ""){
      $('#input-login-user').parent().addClass('has-error');
      $("#regist-message").html('<span style="color:#F44;">未入力があんだよ。</span>');
      isValid = false;
    }
    if(pass == ""){
      $('#input-login-pass').parent().addClass('has-error');
      $("#regist-message").html('<span style="color:#F44;">未入力があんだよ。</span>')
      isValid = false;
    }
    if(passr == ""){
      $('#input-login-pass-re').parent().addClass('has-error');
      $("#regist-message").html('<span style="color:#F44;">未入力があんだよ。</span>')
      isValid = false;
    }
    if(pass != passr){
      $('#input-login-pass').parent().addClass('has-error');
      $('#input-login-pass-re').parent().addClass('has-error');
      $("#regist-message").html('<span style="color:#F44;">確認用パスワードがちげーじゃん。</span>')
      isValid = false;
    }
    if(isValid){
      Python.requestRegist(user,pass);
    }
  }



};

var Process = {

  start: function(){

    // POST Answer
    $('#btn-regist').on('click', function(){
      var user = $('#input-login-user').val();
      var pass = $('#input-login-pass').val();
      var passr = $('#input-login-pass-re').val();
      Login.checkAuth(user,pass,passr);
    });


  },

}

Process.start();
