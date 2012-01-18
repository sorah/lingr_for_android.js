var data = [];

data[0] = Ti.UI.createTableViewRow({});
data[0].label = Ti.UI.createLabel({
  text: "Account",
  left: 0,
  top: 10,
  font: {fontSize: 18}
});
data[0].add(data[0].label);
/*data[1] = Ti.UI.createTableViewRow({});
data[1].label = Ti.UI.createLabel({
  text: "Notify when ID called",
  left: 0,
  top: 10,
  font: {fontSize: 18}
});
data[1].check_box = Ti.UI.createSwitch({
  value:Ti.App.Properties.getBool("notification"),
  right: 10,
  style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX
});
data[1].check_box.addEventListener('change',function(e){
  Ti.API.info("Lingr UI Settings: Checkbox="+e.value);
  Ti.App.Properties.setBool("notification",e.value);
});

data[1].add(data[1].check_box);
data[1].add(data[1].label);
*/
data[0].addEventListener('click',function(){
  var setup_window = Titanium.UI.createWindow({
    url:'setup_window.js',
    fullscreen: false,
    title: 'Sign in to Lingr'
  });
  setup_window.open();
});

var view = Titanium.UI.createTableView({
  backgroundColor: 'black',
  data: data
});

Ti.UI.currentWindow.add(view);
