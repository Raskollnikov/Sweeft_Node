declare module "multer-s3" {
    import { StorageEngine } from "multer";
    import { S3 } from "@aws-sdk/client-s3";
    const multerS3: any;
    interface Options {
      s3: S3;
      bucket: string;
      acl?: string;
      contentType?: any;
      key?: (req: any, file: Express.Multer.File, cb: (error: any, key?: string) => void) => void;
    }
  
    function multerS3(options: Options): StorageEngine;
  
    namespace multerS3 {
      const AUTO_CONTENT_TYPE: any;
    }

    export = multerS3;
}
