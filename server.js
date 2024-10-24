const express = require("express");
const path = require("path");
const app = express();

app.use(
  express.static(path.join(__dirname, "../../Portfolio/react-app-js/dist"))
);

app.use(logger); //LOGGER used

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../Portfolio/react-app-js/dist", "index.html")
  );
});

//IMPORT routes---------------------------
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
//everthing starts with "users" add the thing after  ,
app.use("/users", userRouter); //Link the router
app.use("/posts", postRouter);
//----------------------------------------

//LOGGER
function logger(req, res, next) {
  console.log(req.originalUrl);
  next();
}

app.listen(3000);
