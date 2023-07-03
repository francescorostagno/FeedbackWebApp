const express = require("express");
const router = express.Router();
const async = require('async');

router.get('/',isLoggedIn,function (req, res, next){
    let allSets = {};
    async.series([
        function (callback){
            pokemon.set.all()
                .then((sets) => {
                    allSets = sets;
                    callback();
                })
        }
    ],function (){
        res.render('all_sets',{
            allSets: allSets
        })
    })


})

router.get('/all_set_card',isLoggedIn,function (req,res,next){
    if(req.query.set_id){
        pokemon.card.where({ q: 'set.id:' +   unescape(req.query.set_id) })
            .then(result => {
                res.render('all_set_card', {
                    data: result.data,
                });
            })
    }else{
        res.redirect('/all_sets');
    }
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}


module.exports = router;