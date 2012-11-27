Ti.API.info("Lingr UI Room Members: hi");
var member = Ti.UI.createTableViewSection({
	headerTitle:'Members'
});

var bot = Ti.UI.createTableViewSection({
	headerTitle:'Bots'
});

function generate_row(member) {
  var row = Ti.UI.createTableViewRow({
    height: "auto"
  });

  row.name_label = Ti.UI.createLabel({
    color: (member.is_online||(member.id && member.status != "offline")) ? "white":"gray",
    textAlign: "left",
    top: 6,
    left: "40px",
    text: member.name,
    font: {fontSize: 24}
  });

  row.user_image = Titanium.UI.createImageView({
    image: member.icon_url,
    top: 10,
    left: 0,
    width: 30,
    height: 30 
  });

  row.add(row.name_label);
  row.add(row.user_image);

  return row;
}

var key;
Ti.API.info(Ti.UI.currentWindow.room.members);
for(key in Ti.UI.currentWindow.room.members) {
  Ti.API.info(Ti.UI.currentWindow.room.members[key]);
  member.add(generate_row(Ti.UI.currentWindow.room.members[key]))
}
Ti.API.info(Ti.UI.currentWindow.room.bots);
for(key in Ti.UI.currentWindow.room.bots) {
  bot.add(generate_row(Ti.UI.currentWindow.room.bots[key]))
}

var view = Titanium.UI.createTableView({
  backgroundColor: 'black',
  data: [member,bot]
});

Ti.UI.currentWindow.add(view);
