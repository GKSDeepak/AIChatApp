const express = require("express");
const multer = require("multer");
const { uploadFile } = require("../controllers/upload.controllers");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
