import { JwtPayload } from 'jsonwebtoken';
import IGenericErrorMessage from './error';

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};
type UploadedFile = {
  filename: string;
  path: string;
};

export type CustomRequest = {
  files?: {
    profile_image: any;
    licenseFrontImage?: UploadedFile[];
    licenseBackImage?: UploadedFile[];
    truckDocumentImage?: UploadedFile[];
    image?: UploadedFile[];
    truckImage?: UploadedFile[];
  };
  params: {
    id: string;
  };
  data: any;
  user: JwtPayload;
} & Request;
