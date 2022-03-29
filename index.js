const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 5000;
const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:Decorate712@localhost:5432/springdb");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const validate = require("./middelware/validation");
const auth = require("./middelware/auth");
const cookieParser = require("cookie-parser");

dotenv.config();

const generateToken = (userName) => {
  const accessToken = jwt.sign({ userName }, process.env.TOKEN_SECRET, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(
    { userName },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", auth, (req, res) => {
  const filter = req.query.filter;
  db.any("SELECT * FROM projects").then((projects) => {
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
      res.send(
        projects.map((project) => {
          return {
            ...project,
            isVisiable: true,
          };
        })
      );
    }
  });
});

app.post("/signup", validate, (req, res) => {
  const { userName, firstName, lastName, age, password } = req.body;
  const tokens = generateToken(userName);
  db.none(
    `INSERT INTO users(username,firstname,lastname,age,password) VALUES($1,$2,$3,$4,$5);`,
    [userName, firstName, lastName, age, password]
  )
    .then(() => {
      console.log("User added");
      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
      res.json({
        ...tokens,
        user: {
          userName,
          firstName,
          lastName,
          age,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("User with this username already exists");
    });
});

app.post("/login", (req, res) => {
  db.one("SELECT * FROM users WHERE username = $1", req.body.userName)
    .then((user) => {
      if (user.password === req.body.password) {
        const tokens = generateToken(user.username);
        res.cookie("refreshToken", tokens.refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
        });
        res.json({
          ...tokens,
          user: {
            userName: user.userName,
            firstName: user.firstname,
            lastName: user.lastname,
            age: user.age,
          },
        });
      } else {
        res.status(401).send("Wrong password");
      }
    })
    .catch((err) => {
      res.status(401).send("Wrong username");
    });
});
app.get("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const tokens = generateToken(user.userName);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    res.json({
      ...tokens,
      user: {
        userName: user.userName,
        firstName: user.firstname,
        lastName: user.lastname,
        age: user.age,
      },
    });
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
