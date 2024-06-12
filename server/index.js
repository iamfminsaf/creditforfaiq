const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const userRouter = require("./routes/userRoutes");
const customerRouter = require("./routes/customerRoutes");

require("dotenv").config();
const { FRONTEND, DB_URI, PORT } = process.env;

const app = express();

app.use(cors({ origin: FRONTEND }));
app.use(express.json());

app.use("/profile", express.static(path.join(__dirname, "profile")));
app.use("/api/user", userRouter);
app.use("/api/cus", customerRouter);

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("DB connected successfully!!");

    app.listen(PORT, (err) => {
      if (err) {
        console.log("Error while running server : ", err);
      }
      console.log(`Server is running in port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting db : ", err);
  });
