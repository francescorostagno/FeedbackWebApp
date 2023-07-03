const mapPlatform = ['Facebook','EBAY','Vinted','Other']
const mapEvaluationType = ['Venditore','Compratore','Vinted','Other']

const insertFeedback = function(user_name, user_id, user_feed_name, comment,evaluation,platform,evaluation_type,cb){
    let date_ob = new Date().toISOString().replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '')     // delete the dot and everything after;
    db.query("INSERT INTO feedback(user_name,user_id,user_feed_name,comment,evaluation,platform,evaluation_type,date_added) VALUES('"+user_name+"','"+user_id+"','"+ user_feed_name +"','"+comment+"','"+evaluation+"','"+platform+"','"+evaluation_type+"','"+date_ob+"')",function (err,result) {
        if(err){
            cb(err,null);
        }else{
            cb(null,result);
        }
    })
}

const getUserRole = function (user_id,cb){
    db.query("SELECT ui.user_role FROM user_info ui WHERE ui.user_id = " + user_id , function(err,row){
        let role = "0";
        if(err){
            cb(err,null)
        }else{
            if( row && row.length > 0){
                role = row[0].user_role;
            }
            cb(null,role);
        }
    })
}

const getTotalUsers = function (cb){
    db.query("SELECT count(ui.id)  as total FROM user_info ui" ,function (err,row){
        if(err){
            cb(err,null)
        }else {
            cb(null,row[0]['total'])
        }
    })
}

const getEmailStructure = function (feedback_id,cb){
    db.query("SELECT user_info.user_email, feedback.comment FROM user_info JOIN feedback ON feedback.user_id = user_info.user_id WHERE user_info.notification = 1 AND  = feedback.id = " + feedback_id ,function (e,r) {
        if(e){
            cb(e,null);
        }else{
            if(r){
                let data = {
                    'comment' : r[0].comment,
                    'user_email': r[0].user_email
                };
                cb(null,data);
            }else{
                cb(null,false)
            }
        }

    });
}

const approveFeedback = function (feedback_id,cb){
    db.query("UPDATE  feedback SET approved = 1 WHERE id = " + feedback_id , function(err,row){
        if(err){
            cb(err,null)
        }else {
            cb(null,true);
        }

    })
}

const notApproveFeedback = function (feedback_id,cb){
    db.query("UPDATE  feedback SET approved = 2 WHERE id = " + feedback_id  , function(err,row){
        if(err){
            cb(err,null)
        }else{
            cb(null,true);
        }

    })
}

const getFeedbackNeedApprove = function (user_id, cb) {
    db.query("SELECT ui.* , fe.* FROM user_info ui JOIN feedback fe ON fe.user_id = ui.user_id WHERE approved = 0 AND ui.user_id = " + user_id , function(err,rows){
        let feedbacks = [];
        if(err){
            cb(err,null)
        }else{
            let positiveCount = 0;
            let negativeCount = 0;

            if( rows && rows.length > 0){
                for(let j = 0; j < rows.length ; j++ ){
                    if( rows[j].evaluation == 0){
                        negativeCount++;
                    }else{
                        positiveCount++;
                    }
                    let  feedback = {
                        'id' : rows[j].id,
                        'user_feed_name' : rows[j].user_feed_name,
                        'comment': rows[j].comment,
                        'date_added': rows[j].date_added,
                        'evaluation': rows[j].evaluation,
                        'evaluation_type': mapEvaluationType[rows[j].evaluation_type],
                        'platform': mapPlatform[rows[j].platform],
                    }
                    feedbacks.push(feedback);
                }
            }
            feedbacks['positiveCount'] = positiveCount;
            feedbacks['negativeCount'] = negativeCount;
            cb(null,feedbacks);
        }

    })
}

const getFeedback = function (user_id,  cb){
    db.query("SELECT ui.* , fe.* FROM user_info ui JOIN feedback fe ON fe.user_id = ui.user_id WHERE approved = 1 AND ui.user_id = " + user_id , function(err,rows){
        let feedbacks = [];
        if(err){
            cb(err,null)
        }else{
            var positiveCount = 0;
            var negativeCount = 0;

            if( rows && rows.length > 0){
                for(let j = 0; j < rows.length ; j++ ){
                    if( rows[j].evaluation == 0){
                        negativeCount++;
                    }else{
                        positiveCount++;
                    }
                    let  feedback = {
                        'id' : rows[j].id,
                        'user_feed_name' : rows[j].user_feed_name,
                        'comment': rows[j].comment,
                        'date_added': rows[j].date_added,
                        'evaluation': rows[j].evaluation,
                        'platform': mapPlatform[rows[j].platform],
                        'evaluation_type': mapEvaluationType[rows[j].evaluation_type],
                    }
                    feedbacks.push(feedback);
                }
            }
            feedbacks['positiveCount'] = positiveCount;
            feedbacks['negativeCount'] = negativeCount;
            
            cb(null,feedbacks);
        }
    })
}

const deleteFeedback = function (feedback_id,cb) {
    db.query("DELETE FROM feedback WHERE id = " + feedback_id , function(err,row){
        if(err){
            
            cb(err,null)
        }else{
            
            cb(null,true);
        }
    })
}

