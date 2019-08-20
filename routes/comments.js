var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { camp: camp });
        }
    });
});

router.post("/", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, com) {
                com.author.id = req.user._id;
                com.author.username = req.user.username;
                com.save();
                camp.comments.push(com);
                camp.save();
                res.redirect("/campgrounds/" + camp._id);
            });
        }
    });
});

router.get("/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function(err, com) {
        if (err) {
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.render("comments/edit", { campid: req.params.id, com: com });
        }
    });
});

router.put("/:comment_id", function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, com) {
        if (err) {
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


router.delete("/:comment_id", function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, com) {
        if (err) {
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;