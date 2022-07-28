
const express = require('express');
const router = express.Router();
const db = require('../connection/mysqldbconnect');
const util = require('../utils/queries.js');

router.delete('/reply', async (req, res) => {
    const userId = req.user.userId; // CHANGE TO GET USERID FROM JWT REQ.DECODED
    const replyId = req.body.replyId; // check valid reply id
    if (userId === undefined || typeof(userId) === "number") res.status(400).send({message:"userId incorrect format"});
    else if (replyId === undefined || typeof(replyId) === "string") res.status(400).send({message:"replyId incorrect format"});
    else if (!(await util.isValid(replyId, "reply"))) res.status(400).send({message:"invaild replyId"});
    else if (!(await util.isOwner(replyId, userId, "reply"))) res.status(404).send({message:"you are not author of this"});
    else {
        try {
            const commentId = await util.getTopicCommentId(replyId, userId, true);
            await util.deleteTopicCommentReply(replyId, userId, "reply");
            const count = await util.getCommentReplyCount(commentId, userId, true);
            await util.updateCommentReplyCount(commentId, count, true);
            res.status(200).send({status:200, message:"reply deleted"});
        } catch (err) {
            res.status(400).send(err);
        }
    }
})

router.delete('/comment', async (req, res) => {
    const commentId = req.body.commentId;
    const userId = req.user.userId;
    if (commentId === undefined || typeof(commentId) === "string") res.status(400).send({message:"commentId incorrect format"}); 
    else if (userId === undefined || typeof(userId) === "number") res.status(400).send({message:"userId incorrect format"});
    else if (!(await util.isValid(commentId, "comment"))) res.status(400).send({message:"comment invalid"});
    else if (!(await util.isOwner(commentId, userId, "comment"))) res.status(404).send({message:"you are not author of this"});
    else {
        try {
            const topicId = await util.getTopicCommentId(commentId, userId, false);
            await util.deleteTopicCommentReply(commentId,userId, "comment");
            const count = await util.getCommentReplyCount(topicId, false);
            await util.updateCommentReplyCount(topicId, count, false);
            res.status(200).send({status: 200, message:"comment deleted"});
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

router.delete('/topic', async (req, res) => {
    const topicId = req.body.topicId;
    const userId = req.user.userId;
    if (topicId === undefined || typeof(topicId) === "string") res.status(400).send({message:"topicId incorrect format"});
    else if (userId === undefined || typeof(userId) === "number") res.status(400).send({message:"userId incorrect format"});
    else if (await util.isOwner(topicId, userId, "topic")) {
        util.deleteTopicCommentReply(topicId, userId, "topic")
        .then(()=> {res.status(200).send({status:200, message:"topic deleted"})})
        .catch((err) => {res.status(400).send(err)});
    } else {
        res.status(404).send({message:"you are not author of this"});
    }
});

router.delete('/like', async (req, res) => {
    const userId = req.user.userId;
    const topicCommentReplyId =  req.body.topicCommentReplyId;
    const topicCommentReply = req.body.topicCommentReply;
    if (topicCommentReply === undefined) res.status(400).send({message:"specify topic comment or reply"});
    else if (topicCommentReplyId === undefined) res.status(400).send({message:"topicCommentReplyId undefined"});
    else if (!(await util.isValid(userId, "user"))) res.status(400).send({message:"not a user"});
    else if (!(await util.isValid(topicCommentReplyId, topicCommentReply))) res.status(400).send({message:"topicCommentReplyId Invalid"});
    else if (!(await util.isValidLike(userId,topicCommentReplyId, topicCommentReply))) res.status(400).send({message:"Like does not exist"});
    else {
        try {
            await util.deleteLikeTopicCommentReply(userId,topicCommentReplyId, topicCommentReply);
            const count = await util.getLikesTopicCommentReplyCount(topicCommentReplyId, topicCommentReply);
            await util.updateLikesTopicCommentReplyCount(topicCommentReplyId, count, topicCommentReply);
            res.status(200).send({status:200, message:"unLiked"});
        } catch (err) {
            console.log(err);
            res.status(500).send({status:500, message:err});}
    }
})

module.exports = router;