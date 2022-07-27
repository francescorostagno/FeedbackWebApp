var express = require('express');
const async = require("async");
var router = express.Router();
const {getUserRole, getTotalUsers , notApproveFeedback ,approveFeedback ,getFeedbackNeedApprove,deleteUser} = require('./utility/utility.db.js');

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
    getUserRole(req.user.id,function(err,role){
        let total = 0;
        if(role === 1){
            db.query("SELECT * FROM user_info ui ORDER BY ui.id DESC",function (err,rows){
                if(err) {
                    
                    res.redirect('/')
                }else{
                    async.eachSeries(rows, function (row ,callback){
                        async.series([
                            function (callback){
                                getFeedbackNeedApprove(row.user_id,function (err,results) {
                                    row['feedbacks'] = results;
                                    callback()
                                })
                            },function (callback){
                                getTotalUsers(function(e,r) {
                                    if (r) {
                                        total = r
                                    }
                                    callback()
                                });
                            }
                        ],function (){
                            callback()
                        })
                    },function done(){
                        
                        res.render('admin.twig', {
                            profile: req.user,
                            profileUrl: req.user.photos[0].value,
                            users: rows,
                            userRole: role,
                            total: total
                        });
                    });

                }
            });
        }else{
            res.redirect('/profile');
        }
    })

});


router.get('/not_approve_feedback',function(req, res) {
    if( req.query.feedback_id ){
        notApproveFeedback(req.query.feedback_id, function (err,result){
            if(err === null){
                res.redirect('/admin');
            }
        })
    }

})

router.get('/approve_feedback',function(req, res) {
    if( req.query.feedback_id ){
        approveFeedback(req.query.feedback_id, function (err,result){
            if(err === null){
                res.redirect('/admin');
            }
        })
    }

})


router.get('/delete_user',function(req, res) {
    if( req.query.user_id ){
        deleteUser(req.query.user_id, function (err,result){
            if(err === null){
                res.redirect('/admin');
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
