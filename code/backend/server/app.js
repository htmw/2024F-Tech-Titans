const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

let articles = [
  {
    id: 1,
    subject: "Math",
    title: "Introduction to Algebra",
    content: "Algebra is a branch of mathematics...",
    difficulty: "medium",
  },
  {
    id: 2,
    subject: "Science",
    title: "The Solar System",
    content: "Our solar system consists of...",
    difficulty: "easy",
  },
  {
    id: 3,
    subject: "History",
    title: "World War II",
    content: "World War II was a global conflict...",
    difficulty: "hard",
  },
];

let reviewLater = [];

app.get("/subjects", (req, res) => {
  const subjects = [...new Set(articles.map((article) => article.subject))];
  res.json(subjects);
});

app.get("/articles/:subject", (req, res) => {
  const subjectArticles = articles.filter(
    (article) =>
      article.subject.toLowerCase() === req.params.subject.toLowerCase(),
  );
  res.json(subjectArticles);
});

app.get("/search", (req, res) => {
  const { subject, query } = req.query;
  let results = articles;

  if (subject) {
    results = results.filter(
      (article) => article.subject.toLowerCase() === subject.toLowerCase(),
    );
  }

  if (query) {
    results = results.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase()),
    );
  }

  res.json(results);
});

app.post("/mark-for-review", (req, res) => {
  const { articleId, type } = req.body;
  const article = articles.find((a) => a.id === articleId);

  if (article) {
    const reviewItem = { ...article, reviewType: type };
    reviewLater.push(reviewItem);
    res.json({ message: "Article marked for review", reviewItem });
  } else {
    res.status(404).json({ message: "Article not found" });
  }
});

app.get("/review-later", (req, res) => {
  res.json(reviewLater);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
