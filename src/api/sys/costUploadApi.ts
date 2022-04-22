import { doBaseUploadApi } from '/@/utils/http/NetworkEngine';

import {
  IReqUploadLineCost,
  IReqUploadMileStoneCfg,
  IReqUploadWxCost,
} from '/@/api/model/uploadCostModel';
import { ApiEnum } from '/@/api/ApiPath';

/**
 * @description: 微信花费上传
 */
export const uploadWxCostApi = (params: IReqUploadWxCost) =>
  doBaseUploadApi<any>(ApiEnum.UploadWxCost, params, () => {});
/**
 * @description: line花费上传
 */
export const uploadLineCostApi = (params: IReqUploadLineCost) =>
  doBaseUploadApi<any>(ApiEnum.UploadLineCost, params, () => {});
/**
 * @description: 里程碑V2版本配置上传
 */
export const uploadMileStoneCfgApi = (params: IReqUploadMileStoneCfg) =>
  doBaseUploadApi<any>(ApiEnum.UploadMilestoneCfg, params, () => {});
