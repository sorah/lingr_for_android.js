Lingr = require("lingr").Lingr;

var view = Titanium.UI.createView({
  backgroundColor:'black',
  layout: 'vertical'
});

var label = Titanium.UI.createLabel({
  text: "You need to set username and password of your Lingr account to use this app.\nIf don't have, please create an account at http://lingr.com/user/signup",
  color: 'white',
  autoLink: Ti.UI.Android.LINKIFY_WEB_URLS
});

if(Ti.App.Properties.hasProperty("username") && Ti.App.Properties.hasProperty("password")) {
  label.text = "Type new username and password of your Lingr account.\nTake effects after next connect.\nIf don't have, please create an account at http://lingr.com/user/signup";
}

var username_text = Ti.UI.createTextField({
  hintText: 'Username',
  width: '100%',
  left: 0
});
var pass_text = Ti.UI.createTextField({
  hintText: 'Password',
  width: '100%',
  left: 0,
  passwordMask: true
});

var signin_button = Ti.UI.createButton({
  title: 'Sign In',
  width: '70px',
  left: 0
});

signin_button.addEventListener(
  'click',
  function(e){
    var actInd = Titanium.UI.createActivityIndicator({
      height:50,
      width:10,
      message: "Verifying..."
    });
    actInd.show();
    //(new Lingr.API(username_text.value,pass_text.value)).hogehoge({});
    new Lingr.API(username_text.value,pass_text.value).test(function(result) {
      Ti.API.info("Certificate Verify Result: "+result);
      actInd.hide();
      if(result){
        Ti.App.Properties.setString("username",username_text.value);
        Ti.App.Properties.setString("password",pass_text.value);
        Ti.UI.currentWindow.close();
      }else{
        Ti.UI.createAlertDialog({
          title: "Oops!",
          message: "Username or Password is wrong. Check them again.",
          buttonNames: ['OK']
        }).show();
      }
    })
  }
);

view.add(label);
view.add(username_text);
view.add(pass_text);
view.add(signin_button);

Ti.UI.currentWindow.add(view);
