// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

Lingr = require("lingr").Lingr;

var main_window = Titanium.UI.createWindow({
  url:'main_window.js',
  fullscreen: false,
  title: 'Lingr',
  exitOnClose: true,
  softInputMode: Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE
});

if(!(Ti.App.Properties.hasProperty("notification"))){
  Ti.App.Properties.setBool("notification",true);
}

main_window.open();


