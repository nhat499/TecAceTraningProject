const express = require('express');
const router = express.Router();
const db = require('../connection/mysqldbconnect');
const util = require('../utils/queries.js')

// get all topic
router.get('/topics', (req, res, next) => {
  
  const sql = `SELECT Topics.topicId as topicId, Topics.userId as userId, 
              topic, numLikes, numComments, timePost, firstName, 
              lastName, CASE WHEN LikesTopic.TopicId IS NOT NULL THEN true ELSE false END as liked
				      FROM Topics
                LEFT JOIN Users
                ON Topics.userId = Users.userId
                LEFT JOIN 
                (SELECT * FROM LikesTopic WHERE userId = ?) as LikesTopic
                on LikesTopic.topicId = Topics.topicId
                WHERE topic LIKE ?
                ORDER BY timePost DESC, numLikes DESC;`; // DO SAOME THING FOR COMMNET/ REPLIES AFTER LUNCH
    let userId = '';
    let search = '%%';
    if (req.query.search) search = `%${req.query.search}%`;
    if (req.user) userId = req.user.userId;
    db.query(sql, [userId,search],(err, result) => {
      if (err) next();
      else res.status(200).send({
        user: req.user, 
        result: result});
    })
  },(req, res) => {
    res.status(404).send({
      status: 400,
      Description: "Server problem"
    })
});

router.get('/topic/:topicId', async (req, res)=> {
  
  const topicId = req.params.topicId;
  let userId = '';
  if (req.user) userId = req.user.userId;
  if (topicId === undefined) res.status(400).send("topicId undefined");
  else if (!(await util.isValid(topicId,"topic"))) res.status(400).send("Invalid topic");
  else {
    util.getTopicById(userId, topicId)
    .then((data) => {res.status(200).send({user:req.user, data:data})});
  }
})

// get all comment for a topic
router.get('/comment/:topicId', (req, res, next) => {
  const topicId = req.params.topicId;
  let userId = '';
  if (req.user) userId = req.user.userId;
  if (topicId === undefined) res.status(400).send({message:"topicId undefined"});
  else {
    const sql = `SELECT Comments.theComment, Comments.commentId, Comments.topicId, Users.userId, Comments.numLikes, 
    Comments.numReply, Comments.timePost, Users.firstName, Users.lastName,
    CASE WHEN LikesComment.userId IS NOT NULL THEN true ELSE false END as liked
     FROM Comments 
                    LEFT JOIN Users
                    ON Comments.userId = Users.userId
                    LEFT JOIN
                    (SELECT * FROM LikesComment WHERE userId =?) as LikesComment
                    on LikesComment.commentId = Comments.commentId
                    WHERE topicId = ?
                    ORDER BY timePost DESC;`;
    db.query(sql, [userId, topicId] ,(err, result) => {
      if (err) res.status(400).send(err);
      else res.status(200).send(result);
    })
  }
});


// get replies for a comment
router.get('/reply/:commentId', (req, res, next) => {
  let userId = '';
  if (req.user) userId = req.user.userId;
  const commentId = req.params.commentId;
  const sql = `SELECT Replies.replyId, Replies.reply, 
  Replies.commentId, Users.userId, Replies.numLikes, Replies.timePost, 
  Users.firstName, Users.lastName, 
  case WHEN LikesReply.userId IS NOT NULL THEN true ELSE false END as liked
    FROM Replies
      LEFT JOIN Users
      ON Users.userId = Replies.userId
      LEFT JOIN
      (SELECT * FROM LikesReply WHERE userId = ?) as LikesReply
      on LikesReply.replyId = Replies.replyId
      WHERE Replies.commentId = ?;`;
  db.query(sql, [userId, commentId], (err, result) => {
    if (err) res.status(200).send(err);
    else res.status(200).send(result);
  });
});

// get userProfile


// get all user (not needed but for testing purposes)
router.get('/users', (req, res) => {
  const sql = 'SELECT * FROM Users';
  db.query(sql, (err, result) => {
    if (err) next();
    res.status(200).send(result);
  })
})

module.exports = router;