export interface IReqUploadWxCost {
  app?: string;
  account: string;
  day: string;
  file: File | Blob;
  // file name
  filename?: string;
  name?: string;
  data?: any;
}