const getAllUsers = function (user_id, cb){
    console.log(user_id);
    db.query("SELECT ui.* FROM user_info ui WHERE ui.user_id NOT IN (" + user_id + ") ORDER BY ui.user_name ASC" , function(err,rows){
        let users = [];
        if( rows && rows.length > 0){
            for(let j = 0; j < rows.length ; j++){
                let user = {
                    'name':  rows[j].user_name,
                    'value':  rows[j].user_name,
                    'id': rows[j].user_id
                }
                users.push(user);
            }
        }
        
        cb(null,users);
    })
}

const getOwnFeedback = function (user_name,cb){
    db.query("SELECT ui.* , fe.* FROM user_info ui JOIN feedback fe ON fe.user_feed_name = ui.user_name WHERE ui.user_name = '" + user_name + "'", function(err,rows){
        let feedbacks = [];
        if(err){
            
            cb(err,null)
        }else{
            var positiveCount = 0;
            var negativeCount = 0;
            if( rows && rows.length > 0){
                for(let j = 0; j < rows.length ; j++ ){
                    if( rows[j].evaluation == 0){
                        negativeCount++;
                    }else{
                        positiveCount++;
                    }
                    let  feedback = {
                        'user_feed_name' : rows[j].user_feed_name,
                        'comment': rows[j].comment,
                        'date_added': rows[j].date_added,
                        'evaluation': rows[j].evaluation,
                        'approved': rows[j].approved,
                        'platform': mapPlatform[rows[j].platform],
                        'evaluation_type': mapEvaluationType[rows[j].evaluation_type],
                    }
                    feedbacks.push(feedback);
                }
            }
            feedbacks['positiveCount'] = positiveCount;
            feedbacks['negativeCount'] = negativeCount;
            
            cb(null,feedbacks);
        }

    });
}

const updateNotificationPreference = function (user_id,notification,cb){
    db.query("UPDATE  user_info SET notification = " + notification + " WHERE user_id = " + user_id , function(err,row){
        if(err){
            
            cb(err,null)
        }else{
            
            cb(null,true);
        }

    })
}

const getCountPositiveFeedbacks = function (order, cb ){
    let countPositiveUsers = [];
    db.query("SELECT f.user_name, f.user_id, COUNT(*) as c , COUNT(f.evaluation) as positive , ui.* FROM feedback f JOIN user_info ui ON ui.user_id = f.user_id WHERE f.evaluation = 1 GROUP BY f.user_name ORDER BY c " + order ,function (err,rows){
        if(err){
            
            cb(err,null);
        }else{
            if( rows && rows.length > 0){
                for(let j = 0; j < rows.length ; j++){
                    let user = {
                        'username': rows[j].user_name,
                        'count': rows[j].c,
                        'userProfile': rows[j].user_profile,
                        'positive': rows[j].positive
                    }
                    countPositiveUsers.push(user);
                }
            }
            
            cb(null,countPositiveUsers);
        }
    })
}

const getCountNegativeFeedbacks = function (order, cb ){
    let countNegativeUsers = [];
    db.query("SELECT user_name, COUNT(*) as c , COUNT(evaluation) as negative FROM feedback WHERE evaluation = 0 GROUP BY user_name ORDER BY c " + order ,function (err,rows){
        if(err){
            
            cb(err,null);
        }else{
            if( rows && rows.length > 0){
                for(let j = 0; j < rows.length ; j++){
                    let user = {
                        'username': rows[j].user_name,
                        'count': rows[j].c,
                        'negative': rows[j].negative
                    }
                    countNegativeUsers.push(user);
                }
            }
            
            cb(null,countNegativeUsers);
        }
    })
}

const getUserInfo = function (user_id,cb){
    let user = {
        'user_id' : 0,
        'user_name': '',
        'user_profile': ''
    };
    db.query("SELECT * FROM user_info WHERE user_id = " + user_id ,function (err,result){
        if(err){
            console.log(err);
            cb(err,null);
        }else{
            if(result){
                console.log(result);
               user.user_id = result[0].user_id;
               user.user_name = result[0].user_name;
               user.user_profile = result[0].user_profile;
                cb(null,user);
            }
           cb(true,null)
        }
    })
}

const deleteUser = function (user_id,cb){
    if(user_id){
        db.query("DELETE FROM user_info WHERE user_id = '" + user_id+ "'" ,function (err,res){
            if(!err){
                db.query("DELETE FROM feedback WHERE user_id = '" + user_id + "'" ,function (err,res){
                    console.log(err);
                    console.log(res);
                    if(!err){
                        cb(null,true)
                    }else{
                        cb(err,null);
                    }
                })
            }else{
                cb(err,null);
            }
        })
    }else{
        cb(true,null)
    }
}

module.exports = {
    insertFeedback ,
    getUserRole ,
    getTotalUsers ,
    getEmailStructure ,
    approveFeedback,
    notApproveFeedback,
    getFeedback ,
    getFeedbackNeedApprove,
    deleteFeedback,
    getAllUsers,
    getOwnFeedback,
    updateNotificationPreference,
    getCountPositiveFeedbacks,
    getCountNegativeFeedbacks,
    getUserInfo,
    deleteUser
}
