Lingr = require("lingr").Lingr;
RoomUI = require("room_window").RoomUI;

var menu = null;

var menu_connect = {};
var menu_settings = {};

var notid = 0;

Ti.Android.currentActivity.onCreateOptionsMenu = function(e) {
  Ti.API.info("Lingr UI: onCreateOptionsMenu");
  menu = e.menu;
	menu_connect = menu.add({
    title: menu_connect.title||'Connect'
	});
	menu_settings = menu.add({
    title: 'Settings'
	});

  menu_connect.addEventListener('click',function(){
    if(lingr){
      lingr.disconnect();
      lingr = null;
      Ti.App.Properties.removeProperty("session");
      connect_to_lingr();
    }else{
      connect_to_lingr();
    }
  });

  menu_settings.addEventListener('click',function(){
    var settings_window = Titanium.UI.createWindow({
      url:'settings_window.js',
      fullscreen: false,
      title: 'Settings'
    });
    settings_window.open();

  });
}

var data = [];
data[0] = Ti.UI.createTableViewRow({
  title: 'Connecting...',
  font: {fontSize: 16}
});
var view = Titanium.UI.createTableView({
  backgroundColor: 'black',
  data: data
});

Ti.UI.currentWindow.add(view);
var lingr = null;
var connect_to_lingr = function() {
  Ti.API.info("Focused, Connecting to Lingr... "+Ti.App.Properties.getString("session"));
  view.setData([Ti.UI.createTableViewRow({
    title: 'Connecting...',
    font: {fontSize: 16}
  })]);
  lingr = new Lingr.API(Ti.App.Properties.getString("username"),Ti.App.Properties.getString("password"),Ti.App.Properties.getString("session"));
  if(menu_connect) {
    menu_connect.title = "Reconnect";
  }
  lingr.when_login_failed = function(){
    var alertDialog = Titanium.UI.createAlertDialog({
        title: 'Oops!',
        message: 'Failed to signin. Please check your account information from Menu->Settings.',
        buttonNames: ['OK']
    });
    alertDialog.show();
  }
  lingr.on_failure = function(loc,mes,json){
    // TODO: Implemention here!
    // * Notification + sound
    Ti.API.info("Lingr UI: on_failure, "+mes+"@"+loc);
    var alertDialog = Titanium.UI.createAlertDialog({
      title: 'Error: '+loc,
      message: mes,
      buttonNames: ['OK']
    });
    alertDialog.show();
    lingr = null;
    connect_message();
  }
  lingr.on_error = function(error){
    Ti.API.info("Lingr UI: on_error, "+error);
    var alertDialog = Titanium.UI.createAlertDialog({
      title: 'Requesting Error',
      message: error,
      buttonNames: ['OK']
    });
    alertDialog.show();
    lingr = null;
    connect_message();
  }

  lingr.connect(function(){
    menu_connect.title = "Reconnect";
    Ti.App.Properties.setString("session",lingr.session.id);
    view.deleteRow(0);
    for(var k in lingr.rooms) {
      var room = lingr.rooms[k];

      Ti.API.info("Lingr UI: "+room.id+" - "+room.name);

      room.row = Ti.UI.createTableViewRow({
      });
      room.lamp = Ti.UI.createLabel({
        text: "",
        right: "5px"
      });
      room.row_label = Ti.UI.createLabel({
        text: room.name,
        left: "5px",
        font: {fontSize: 16}
      });

      room.row.add(room.lamp);
      room.row.add(room.row_label);

      view.appendRow(room.row); 

      room.lamp.show();

      room.view = new RoomUI(room);
      room.row.view = room.view;

      room.row.addEventListener('click',function(){
        Ti.API.info("Lingr UI: row clicked "+k);
        this.view.win.open();
      });
      room.is_active = false;
    }
    lingr.on_message = function(mes) {
      /*if(mes.text.match("@"+this.session.username.replace(/\W/g,'\\$&'))){
        Ti.API.info("Lingr UI: send notification");
        Ti.API.info(Ti.Android.currentActivity.getIntent());
        var image = parseFloat(Ti.Platform.version) >= 2.3 ? "notification.png" : "notification_old.png";

        var notification = Titanium.Android.createNotification({
          tickerText: "Lingr: "+mes.nickname+" called you at "+mes.room_id,
          //sound: 'notification.mp3',
          //icon: image,
          contextTitle: "Lingr: "+mes.nickname+" called you at "+mes.room_id,
          contentText: mes.nickname+": "+mes.text//,
          //contentIntent: Ti.Android.currentActivity.getIntent()
        });
        Ti.Android.NotificationManager.notify(notid,notification);
        notid++;
      }*/
    };
    lingr.start();
  });
}

var connect_message = function(){
  menu_connect.title = "Connect";
  view.setData([Ti.UI.createTableViewRow({
    title: 'Tap "Connect" from menu to connect.',
    font: {fontSize: 16}
  })]);
}
if(Ti.App.Properties.hasProperty("username") && Ti.App.Properties.hasProperty("password")) {
  connect_to_lingr();
}else{
  connect_message();
  var setup_window = Titanium.UI.createWindow({
    url:'setup_window.js',
    fullscreen: false,
    title: 'Sign in to Lingr'
  });
  setup_window.open();
}

