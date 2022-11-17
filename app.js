const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wikiDB');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model('Article', articleSchema);

app.get('/articles', function (req, res) {
  Article.find({}, function (err, articles) {
    if (!err) {
      res.send(articles);
    } else {
      res.send(err);
    }
  });
});

app.post('/articles', function (req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle.save(function (err) {
    if (!err) {
      res.send('Successfully added a new article');
    } else {
      res.send(err);
    }
  });
});

app.delete('/articles', function (req, res) {
  Article.deleteMany({}, (err) => {
    if (!err) {
      res.send('Successfully deleted all articles');
    } else {
      res.send(err);
    }
  });
});
////////////////////////////// Requests targeting A specific article ///////////////////////////////////////////////
app
  .route('/articles/:articleTitle')
  .get((req, res) => {
    const requestedTitle = req.params.articleTitle;
    Article.findOne({ title: requestedTitle }, (err, article) => {
      if (!err) {
        res.send(article);
      } else {
        res.send(err);
      }
    });
  })
  .put((req, res) => {
    const requestedTitle = req.params.articleTitle;
    Article.replaceOne(
      { title: requestedTitle },
      { title: req.body.title, content: req.body.content },
      function (err, acticles) {
        if (!err) {
          res.send('Successfully updated article');
        } else {
          console.log(err);
        }
      },
    );
  })
  .patch((req, res) => {
    const requestedTitle = req.params.articleTitle;
    Article.updateOne({ title: requestedTitle }, { $set: req.body }, function (err, article) {
      if (!err) {
        res.send('Successfully updated article');
      } else {
        console.log(err);
      }
    });
  })
  .delete((req, res) => {
    const requestedTitle = req.params.articleTitle;
    Article.deleteOne({ title: requestedTitle }, function (err, article) {
      if (!err) {
        res.send('Sucessfully Deleted');
      } else {
        console.log(err);
      }
    });
  });

app.listen(5000, function () {
  console.log('Server started at port 5000');
});
