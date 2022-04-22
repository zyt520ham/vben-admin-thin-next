import { IReqUploadBase } from '/@/api/model/base/baseModel';

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

export interface IReqUploadMileStoneCfg extends IReqUploadBase {
  /** 里程碑类型 */
  type: string;
}
