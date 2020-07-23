require("dotenv").config();  
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const aboutDefault = "This Project was part of a WebDev Bootcamp. It is created, delpoyed, maintained by Shridhar-t. All the data on this Blog Website is persisted on a database that is mainted by Shridhar-t";
const contactDefault = "Reach out to me from the GitHub page";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect(String(process.env.SECRET), {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const Post = mongoose.model("Post", {
  title: String,
  body: String,
  author: String
})

app.get("/", (req, res) => {
  Post.find((err, posts) => {
    if (err) {
      console.log(err);
    } else if (posts.length === 0) {
      const defaultPost = new Post({
        title: "Blog-Website",
        body: "Welcome! Look around and if you want to add a Blog press that Post button",
        author: "Shridhar-t"
      });
      // defaultPost.save((err, toBeSaved) => {
      //   if (!err) {

      //   } else {

      //   }
      // });by using callbacks
      defaultPost.save().then((message) => {
        res.redirect("/");
      }).catch((err) => {
        console.log(err);
      })//by promises

    } else {
      res.render('home', {
        posts: posts
      })
    }
  })
});
app.get("/about", (req, res) => {
  res.render("about", {
    aboutDefault: aboutDefault
  });
});
app.get("/contact", (req, res) => {
  res.render("contact", {
    contactDefault: contactDefault
  });
});
app.get("/compose", (req, res) => {
  res.render("compose");
});
app.get("/posts/:id", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      posts.forEach((post) => {
        if (post._id == req.params.id) {
          res.render("post", {
            title: post.title,
            post: post.body,
            author:post.author
          })
        }
      })
    }
  })
})
app.post("/compose", (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    body: req.body.post,
    author:req.body.author
  })
  newPost.save((err,toBeSaved)=>{
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  });
  
})


app.listen(process.env.PORT || 3000, () => {
  console.log("server started on port "+(process.env.PORT!==undefined?process.env.PORT:3000));
});
