Lingr = require("lingr").Lingr;
Ti.API.info("Lingr UI Room: Included");

RoomUI = function(room) {
  this.room = room;
  this.room.ui = this;
  this.win = Ti.UI.createWindow({
    fullscreen: false,
    title: "Lingr: "+room.name,
    windowSoftInputMode: Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE,
    activity: {
      onCreateOptionsMenu: function(e) {
        m1 = e.menu.add({
          title: 'Members'
        });
        m1.addEventListener('click',Lingr.yakisoba(this,function(){
          var memberw = Ti.UI.createWindow({
            url: "members_window.js",
            title: "Lingr: Members in "+room.name,
            fullscreen: false
          });
          memberw.room = room;
          memberw.open();
        }));
        //m1.setIcon(Ti.Android.R.drawable.ic_menu_friendslist);
      }
    }
  });
   
  this.tablel = 0;
  this.enable_autoscroll = true;
  this.last_user = null;
  this.last_row = null;

  var data = [];

  for(var i=0;i<room.messages.length;i++) {
    var m = this.gen_message(room.messages[i]);
    if(m){
      data.push(m);
      this.tablel++;
    }
  }

  this.table = Ti.UI.createTableView({
    backgroundColor: 'black',
    separatorColor: 'black',
    data: data
  });

  this.table.footerView = Ti.UI.createView({
    height: 50 
  });

  this.text_box = Ti.UI.createTextField({
    bottom: 0,
    left: 0,
    width: "100%",
    height: 50,
    enableReturnKey: true,
    returnKeyType: Titanium.UI.RETURNKEY_SEND
  });

  this.text_box.addEventListener('return',function(){
    if(this.value != "") {
      room.say(this.value);
      this.value = "";
    }
    this.focus();
  });
  this.table.addEventListener('scroll',Lingr.yakisoba(this,function(e){
    var theindex = e.totalItemCount-e.visibleItemCount;
    this.enable_autoscroll = (e.firstVisibleItem == theindex);
  }));

  Ti.Gesture.addEventListener('orientationchange',Lingr.yakisoba(this,function(e){
    Ti.API.info("Lingr UI Room: onRotate");
    for(var i=0;i<this.table.data[0].length;i++){
      if(row.is_text){
        this.table.data[0][i].text_label.width = Titanium.Platform.displayCaps.platformWidth-50;
        this.table.updateRow(this.table.data[0][i]);
      }
    }
  }));

  this.win.add(this.table);
  this.win.add(this.text_box);
  this.table.show();
  this.table.scrollToIndex(this.tablel-1);
  this.unread_index = this.tablel-1;

  room.on_message = Lingr.yakisoba(this,function(message) {
    Ti.API.info("Lingr UI Room "+room.id+": New Message. "+room.is_active);
    if(!room.is_active) {
      Ti.API.info("Lingr UI Room "+room.id+": Ramp!");
      room.lamp.text = "*";
    }
    this.add_message(message);
  });
  room.on_member = Lingr.yakisoba(this,function(message) {
    this.add_presence(message);
  });
  room.on_presence = Lingr.yakisoba(this,function(message) {
    this.add_presence(message);
  });
  this.win.addEventListener('focus',Lingr.yakisoba(this,function(){
    Ti.API.info("Lingr UI Room "+room.id+": focus "+this.unread_index);
    room.lamp.text = "";
    room.is_active = true;
    //this.table.scrollToIndex(20);
    //this.table.scrollToTop(this.tablel-1);
    this.table.scrollToIndex(this.unread_index);
    this.text_box.focus();
  }));
  this.win.addEventListener('blur',Lingr.yakisoba(this,function(){
    Ti.API.info("Lingr UI Room "+room.id+": blur "+this.tablel);
    room.is_active = false;
    this.unread_index = this.tablel-1;
  }));
};

RoomUI.prototype.gen_message = function(message) {
  if(this.last_userid != message.username) {
    var row = Ti.UI.createTableViewRow({
      height: "auto"
    });
    var t = 16;
    row.name_label = Ti.UI.createLabel({
      color: "#C87300",
      textAlign: "left",
      top: "0px",
      left: "40px",
      text: message.nickname
    });
    row.user_image = Titanium.UI.createImageView({
      image: message.icon_url,
      top: 5,
      left: 0,
      width: 30,
      height: 30 
    });
    this.last_userid = message.username;
    this.last_row = row;
    row.is_text = true;
    row.add(row.name_label);
    row.add(row.user_image);
    row.text_label = Ti.UI.createLabel({
      top: t,
      left: "40px",
      //right: 5,
      textAlign: "left",
      text: message.text,
      autoLink: Ti.UI.Android.LINKIFY_WEB_URLS,
      width: Titanium.Platform.displayCaps.platformWidth-50,
      //width: "90%"
    });

    row.add(row.text_label);
    return row;
  }else{
    this.last_row.text_label.text += "\n"+message.text;
    return false;
  }
};
RoomUI.prototype.add_message = function(message) {
  var m = this.gen_message(message);
  if(m){
    this.table.appendRow(m);
    this.tablel++;
  }
  if(this.room.is_active && this.enable_autoscroll){
    this.table.scrollToIndex(this.tablel);
  }
}
RoomUI.prototype.add_presence = function(presence) {
  var row = Ti.UI.createTableViewRow({
    height: 18
  });
  row.text_label = Ti.UI.createLabel({
    color: "gray",
    top: 0,
    right: 0,
    textAlign: "right",
    text: presence.text
  });
  row.add(row.text_label);
  this.table.appendRow(row);
  this.tablel++;
  this.last_userid = null;
  if(this.room.is_active && this.enable_autoscroll){
    this.table.scrollToIndex(this.tablel);
  }
}
RoomUI.prototype.intent = function(){
  return this.win.activity.getIntent();
}

exports.RoomUI = RoomUI;
