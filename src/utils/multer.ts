// /* eslint-disable @typescript-eslint/ban-ts-comment */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Request } from 'express';
// import * as fs from 'fs';
// import multer from 'multer';

// const uploadsDirectory = 'uploads/';
// if (!fs.existsSync(uploadsDirectory)) {
//   fs.mkdirSync(uploadsDirectory, { recursive: true });
// }

// const storage = multer.diskStorage({
//   //@ts-ignore
//   destination: function (req: Request, file: any, cb: any) {
//     cb(null, uploadsDirectory);
//   },
//   filename: function (req: Request, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// export const singleUpload = multer({ storage: storage }).single('image');
// export const upload = multer({ storage: storage }).fields([
//   { name: 'image', maxCount: 20 },
// ]);
