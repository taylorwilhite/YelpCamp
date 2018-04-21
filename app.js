//setup requirements
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


//set options
mongoose.connect("mongodb://localhost/yelp_camp")
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);


//homepage
app.get("/", function(req, res){
	res.render("landing");
});

//campgrounds page
app.get("/campgrounds", function(req, res){
	//get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds", {campgrounds: allCampgrounds});
		}
	});
});

//add campgrounds
app.post("/campgrounds", function(req, res){
	//get data from form and add
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	//create new campground and save to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});	
});

app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

//start the yelpcamp server
app.listen(3000, process.env.IP, function(){
	console.log("YelpCamp server is up!");
});