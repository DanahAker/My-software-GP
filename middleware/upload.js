const multer = require("multer");
const path=require('path')

const filePath=path.join(__dirname, "../files/uploads")
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,  filePath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
console.log("hi inside storage")
var uploadFile = multer({ storage: storage});
module.exports = uploadFile;