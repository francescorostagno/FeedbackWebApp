var express = require('express');
var router = express.Router();
const {getUserRole} = require('./utility/utility.db.js');

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
 let userRole = 0;
    getUserRole(req.user.id,function(err,role){
     userRole = role;
        if(req.query.card_id ){
            pokemon.card.find(req.query.card_id)
                .then(card => {
                    console.log(card.name) // "Charizard"
                    res.render('singlecard.twig', {
                        profile: req.user,
                        profileUrl: req.user.photos[0].value,
                        data: card,
                        userRole: role
                    });
                })
        }else{
            res.render('pokemontcg.twig', {
                profile: req.user,
                profileUrl: req.user.photos[0].value,
                userRole: role
            });
        }
 })


});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
