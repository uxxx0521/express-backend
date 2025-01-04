const express = require("express");

const path = require("path");
const app = express();
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(logger); //LOGGER used
app.use(
  express.static(path.join(__dirname, "../../Portfolio/react-app-js/dist"))
);
//middle ware for cookies
app.use(cookieParser());
app.use("/users", require("./routes/api/users"));        //API Routes
app.use("/register", require("./routes/api/register"));  //sign up
app.use("/auth", require("./routes/api/auth"));          //log in
app.use("/refresh", require("./routes/api/refresh"));    //refresh token
app.use("/logout", require("./routes/api/logout"));      //log out
app.use("/fetch", require("./routes/api/fetch"));        //fetch user data when mount.



//handle react pages
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../Portfolio/react-app-js/dist", "index.html")
  );
});

//LOGGER
function logger(req, res, next) {
  console.log(req.originalUrl);
  next();
}



app.listen(3000);
