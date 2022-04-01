/** 上传请求参数base*/

export interface IReqUploadBase {
  /** 文件 */
  file: File | Blob;
  /** 多文件*/
  files?: File[] | Blob[];
  /** 文件名 */
  filename?: string;
}
/** 微信上传请求参数 */
export interface IReqUploadWxCost extends IReqUploadBase {
  /** 项目APPID */
  app?: string;
  /** wx账户*/
  account: string;
  /** 花费日期*/
  day: string;
}
export interface IReqUploadLineCost extends IReqUploadBase {
  /** 项目APPID */
  app?: string;
  /** 花费上传时间*/
  day: string;
}
