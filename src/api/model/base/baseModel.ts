export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  items: T[];
  total: number;
}
/** 上传请求参数base*/

export interface IReqUploadBase {
  /** 文件 */
  file: File | Blob;
  /** 多文件*/
  files?: File[] | Blob[];
  /** 文件名 */
  filename?: string;
}
