const express = require('express');
const Router = express.Router();
const mongoose = require("mongoose");
const requirelogin = require('../middlewares/requirelogin');
const POST = mongoose.model("POST");

Router.get("/allposts", requirelogin, (req, res) => {
    POST.find()
        .populate("postedBy", "_id name photo")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(posts => res.json(posts))
        .catch(err => res.status(500).json({ error: "Internal server error" }));
});

// create post api 

Router.post("/createPost", requirelogin, (req, res) => {
    const { body, pic, id } = req.body;
    if (!body || !pic || !id) {
        return res.status(422).json({ error: "Please provide all the required fields" });
    }

    const post = new POST({
        body,
        photo: pic,
        postedBy: id
    });

    post.save()
        .then(result => res.json({ post: result }))
        .catch(err => res.status(500).json({ error: "Internal server error" }));
});

// myposts api 

Router.get("/myposts", requirelogin, (req, res) => {
    POST.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(myposts => {
            res.json(myposts)
        })

})

// like api 

Router.put("/like", requirelogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.user._id }
        }, {
            new: true
        }).populate("postedBy", "_id name photo")
            .exec();
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

// unlike api 

Router.put("/unlike", requirelogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user._id }
        }, {
            new: true
        }).populate("postedBy", "_id name photo")
            .exec();
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

// comment api

Router.put("/comment", requirelogin, async (req, res) => {
    try {
        const comment = {
            comment: req.body.text,
            postedBy: req.user._id
        };

        const updatedPost = await POST.findByIdAndUpdate(
            req.body.postId,
            { $push: { comments: comment } },
            { new: true }
        ).populate("comments.postedBy", "_id name photo")
            .populate("postedBy", "_id name")
            .exec();

        res.json(updatedPost); // Sending the comments of the updated post
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

// delete api

Router.delete("/deletePost/:postId", requirelogin, (req, res) => {
    // Check if postId is a valid ObjectId
    console.log("req.params === ", req.params);
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
        return res.status(422).json({ error: "Invalid postId" });
    }

    // Find the post by postId
    POST.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .then(post => {
            console.log("post11 === ", post);
            // Check if the post exists
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }

            // Check if the user is authorized to delete the post
            if (post.postedBy._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: "Unauthorized: You are not allowed to delete this post" });
            }

            // Remove the post
            return post.deleteOne();
        })
        .then(() => {
            // Send success response
            return res.json({ message: "Post successfully deleted" });
        })
        .catch(err => {
            // Handle any errors
            console.error("err deletePost", err);
            return res.status(500).json({ error: "Internal server error", err });
        });
});


// to show following post
Router.get("/myfollowingpost", requirelogin, (req, res) => {
    POST.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            console.error("Error fetching posts:", err);
            res.status(500).json({ error: "An error occurred while fetching posts." });
        });
});


module.exports = Router;
