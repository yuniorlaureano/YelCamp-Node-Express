var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get('/', function(req, res) {
    Campground.find(function(err, datas) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: datas });
        }
    });
});

router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new.ejs");
});

router.get("/:id", function(req, res) {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show.ejs", { campground: data });
        }
    });
});


router.post("/", isLoggedIn, function(req, res) {

    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create({
        name: name,
        image: image,
        description: description,
        author
    }, function(err, created) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/:id/edit", function(req, res) {
    Campground.findById(req.params.id).exec(function(err, data) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit.ejs", { campground: data });
        }
    });
});

router.put("/:id", function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground).exec(function(err, data) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, data) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
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