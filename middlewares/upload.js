const multer = require("multer");

const storage = multer.memoryStorage(); // karena kita tidak simpan file di lokal
const upload = multer({ storage });

module.exports = upload;
