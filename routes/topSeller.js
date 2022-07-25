var express = require('express');
var router = express.Router();
const {getUserRole,getCountPositiveFeedbacks} = require('./utility/utility.db.js');
const async = require("async");

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
    let userRole = 0;
    let users = [];
    async.series(
        [
            function (callback){
                getUserRole(req.user.id,function(err,role){
                    userRole = role;
                    callback();
                })
            },function (callback){
                getCountPositiveFeedbacks('DESC',function (err,results){
                    users = results;
                    callback();
                })
            }
        ]
        ,function (){
            res.render('topSeller.twig', {
                profile: req.user,
                profileUrl: req.user.photos[0].value,
                userRole: userRole,
                users: users
            });
    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

module.exports = router;
