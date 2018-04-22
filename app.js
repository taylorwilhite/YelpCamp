//setup requirements
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require ("./seeds");


//set options
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp")
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

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
			res.render("index", {campgrounds: allCampgrounds});
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
	res.render("new.ejs");
});

//SHOW: show info on campground
app.get("/campgrounds/:id", function(req, res){
	//find campground with ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template with info
			res.render("show", {campground: foundCampground});
		}
	});
});

//start the yelpcamp server
app.listen(3000, process.env.IP, function(){
	console.log("YelpCamp server is up!");
});