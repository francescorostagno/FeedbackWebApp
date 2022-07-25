var express = require('express');
var router = express.Router();
const {getUserRole} = require('./utility/utility.db.js');

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
   let userRole = 0;
   getUserRole(req.user.id,function (err,role) {
       userRole = role;
       res.render('info.twig', {
           profile: req.user,
           profileUrl: req.user.photos[0].value,
           userRole: userRole
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
