//setup requirements
var express = require("express");
var app = express();
var bodyParser = require("body-parser");


//set options
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
		{name: "Salmon Creek", image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg"},
		{name: "Granite Hill", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
		{name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"}
]


//homepage
app.get("/", function(req, res){
	res.render("landing");
});

//campgrounds page
app.get("/campgrounds", function(req, res){
	res.render("campgrounds", {campgrounds: campgrounds});
});

//add campgrounds
app.post("/campgrounds", function(req, res){
	//get data from form and add
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	//redirect to campgrounds
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

//start the yelpcamp server
app.listen(3000, process.env.IP, function(){
	console.log("YelpCamp server is up!");
});