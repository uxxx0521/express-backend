const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .put(usersController.updateUser)
  .delete(usersController.deleteUser);

router.route("/:id").get(usersController.getUser);

module.exports = router;

/*//ROUTE WITH dynamic ID
router
  .route("/:id")
  .get((req, res) => {
    res.send(`Get user with ID ${req.params.id}`);
    console.log(req.user);
  })
  .put((req, res) => {
    res.send(`Update user with ID ${req.params.id}`);
  })
  .delete((req, res) => {
    res.send(`Delete user with ID ${req.params.id}`);
  })
  .post((req, res) => {
    res.send(`Create user with ID ${req.params.id}`);
  });

//RUN this function whenever you found "id"
const users = [
  { name: "kyle", age: 30 },
  { name: "sally", age: 21 },
];
router.param("id", (req, res, next, id) => {
  req.user = users[id];
  next();
});*/
