import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3, S3_BUCKET } from "../s3/s3.config";
import { uploadFile,getFiles,updateFileVisibility,deleteFile} from "../controllers/file/file.controller";
import { userAuthMiddleware } from "../middlewares/auth.middleware";
import { parseFileMetadata } from "../middlewares/parseFIle";

const router = express.Router();

// Initialize Multer with S3 Storage
const upload = multer({
  storage: multerS3({
    s3,
    bucket: S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueKey = `uploads/${Date.now()}-${file.originalname}`;
      cb(null, uniqueKey);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("only CSV, XLS, and XLSX files are allowed"));
    }
  },
});


router.post("/upload", userAuthMiddleware, upload.single("file"), parseFileMetadata, uploadFile);
router.get("/", userAuthMiddleware, getFiles);
router.patch("/visibility", userAuthMiddleware, updateFileVisibility);
router.delete("/:fileId", userAuthMiddleware, deleteFile);
export default router;
