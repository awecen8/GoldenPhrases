var Auth = function(){

  a = docCookies.getItem("auth");
  if(a == null || a == undefined){
      window.location = "login.html";
  }
};

Auth.prototype.logout = function(){
  docCookies.removeItem("auth");
  window.location = "login.html";
};
