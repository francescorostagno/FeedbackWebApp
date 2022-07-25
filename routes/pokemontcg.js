var express = require('express');
var router = express.Router();
const {getUserRole } = require('./utility/utility.db.js');

router.get('/', isLoggedIn, function(req, res, next) {
    let userRole = 0;
    let sets = {};
    getAllSets(function(allSets){
        sets = allSets;
        getUserRole(req.user.id,function(err,role){
            userRole = role;
            switch (req.query.search_type){
                case 'id':
                    pokemon.card.find(req.query.search_card_name)
                        .then(card => {
                            res.redirect('/singlecard?card_id='+req.query.search_card_name);
                        })
                    break;
                case 'name':
                    pokemon.card.where({ q: 'name:' + req.query.search_card_name })
                        .then(result => {
                            res.render('pokemontcg.twig', {
                                profile: req.user,
                                profileUrl: req.user.photos[0].value,
                                data: result.data,
                                userRole: userRole,
                                sets: sets
                            });
                        })
                    break;
                case 'set':
                    // Filter cards via query parameters
                    pokemon.card.where({ q: 'set.id:' +   unescape(req.query.search_sets) })
                        .then(result => {
                            res.render('pokemontcg.twig', {
                                profile: req.user,
                                profileUrl: req.user.photos[0].value,
                                data: result.data,
                                userRole: userRole,
                                sets: sets
                            });
                        })
                    break;
                default:
                    res.render('pokemontcg.twig', {
                        profile: req.user,
                        profileUrl: req.user.photos[0].value,
                        userRole: userRole,
                        sets: sets
                    });
                    break;
            }
        })
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}



function getAllSets(cb) {
    // Get all sets
    pokemon.set.all()
        .then((sets) => {
            cb(sets)
        })
}

module.exports = router;
