var express = require('express');
var router = express.Router();
const {getUserRole, getFeedback ,getOwnFeedback ,updateNotificationPreference,deleteUser} = require('./utility/utility.db.js');

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
  let userRole = 0;
  
  getUserRole(req.user.id,function(err,role){
    userRole = role;
    db.query("SELECT ui.user_id as user_id, ui.user_name as user_name, ui.user_profile as user_profile FROM user_info ui  WHERE ui.user_id = " + req.user.id ,function (err,row){
      if(err) {
        res.redirect('/');
      }else if(row.length > 0){
        getFeedback(row[0].user_id,function (err,results) {
          row[0]['feedbacks'] = results;
          getOwnFeedback(req.user.displayName,function (e,ownFeedback) {
            if(e) {
              console.log(e)
            }
            row[0]['feedbacksOwn'] = ownFeedback;
            
            res.render('user.twig', {
              profile: req.user,
              profileUrl: req.user.photos[0].value,
              user: row[0],
              userRole: role
            });
          })
        })
      }else{
        res.redirect('/logout');
      }
    });
  })

});

router.get('/delete_user',function(req, res) {
  if( req.query.user_id ){
    deleteUser(req.query.user_id, function (err,result){
      if(err === null){
        res.redirect('/logout');
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
