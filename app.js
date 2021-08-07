const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view-engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////// Request Targeting all Articles ///////////////////////////////

app.route("/articles")

.get(function(req, res) {
    Article.find(function(err, foundArticles) {
        if(!err) {
            res.send(foundArticles);
        }
        else {
            res.send(err);
        }
    })
})

.post(function(req, res) {
    const newArticle = new Article({
        title : req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err) {
        if(!err) {
            res.send("Successfully saved the data to DB.");
        }
        else {
            res.send(err);
        }
    })
})

.delete(function(req, res) {
    Article.deleteMany(function(err) {
        if(!err) {
            res.send("Successfully deleted all the articles.");
        }
        else {
            res.send(err);
        }
    });
});




////////////////////////////// Request Targeting a specific Article //////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        if(!err) {
            if(foundArticle) {
                res.send(foundArticle);
            }
            else  {
                res.send("No article found for the requested title.")
            }
        }
        else {
            res.send(err);
        }
    });
})

.put(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err) {
            if(!err) {
                res.send("Successfuly updated the article.");
            }
            else {
                res.send(err);
            }
        }
    );
})

.patch(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if(!err) {
                res.send("Successfully updated the selected document.");
            }
            else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res) {
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err) {
            if(!err) {
                res.send("Successfully deleted the selected document.");
            }
            else {
                res.send(err);
            }
        }
    )
});


app.listen(3000, function(req, res) {
    console.log("Server has started at port 3000.");
});