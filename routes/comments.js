var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
// 	find campground by ID
	Campground.findById(req.params.id, (err, campground) => {
		if(err || !campground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// Comments create
router.post("/", middleware.isLoggedIn, (req,res) => {
	//lookup campground using ID
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("/campgrounds");
		} else {
			console.log(req.body.comment);
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log(err);
				} else {
					//Add username and id to comments
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//Save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// COMMENT EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
			if(err || !foundCampground) {
			req.flash("error", "Campground not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err) {
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// COMMENT DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;