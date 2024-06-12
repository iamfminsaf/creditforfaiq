const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const joinUser = async (req, res) => {
  try {
    const { uname, pwd } = req.body;

    if (!uname || !pwd) {
      return res
        .status(406)
        .json({ msg: "uname and pwd are must must be provided" });
    }

    const existUser = await User.exists({ uname });

    if (existUser) {
      const user = await User.findById(existUser._id);
      const isPwdCorrect = await bcrypt.compare(pwd, user.pwd);

      if (!isPwdCorrect) {
        return res.status(400).json({ incorrectPwd: true });
      }

      const token = jwt.sign(
        { uname: user.uname, pwd: user.pwd, uid: user._id },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: "30d" }
      );

      return res.status(200).json({ token });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPwd = await bcrypt.hash(pwd, salt);

      const newUser = await User.create({ uname, pwd: hashedPwd });

      const token = jwt.sign(
        { uname: newUser.uname, pwd: newUser.pwd, uid: newUser._id },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: "30d" }
      );

      return res.status(201).json({ token });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "An error occured" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(400)
        .json({ authenticated: false, msg: "please send the token" });
    }
    try {
      const isTokenValid = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

      if (isTokenValid) {
        return res.status(200).json({ authenticated: true });
      }

      return res
        .status(401)
        .json({ authenticated: false, msg: "invalid token" });
    } catch (err) {
      return res
        .status(400)
        .json({ authenticated: false, msg: "check the token" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ authenticated: false, msg: "An error occured" });
  }
};

module.exports = { joinUser, verifyUser };
