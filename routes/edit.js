const express = require('express');
const router = express.Router();
const util = require('../utils/queries.js');

// edit topic
router.put("/topic", async (req,res) => {
    const userId = req.user.userId;  // CHANGE TO GET USERID FROM JWT REQ.DECODED
    const topicId = req.body.topicId;
    const topic = req.body.topic;
    if (userId === undefined ||  typeof(userId) === "number") res.status(400).send({message:"userId incorrect format"});
    else if (topicId === undefined || typeof(topicId) === "string") res.status(400).send({message:"topicId incorrrect format"});
    else if (topic === undefined) res.status(400).send({message:"topic undefined"});
    else if (!(await util.isValid(topicId, "topic"))) res.status(400).send({message:"topicId invalid"});
    else if (!(await util.isOwner(topicId,userId, "topic"))) res.status(404).send({message:"you are not author of this"});
    else {
        util.updateTopicCommentReply(topicId, userId, topic, "topic")
        .then(() => {
            res.status(200).send({status:200, message:"topic edited"});
        })
        .catch((err)=> {res.status(400).send(err)})
        
    } 
});

// edit a comment
router.put('/comment', async (req, res) => {
    const commentId = req.body.commentId; 
    const userId = req.user.userId;  // CHANGE TO GET USERID FROM JWT REQ.DECODED
    const comment = req.body.comment; 
    if (userId === undefined || typeof(userId) === "number") res.status(400).send({message:"userId incorrect format"});
    else if (commentId === undefined || typeof(commentId) === "string") res.status(400).send({message:"commentId incorrect format"});
    else if (comment === undefined) res.status(400).send({message:"comment undefined"});
    else if (!(await util.isValid(commentId, "comment"))) res.status(400).send({message:"commentId invalid"});
    else if (!(await util.isOwner(commentId, userId, "comment"))) res.status(404).send({message:"you are not author of this"});
    else {
        util.updateTopicCommentReply(commentId, userId, comment, "comment")
        .then(() => {
            res.status(200).send({status:200, message:"comment edited"});
        })
        .catch((err) => {res.status(400).send(err)});
    }
});

// edit a reply
router.put('/reply', async (req, res) => {
    const replyId = req.body.replyId;
    const userId = req.user.userId; // CHANGE TO GET USERID FROM JWT REQ.DECODED
    const reply = req.body.reply;
    if (userId === undefined || typeof(userId) === "number") res.status(400).send({message:"userId incorrect format"});
    else if (replyId === undefined || typeof(replyId) === "string") res.status(400).send({message:"replyId incorrect format"});
    else if (reply === undefined) res.status(400).send({message:"reply undefined"});
    else if (!(await util.isValid(replyId, "reply"))) res.status(400).send({message:"replyId invalid"});
    else if (!(await util.isOwner(replyId, userId, "reply"))) res.status(404).send({message:"you are not author of this"});
    else {
        util.updateTopicCommentReply(replyId, userId, reply, "reply")
        .then(() => {
            res.status(200).send({status:200, message:"reply edited"});
        })
        .catch((err) => {res.status(400).send(err)});
    }
});

module.exports = router;