var express = require('express');
var router = express.Router();
const passport = require('passport');
const {getUserRole, getFeedback ,notApproveFeedback ,getAllUsers ,insertFeedback} = require('./utility/utility.db.js');

const async = require("async");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Legendary' });
});

router.get('/profile', isLoggedIn, function (req, res) {
    if(req.query.search_value ){
        db.query("SELECT * FROM user_info ui WHERE ui.user_name LIKE ? AND ui.user_id NOT IN (?) ORDER BY ui.id DESC", ['%' + req.query.search_value + '%', req.user.id] ,function (err,rows){
            if(err) {
                console.log(err)
                res.redirect('/');
            }else{
                let user_role = 0;
                let allUsers = [];
                async.eachSeries(rows, function (row ,callback){
                    async.series([
                        function (callback){
                            getFeedback(row.user_id,function (err,results) {
                                row['feedbacks'] = results;
                                callback();
                            })
                        },
                        function (callback){
                            getUserRole(req.user.id,function(err,res){
                                user_role = res;
                                callback();
                            })
                        },function (callback){
                            getAllUsers(req.user.id, function (err,r){
                                allUsers = r;
                                callback()
                            })
                        }
                    ],function (){
                        callback()
                    })
                },function done(){
                    
                    res.render('profile.twig', {
                        profile: req.user,
                        profileUrl: req.user.photos[0].value,
                        users: rows,
                        userRole: user_role,
                        allUsers: allUsers
                    });
                });

            }

        });
    }else{
        db.query("SELECT * FROM user_info WHERE user_id NOT IN(?) ORDER BY id DESC",[req.user.id] ,function (err,rows){
            if(err) {
                console.log(err)
                
                res.redirect('/');
            }else{
                let user_role = 0;
                let allUsers = [];
                async.eachSeries(rows, function (row ,callback){
                    async.series([
                        function (callback){
                            getFeedback(row.user_id,function (err,results) {
                                row['feedbacks'] = results;
                                callback();
                            })
                        },
                        function (callback){
                            getUserRole(req.user.id,function(err,res){
                                user_role = res;
                                callback();
                            })
                        },function (callback){
                            getAllUsers(req.user.id, function (err,r){
                                allUsers = r;
                                callback()
                            })
                        }
                    ],function (){
                        callback()
                    })
                },function done(){
                    res.render('profile.twig', {
                        profile: req.user,
                        profileUrl: req.user.photos[0].value,
                        users: rows,
                        userRole: user_role,
                        allUsers: allUsers
                    });
                });
            }
        });
    }


});

router.get('/error', isLoggedIn, function (req, res) {
  res.render('error.twig',);
});

router.get('/auth/facebook', passport.authenticate('facebook', {
  scope:['public_profile', 'email']
}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/error'
    }));

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/feedback_form',function(req, res) {

    insertFeedback(req.body.user_name,req.body.user_id,req.body.user_feed_name, req.body.comment, req.body.evaluation, req.body.platform,req.body.evaluation_type, function (err,result){
        if(result){
            res.redirect('/profile');
        }
    })

})

router.get('/delete_feedback',function(req, res) {
    if( req.query.feedback_id ){
        notApproveFeedback(req.query.feedback_id, function (err,result){
            if(err === null){
                res.redirect('/profile');
            }
        })
    }

})



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
      return next();
  }
  res.redirect('/');
}



module.exports = router;
