const db = require('../connection/mysqldbconnect');

async function updateTopicCommentReply(topicCommentReplyId, userId, theTopicCommentReply, topicCommentReply) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE Topics SET topic = ? WHERE topicId = ? AND userId = ?;`;
        if (topicCommentReply === "comment") 
        sql = `UPDATE Comments SET theComment = ? WHERE commentId = ? AND userId = ?;`;
        else if (topicCommentReply === "reply")
        sql = `UPDATE Replies SET reply = ? WHERE replyId = ? AND userId = ?;`;
        db.query(sql, [theTopicCommentReply, topicCommentReplyId, userId], (err, result) => {
            if (err) reject(err);
            else resolve();        
        })
    });
}

async function isOwner(topicCommentReplyId, userId, topicCommentReply) {
    return new Promise((resolve, reject) => {
        let sql = "";
        if (topicCommentReply === "topic") {
            sql = `SELECT * FROM Topics WHERE topicId = ? AND userId = ?;`;
        }else if (topicCommentReply === "comment") {
            sql = `SELECT * FROM Comments WHERE commentId = ? AND userId = ?;`;
        } else if (topicCommentReply === "reply") {
            sql = `SELECT * FROM Replies WHERE replyId = ? AND userId = ?;`;
        } else {
            console.log("should never goes here");
        }
        db.query(sql, [topicCommentReplyId, userId], (err, result)=> {
            if (err) reject(err);
            else {
                if (result.length === 1) resolve(true);
                else if (result.length < 1) resolve(false);
                else reject("dulicate primary key");  
            }
        });
    });
}

async function isValid(id, userTopicCommentReply) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM Topics WHERE topicId = ?;`;
        if (userTopicCommentReply === "comment")
            sql = `SELECT * FROM Comments WHERE commentId = ?;`;
        else if (userTopicCommentReply === "reply")
            sql = `SELECT * FROM Replies WHERE replyId = ?;`;
        else if (userTopicCommentReply === "user") 
            sql = `SELECT * FROM Users WHERE userId = ?`;
        db.query(sql, [id], (err, result) => {
            if (err) reject(err);
            else {
                if (result.length === 1) resolve(true);
                else if (result.length < 1) resolve(false);
                else reject("err: dublicate primary key");
            }
        })
    }); 
}

async function isValidLike(userId, topicCommentReplyId, topicCommentReply){
    return new Promise((resolve, reject) => {
        if (!(topicCommentReply === 'topic' || topicCommentReply === 'comment' || topicCommentReply === 'reply'))
            reject("topicCommentReply must be topic comment or reply");
        let sql = `SELECT * FROM LikesTopic WHERE userId = ? AND topicId = ?`;
        if (topicCommentReply === 'comment')
            sql = `SELECT * FROM LikesComment WHERE userId = ? AND commentId = ?`;
        else if (topicCommentReply === 'reply')
            sql = `SELECT * FROM LikesReply WHERE userId = ? AND replyId = ?`;
        db.query(sql, [userId, topicCommentReplyId], (err, result) => {
            if (err) reject (err);
            else {
                if (result.length === 1) resolve(true);
                else if (result.length < 1) resolve(false);
                else reject('err: dublicate primary key');
            }
        })
    })
}

async function insertTopicCommentReply(topicCommentId, userId, theTopicCommentReply, topicCommentReply) {
    return new Promise((resolve, reject) =>{
        let sql = `INSERT INTO Comments (userId, theComment, topicId) VALUES(?, ?, ?);`;
        let data = [userId, theTopicCommentReply, topicCommentId];
        if (topicCommentReply === "topic") {
            sql = `INSERT INTO Topics (userId, topic) VALUES (?, ?);`;
            data = [userId, theTopicCommentReply];
        } else if (topicCommentReply === "reply") 
            sql = `INSERT INTO Replies (userId, reply, commentId) VALUES(?, ?, ?);`;
        db.query(sql, data, (err, result) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function insertUser(userId, firstName, lastName) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Users (userId, firstName, lastName) VALUES(?, ?, ?);`;
        const data = [userId, firstName, lastName];
        db.query(sql, data, (err, result) => {
            if (err) reject(err);
            else resolve();
        })
    })
}

async function insertLikeTopicCommentReply(userId, topicCommentReplyId, topicCommentReply) { 
    return new Promise((resolve, reject) => {
        if (!(topicCommentReply === "topic" || topicCommentReply === "comment" || topicCommentReply === "reply"))
            reject("topicCommentReply must be topic comment or reply");
        let sql = 'INSERT INTO LikesTopic (topicId, userId) VALUES(?,?);';
        if (topicCommentReply === 'comment') sql = 'INSERT INTO LikesComment (commentId, userId) VALUES(?,?);';
        else if (topicCommentReply === 'reply') sql = 'INSERT INTO LikesReply (replyId, userId) VALUES(?,?);';
        db.query(sql, [topicCommentReplyId, userId], (err, result) => {
            if (err) reject(err);
            else resolve();
        })
    })
}


// same function as in insert edit...
async function getCommentReplyCount(topicCommentId, isReply) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT count(*) as count
        FROM Comments 
        WHERE topicId = ?;`;
        if (isReply) {
            sql = `SELECT count(*) as count
            FROM Replies 
            WHERE commentId = ?;`;
        }
        db.query(sql, [topicCommentId], (err, result) => {
            if (err) reject(err);
            else resolve(result[0].count); // the number of comment/reply per topic/comment
        });
    })
}

async function getLikesTopicCommentReplyCount(topicCommentReplyId, topicCommentReply) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT count(*) as count FROM LikesTopic WHERE topicId =?'
        if (topicCommentReply === 'comment') sql = 'SELECT count(*) as count FROM LikesComment WHERE commentId = ?;';
        else if (topicCommentReply === 'reply') sql = 'SELECT count(*) as count FROM LikesReply WHERE replyId = ?;';
        db.query(sql, [topicCommentReplyId], (err, result) => {
            if (err) reject(err);
            else resolve(result[0].count); // number of likes per Topic/comment/reply
        })
    })
}

