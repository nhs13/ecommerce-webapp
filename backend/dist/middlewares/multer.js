import multer from 'multer';
// storing the images on the server (our pc)
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads"); // setting error as null
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    }
});
export const singleUpload = multer({ storage }).single("photo");
