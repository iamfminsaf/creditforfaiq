const multer = require("multer");

const storageEngine = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./profile"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storageEngine });

module.exports = upload;
