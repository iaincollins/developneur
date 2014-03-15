Sites = new Meteor.Collection('sites')
Forums = new Meteor.Collection('forums')
Posts = new Meteor.Collection('posts')

if (Meteor.isClient) {
    Meteor.Router.add({
	'/':'home',
	'/new':'newForum'
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
