import { doBaseUploadApi } from '/@/utils/http/NetworkEngine';

import { IReqUploadLineCost, IReqUploadWxCost } from '/@/api/model/uploadCostModel';
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
