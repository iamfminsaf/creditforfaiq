const {
  getCustomers,
  addCustomer,
  getCustomer,
  addTransaction,
  updateNote,
  starCustomer,
  updateProfile,
} = require("../controllers/customerController");
const authUser = require("../middleware/authUser");
const upload = require("../middleware/upload");

const Router = require("express").Router();

Router.route("/")
  .get(authUser, getCustomers)
  .post(authUser, upload.single("profile"), addCustomer);

Router.route("/:id").get(authUser, getCustomer).post(authUser, addTransaction);

Router.route("/:id/note").put(authUser, updateNote);
Router.route("/:id/profile").put(
  authUser,
  upload.single("profile"),
  updateProfile
);
Router.route("/:id/star").put(authUser, starCustomer);

module.exports = Router;
