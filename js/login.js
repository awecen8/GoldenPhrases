var v = {
}
var Python = {

  requestLogin: function(u,p){
    $.post('/cgi-bin/checkUserAuth.py',
      {
        'user': u,
        'pass': p,
      },function(data){

      });
  },

  responseLogin: function(json){
    var isAuth = json.result;
    if(isAuth != 'false'){
      window.location = 'index.html';
      docCookies.getItem("auth");
    }else{
      $("#login-message").html('<br><span style="color:#F44;">ちゃんとパスワード入れてよ。多分おかしいよ、君が。</span>');
    }
  },
};

var Login = {

  checkAuth: function(user, pass){

    $('#input-login-user').parent().removeClass('has-error');
    $('#input-login-pass').parent().removeClass('has-error');
    $("#login-message").html();

    var isValid = true;

    if(user == ""){
      $('#input-login-user').parent().addClass('has-error');
      $("#login-message").html('<br><span style="color:#F44;">未入力があんだよ。</span>');
      isValid = false;
    }
    if(pass == ""){
      $('#input-login-pass').parent().addClass('has-error');
      $("#login-message").html('<br><span style="color:#F44;">未入力があんだよ。</span>')
      isValid = false;
    }
    if(isValid){
      Python.requestLogin(user,pass);
    }
  }



};

var Process = {

  start: function(){

    // POST Answer
    $('#btn-login').on('click', function(){
      var user = $('#input-login-user').val();
      var pass = $('#input-login-pass').val();
      Login.checkAuth(user,pass);
    });


  },

}

Process.start();
