var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX: campgrounds page
router.get("/", function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author};
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
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW: show info on campground
router.get("/:id", function(req, res){
	//find campground with ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "campground not found");
			res.redirect("back");
		} else {
			//render show template with info
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT Campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res){		
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			//redirect to show page
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;