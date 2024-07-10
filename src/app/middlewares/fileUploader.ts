/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import multer from 'multer';

export const uploadFile = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath = '';

      if (
        file.fieldname === 'licenseFrontImage' ||
        file.fieldname === 'licenseBackImage'
      ) {
        uploadPath = 'uploads/images/licenses';
      } else if (file.fieldname === 'image') {
        uploadPath = 'uploads/images/image';
      } else if (file.fieldname === 'profile_image') {
        uploadPath = 'uploads/images/image';
      } else if (file.fieldname === 'video') {
        uploadPath = 'uploads/video';
      } else if (file.fieldname === 'truckDocumentImage') {
        uploadPath = 'uploads/images/trucks';
      } else if (file.fieldname === 'truckImage') {
        uploadPath = 'uploads/images/trucks';
      } else {
        uploadPath = 'uploads';
      }

      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'video/mp4'
      ) {
        cb(null, uploadPath);
      } else {
        //@ts-ignore
        cb(new Error('Invalid file type'));
      }
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    },
  });

  const fileFilter = (req: Request, file: any, cb: any) => {
    const allowedFieldnames = [
      'image',
      'truckImage',
      'truckDocumentImage',
      'profile_image',
      'licenseBackImage',
      'licenseFrontImage',
      'video_thumbnail',
    ];

    if (file.fieldname === undefined) {
      // Allow requests without any files
      cb(null, true);
    } else if (allowedFieldnames.includes(file.fieldname)) {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'video/mp4'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    } else {
      cb(new Error('Invalid fieldname'));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'truckImage', maxCount: 1 },
    { name: 'truckDocumentImage', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'licenseBackImage', maxCount: 1 },
    { name: 'licenseFrontImage', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 },
  ]);

  return upload;
};
