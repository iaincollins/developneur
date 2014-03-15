Sites = new Meteor.Collection('sites')
Forums = new Meteor.Collection('forums')
Posts = new Meteor.Collection('posts')
Comments = new Meteor.Collection('comments')

if (Meteor.isClient) {

    /* Router Stuff */
    Meteor.Router.add({
	'/':'home',
	'/new':'newForum',
	'/forums':'forums',
	'/forum/:id':{to:'forum',and:function(id){
	    Session.set('currentForumId', id)
	}}
    });

    /* New Forum*/
    Template.newForum.events({
	'submit':function(){
	    Forums.insert({created:new Date(),modified:new Date(),siteId:1,name:$('#nameOfForum').val(),description:$('#descriptionOfForum').val()});
	    console.log($('#nameOfForum').val());
	}
    });

    /* Forums */
    Template.forums.allForums=function(){
	return Forums.find();
    }
    Template.forums.events({
	'click section':function(){
	    Meteor.Router.to('/forum/'+$(this)[0]._id);
	}
    });

    /* Forum */
    Template.forum.currentForum=function(){
	return Forums.findOne(Session.get('currentForumId'))
    }
    Template.forum.currentPosts=function(){
	return Posts.find({forumId:Session.get('currentForumId')})
    }
    Template.forum.loggedIn=function(){
	if(Meteor.user()!=null){return true}else{return false};
    }
    
    /* newPost */
    Template.newPost.events({
	'submit':function(){
	    Posts.insert({created:new Date(),modified:new Date(),title:$('#newPostTitle').val(),details:$('#newPostDetails').val(),author:Meteor.user(),siteId:1,forumId:Session.get('currentForumId')});
	}
    });

    /* Comments */
    Template.forum.currentComments=function(currentPostId){
	return Comments.find({postId:currentPostId});
    }
    Template.forum.events({
	'submit':function(){
	    Comments.insert({siteId:1,forumId:Session.get('currentForumId'),author:Meteor.user(),comment:$('#newCommentText').val(),postId:$('#newCommentText').attr('data-post-id'),parentId:0});
	}
    })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
