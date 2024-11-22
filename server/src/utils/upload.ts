import multer from "multer"
import path from "path"

export const storage = multer.diskStorage({
	//@ts-ignore
	destination: function(_, __, cb) {
		console.log('desti ', __dirname + '/../uploads/')
		cb(null, __dirname + '/../uploads/'); // Destination folder for uploaded files
	},
	//@ts-ignore
	filename: function(_, file, cb) {
		console.log('file', file)
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // File naming convention
	}
});

// Initialize multer with the storage configuration
export const upload = multer({ storage: storage });
