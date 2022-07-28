const express = require('express');
const router = express.Router();
const db = require('../connection/mysqldbconnect');
const util = require('../utils/queries.js');

// insert topic, user id, name of topic
router.post('/topic', async (req,res, next) => {
    const userId = req.user.userId;  // CHANGE TO GET USERID FROM JWT req.user
    const topic = req.body.topic;
    if (userId === undefined || !(typeof(userId) === "string")) res.status(400).send({message:"userId incorrect format"});
    else if (topic === undefined) res.status(400).send({message:"topic undefined"});
    else if (!(await util.isValid(userId, "user"))) res.status(400).send({message:"not a user"});
    else {
        util.insertTopicCommentReply(undefined, userId, topic, "topic")
        .then(()=> { res.status(200).send({status:200,message:"topic inserted"})})
        .catch((err) => { res.status(500).send({status:500, message: err})});
    }
});

// insert comments, topicId, userId, theComment
// update number of comment of topicId
router.post('/comment', async (req, res) => {
    const topicId = req.body.topicId; // check if topic exsist
    const userId = req.user.userId;  // CHANGE TO GET USERID FROM JWT REQ.DECODED
    const comment = req.body.comment; // comment not null
    if (topicId === undefined) res.status(400).send({message:"topicId Undefined"});
    else if (userId === undefined) res.status(400).send({message:"userId Undefined"});
    else if (comment === undefined) res.status(400).send({message:"comment undefined"});
    else if (!(await util.isValid(topicId, "topic"))) res.status(400).send({message:"topicId invalid"});
    else if (!(await util.isValid(userId, "user"))) res.status(400).send({message:"not a user"});
    else {
        try {
            await util.insertTopicCommentReply(topicId, userId, comment, "comment");
            const count = await util.getCommentReplyCount(topicId, false);
            await util.updateCommentReplyCount(topicId, count, false);
            res.status(200).send({
                status:200,
                message:"comment posted"});
        } catch (err) {
            res.status(500).send({status: 500, message: err});
        }
    }
    
});

// insert a reply userId, commentId, reply
router.post('/reply', async (req, res, next) => {
    const userId = req.user.userId; 
    const commentId = req.body.commentId; 
    const reply = req.body.reply; 
    if (userId === undefined) res.status(400).send({message:"userId Undefined"});
    else if (commentId === undefined) res.status(400).send({message:"commentId undefined"});
    else if (reply === undefined) res.status(400).send({message:"reply undefined"});
    else if (!(await util.isValid(userId, "user"))) res.status(400).send({message:"not a user"})
    else if (!(await util.isValid(commentId, "comment"))) res.status(400).send({message:"commentId Invalid"});
    else {
        try {
            await util.insertTopicCommentReply(commentId, userId, reply, "reply");
            const count = await util.getCommentReplyCount(commentId, true);
            await util.updateCommentReplyCount(commentId, count, true);
            res.status(200).send({
                status: 200,
                message:"reply posted"});
        } catch (err) {
            res.status(500).send({status:500, message:err});
        }
    }
});

// insert a like
router.post('/like', async (req, res) => {
    const userId = req.user.userId;
    const topicCommentReplyId = req.body.topicCommentReplyId;
    const topicCommentReply = req.body.topicCommentReply;
    if (topicCommentReply === undefined) res.status(400).send({message:"specify Topic Comment or Reply"})
    else if (topicCommentReplyId === undefined) res.status(400).send({message:"topicCommentReplyId undefined"})
    else if (!(await util.isValid(userId, "user"))) res.status(400).send({message:"not a user"})
    else if (!(await util.isValid(topicCommentReplyId, topicCommentReply))) res.status(400).send({message:"topicCommentReplyId Invalid"});
    else if (await util.isValidLike(userId, topicCommentReplyId, topicCommentReply)) res.status(400).send({message:"you have already liked this"});
    else {
        try {
            await util.insertLikeTopicCommentReply(userId, topicCommentReplyId, topicCommentReply);
            const count = await util.getLikesTopicCommentReplyCount(topicCommentReplyId, topicCommentReply);
            await util.updateLikesTopicCommentReplyCount(topicCommentReplyId, count, topicCommentReply);
            res.status(200).send({status:200, message:"Liked"});
        } catch (err) {res.status(500).send({status:500, message:err});}
    }
})

module.exports = router;