var express = require("express");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seed");
var methodOverride = require("method-override");

var campgroundsRoutes = require("./routes/campgrounds");
var commentsRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

//seedDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.DB_URL || "mongodb://localhost/yelp_camp");

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

app.listen(process.env.PORT || 3000, function() {

    console.log("running");
});