// same function as in insert edit
async function updateCommentReplyCount(topicCommentId, count, isComment) {
    return new Promise( (resolve, reject) => {
        let sql = `UPDATE Topics
        SET numComments = ?
        WHERE topicId = ?;`;
        if (isComment) {
            sql =  `UPDATE Comments
            SET numReply = ?
            WHERE commentId = ?;`;
        }
        db.query(sql, [count, topicCommentId], (err, result) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function updateLikesTopicCommentReplyCount(topicCommentReplyId, count, topicCommentReply) {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE Topics SET numLikes = ? WHERE topicId = ?;';
        if (topicCommentReply === 'comment') sql =  'UPDATE Comments SET numLikes = ? WHERE commentId = ?;';
        else  if (topicCommentReply === 'reply') sql =  'UPDATE Replies SET numLikes = ? WHERE replyId = ?;';
        db.query(sql, [count, topicCommentReplyId], (err, result) => {
            if (err) reject(err);
            else resolve();
        })
    })
}

async function getTopicCommentId(commentReplyId, userId, isReply) {
    return new Promise( (resolve, reject) => {
        let sql = `SELECT topicId FROM Comments WHERE commentId = ?;`;
        if (isReply) {
            sql = `SELECT commentId FROM Replies WHERE replyId = ?;`;
        }
        db.query(sql, [commentReplyId], (err, result) => {
            if (err) reject(err);
            if (result.length === 1){
                let count = result[0].topicId;
                if (isReply) count = result[0].commentId;
                resolve(count);
            } else if (result.length < 1) {
                if (!isReply) reject("Topic not found");
                else reject("comment not found");
            } else {
                reject("error: mutiple parent found");
            }
        });
    });
}

async function deleteTopicCommentReply(topicCommentReplyId, userId, topicCommentReply) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM Topics WHERE topicId = ? AND userId = ?;`;
        if (topicCommentReply === "comment") sql = `DELETE FROM Comments WHERE commentId = ? AND userId = ?;`;
        else if (topicCommentReply === "reply") 
            sql = `DELETE FROM Replies WHERE replyId = ? AND userId = ?;`;
        db.query(sql, [topicCommentReplyId, userId], (err, result) => {
            if (err) reject(err);
            else {
                if (result.affectedRows == 1) resolve();
                else if (result.affectedRows < 1) reject("no corresponding row found");
                else reject("dublication primary keys")
            }
        });
    })
}

async function deleteLikeTopicCommentReply(userId, topicCommentReplyId, topicCommentReply) {
    return new Promise((resolve, reject) => {
        if (!(topicCommentReply === "topic" || topicCommentReply === "comment" || topicCommentReply === "reply"))
            reject("topicCommentReply must be topic comment or reply");
        let sql = 'DELETE FROM LikesTopic WHERE topicId = ? AND userId = ?;';
        if (topicCommentReply === 'comment') sql = 'DELETE FROM LikesComment WHERE commentId = ? AND userId = ?;';
        else if (topicCommentReply === 'reply') sql = 'DELETE FROM LikesReply WHERE replyId =  ? AND userId = ?;';
        db.query(sql, [topicCommentReplyId, userId], (err, result) => {
            if (err) reject(err);
            else resolve();
        })
    })
}

async function getTopicById(userId,topicId) { // REFACTOR COMMENT AND REPLIES
    return new Promise((resolve, reject) => {
        const sql = `SELECT Topics.topicId as topicId, Topics.userId as userId, 
        topic, numLikes, numComments, timePost, firstName, 
        lastName, CASE WHEN LikesTopic.TopicId IS NOT NULL THEN true ELSE false END as liked
                        FROM Topics
                        LEFT JOIN Users
                        ON Topics.userId = Users.userId
                        LEFT JOIN 
                        (SELECT * FROM LikesTopic WHERE userId = ?) as LikesTopic
                        on LikesTopic.topicId = Topics.topicId
                        WHERE Topics.topicId = ?`;
        db.query(sql, [userId, topicId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}



module.exports = {
    updateCommentReplyCount, 
    getCommentReplyCount,
    isValid,
    getTopicCommentId,
    deleteTopicCommentReply,
    isOwner,
    insertTopicCommentReply,
    updateTopicCommentReply,
    getTopicById,
    insertUser,
    updateLikesTopicCommentReplyCount,
    getLikesTopicCommentReplyCount,
    insertLikeTopicCommentReply,
    deleteLikeTopicCommentReply,
    isValidLike
};