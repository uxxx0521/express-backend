const express = require("express");
const path = require("path");
const app = express();
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const cors = require("cors"); //CORS

app.use(logger); //LOGGER used

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: "http://localhost",  // Allow requests from your frontend
  credentials: true,           // Allow cookies & authentication headers
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: ["Content-Type", "Authorization"]  // Allow auth headers
}));

app.options("*", cors());  // Explicitly allow OPTIONS requests
app.use(express.json());
app.use(cookieParser()); //middle ware for cookies

app.use(
  express.static(path.join(__dirname, "../../Portfolio/react-app-js/dist"))
);

app.use("/api/users", require("./routes/api/users"));        //API Routes
app.use("/api/register", require("./routes/api/register"));  //sign up
app.use("/api/auth", require("./routes/api/auth"));          //log in
app.use("/api/refresh", require("./routes/api/refresh"));    //refresh token
app.use("/api/logout", require("./routes/api/logout"));      //log out
app.use("/api/fetch", require("./routes/api/fetch"));        //fetch user data when mount.
app.use("/api/save", require("./routes/api/save"));          //save user data


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
