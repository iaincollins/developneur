Sites = new Meteor.Collection('sites')
Forums = new Meteor.Collection('forums')
Posts = new Meteor.Collection('posts')

if (Meteor.isClient) {

    /* Router Stuff */
    Meteor.Router.add({
	'/':'home',
	'/new':'newForum'
    });

    /* New Forums*/
    Template.newForum.events({
	'submit':function(){
	    console.log('hi');
	}
    })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
