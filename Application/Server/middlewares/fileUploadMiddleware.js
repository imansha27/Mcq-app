const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads'); // specify the destination folder where the uploaded file will be stored
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // specify the filename format
    }
});

// Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, 
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb); 
    }
}).single('image'); // specify the field name for single file upload

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check the extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check the MIME type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
}

module.exports = upload;
