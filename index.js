const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 5000;
const projects = require("./projects.json");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const filter = req.query.filter;
  if (filter) {
    const filteredProjects = projects.map((project) => {
      if (
        project.title.toUpperCase().indexOf(filter.toUpperCase()) > -1 ||
        project.text.toUpperCase().indexOf(filter.toUpperCase()) > -1
      ) {
        return {
          ...project,
          isVisiable: true,
        };
      }
    });
    res.send(filteredProjects);
  } else {
    res.send(projects.map((project) => ({ ...project, isVisiable: true })));
  }
});

app.post("/login", (req, res) => {
  const { login, password } = req.body;
  if (login === "admin" && password === "1234") {
    res.send({
      isLoggedIn: true,
    });
  } else {
    res.send({
      isLoggedIn: false,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
