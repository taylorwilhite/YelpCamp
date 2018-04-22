//setup requirements
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require ("./seeds");


//set options
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp")
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//homepage
app.get("/", function(req, res){
	res.render("landing");
});

//INDEX: campgrounds page
app.get("/campgrounds", function(req, res){
	//get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

//CREATE: add campgrounds
app.post("/campgrounds", function(req, res){
	//get data from form and add
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	//create new campground and save to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});	
});

//NEW: show form to create campground
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

//SHOW: show info on campground
app.get("/campgrounds/:id", function(req, res){
	//find campground with ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template with info
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// ====================
// COMMENTS ROUTES
// ====================

//NEW
app.get("/campgrounds/:id/comments/new", function(req, res){
	//find campground by ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

//CREATE
app.post("/campgrounds/:id/comments", function(req, res ){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//start the yelpcamp server
app.listen(3000, process.env.IP, function(){
	console.log("YelpCamp server is up!");
});