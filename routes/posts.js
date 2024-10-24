const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Post List");
});

router.get("/new", (req, res) => {
  res.send("Post New Form");
});

router.post("/", (req, res) => {
  res.send("Create Post");
});

//ROUTE WITH dynamic ID
router
  .route("/:id")
  .get((req, res) => {
    res.send(`Get Post with ID ${req.params.id}`);
    console.log(req.user);
  })
  .put((req, res) => {
    res.send(`Update Post with ID ${req.params.id}`);
  })
  .delete((req, res) => {
    res.send(`Delete Post with ID ${req.params.id}`);
  })
  .post((req, res) => {
    res.send(`Create Post with ID ${req.params.id}`);
  });

//RUN this function whenever you found "id"
const users = [
  { name: "kyle", age: 30 },
  { name: "sally", age: 21 },
];
router.param("id", (req, res, next, id) => {
  req.user = users[id];
  next();
});
module.exports = router;
