Sites = new Meteor.Collection('sites')
Forums = new Meteor.Collection('forums')
Posts = new Meteor.Collection('posts')
Comments = new Meteor.Collection('comments')

if (Meteor.isClient) {
    /* Router Stuff */
    Meteor.Router.add({
        '/':'forums',
        '/new/forum':'newForum',
        '/new/post':'newPost',
        '/forums':'forums',
        '/forum/:id':{ to:'forum',and:function(id) {Session.set('currentForumId', id) } },
        '/forum/post/:id':{ to:'post',and:function(id) {Session.set('currentPostId', id) } }
    });

    Handlebars.registerHelper('loggedIn', function (id) {
        if (Meteor.user()!=null) { return true } else { return false };
    });
    
    // Handlebars.registerHelper('userName', function (id) {
    //     if (Meteor.user()) {
    //         return Meteor.user().profile.name;
    //     } else {
    //         return '';
    //     }
    // });

    Template.forums.events({
        'click section':function(){
            Meteor.Router.to('/forum/'+$(this)[0]._id);
        }
    });
    
    /* New Forum */
    Template.newForum.events({
        'submit':function(){
            Forums.insert({imageURL:$('#iconOfForum').val(),author:Meteor.user(),created:new Date(),modified:new Date(),siteId:1,name:$('#nameOfForum').val(),description:$('#descriptionOfForum').val()});
            Meteor.Router.to('/forums')
        }
    });

    /* Forums */
    Template.forums.numOfComplaints=function(stuff){
	return(Posts.find({forumId:stuff._id}).count())
    }
    Template.forums.allForums=function(){
        return Forums.find();
    }
    
    Template.forums.events({
        'click section':function(){
            Meteor.Router.to('/forum/'+$(this)[0]._id);
        }
    });
    
    /* Forum */
    Template.forum.currentUserGrav=function(user){
	try{return user.author.services.twitter.profile_image_url}
        catch(e){return encodeURI('http://www.gravatar.com/avatar/'+CryptoJS.MD5((user.author.emails[0].address||'')))}
    }
    Template.forum.currentForum=function(){
        return Forums.findOne(Session.get('currentForumId'))
    }
    
    Template.post.currentForum=function(){
        return Forums.findOne(Session.get('currentForumId'))
    }
    
    Template.forum.currentPosts=function(){
        return Posts.find({forumId:Session.get('currentForumId')})
    }
    
    Template.forum.isOwnerOfForum=function(){
        return Forums.findOne(Session.get('currentForumId')).author._id==(Meteor.user()||{})._id
    }
    
    Template.post.isOwnerOfPost=function(test){
        return Posts.findOne(test._id).author._id==(Meteor.user()||{})._id
    }
    
    Template.post.isOwnerOfComment=function(test){
        return Comments.findOne(test._id).author._id==(Meteor.user()||{})._id
    }
    
    Template.post.isComment=function(test){
        return test!=undefined
    }
    
    Template.forum.events({
        'click #removeForum':function(){
            Forums.remove(Session.get('currentForumId'));
            Meteor.Router.to('/forums')
        }})
    Template.post.events({
        'click .removePost':function(test){
            Posts.remove($(test.target).attr('data-post-id'));
	    Meteor.Router.to('/forum/'+Session.get('currentForumId'))
        },
        'click .removeComment':function(test){
            Comments.remove($(test.target).attr('data-comment-id'));
        }
    });
    
    /* newPost */
    Template.newPost.templateLoaded = function() {
	Meteor.defer(function () {
            $(document).ready(function() { $(".select-autocomplete").select2(); });
	});
	return;
    };
    Template.newPost.allForums=function(){
        return Forums.find();
    };
    Template.newPost.events({
        'click .complaintType':function(e){
            $('#newPostTitle').val( "Complaint about "+$(e.toElement).text().trim() );
            $('#complaintStage1').slideUp();
            $('#complaintStage2').slideDown();
        },
        'click #stage2Continue':function(e){
            $('#complaintStage2').slideUp();
            $('#complaintStage3').slideDown();
        },
        'click #stage3Continue':function(e){
            $('#complaintStage3').slideUp();
            $('#complaintStage4').slideDown();
        },
        'submit #newPost':function(){
            Posts.insert({created:new Date(),modified:new Date(),title:$('#newPostTitle').val(),details:$('#newPostDetails').val(),author:Meteor.user(),siteId:1,forumId:Forums.findOne({name:$('#selectAirline').select2('data').text})._id});
            Meteor.Router.to('/forum/'+Forums.findOne({name:$('#selectAirline').select2('data').text})._id);
        },
	'click #registerComplaint':function(){
	    $('.airlineName').text($('#selectAirline').select2('data').text)
	}
    });
    
    /* Comments */
    Template.post.currentUserGrav=function(user){
	try{return user.author.services.twitter.profile_image_url}
        catch(e){return encodeURI('http://www.gravatar.com/avatar/'+CryptoJS.MD5((user.author.emails[0].address||'')))}
    }
    Template.post.currentComments=function(currentPostId){
        console.log(currentPostId)
        return Comments.find({postId:currentPostId});
    }
    Template.post.getPostData=function(){
	return Posts.find({_id:Session.get('currentPostId')})
    }
    Template.post.events({
        'submit #addComment':function(){
            Comments.insert({siteId:1,forumId:Session.get('currentForumId'),author:Meteor.user(),comment:$('#newCommentText').val(),postId:$('#newCommentText').attr('data-post-id'),parentId:0});
        }
    })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
