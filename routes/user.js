const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requirelogin = require('../middlewares/requirelogin');


// to get user profile  
Router.get("/user/:id", (req, res) => {
    // console.log("res === ", res);
    USER.findOne({ _id: req.params.id })
        // .select("-password")
        .then(user => {
            // console.log("user === ", user);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            POST.find({ postedBy: req.params.id })
                .populate("postedBy", "_id")
                .exec()
                .then(posts => {
                    res.status(200).json({ user, posts });
                })
                .catch(err => {
                    console.error("Error fetching posts:", err);
                    res.status(500).json({ error: "Internal server error" });
                });
        })
        .catch(err => {
            console.error("Error fetching user:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

// to follow user
Router.put("/follow", requirelogin, (req, res) => {
    console.log("req.body.followId === ", req.body.followId);
    USER.findByIdAndUpdate(req.body.followId, { $push: { followers: req.user._id } }, { new: true })
        .then(result => {
            console.log("follow result === ", result);
            // Update the following list of the current user
            return USER.findByIdAndUpdate(req.user._id, { $push: { following: req.body.followId } }, { new: true });
        })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        });
});


Router.put("/unfollow", requirelogin, (req, res) => {
    console.log("req.body.followId === ", req.body.followId);
    USER.findByIdAndUpdate(req.body.followId, { $pull: { followers: req.user._id } }, { new: true })
        .then(result => {
            console.log("follow result === ", result);
            // Update the following list of the current user
            return USER.findByIdAndUpdate(req.user._id, { $pull: { following: req.body.followId } }, { new: true });
        })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        });
});

// to upload profile pic
Router.put("/uploadProfilePic", requirelogin, async (req, res) => {
    console.log("req.body === ", req.body);
    const { pic } = req.body;

    // if (!pic) {
    //     return res.status(400).json({ error: "Photo URL is required" });
    // }

    try {
        console.log("pic === ", pic);
        const result = await USER.findByIdAndUpdate(
            req.user._id,
            { $set: { photo: pic } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }


        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});


module.exports = Router;