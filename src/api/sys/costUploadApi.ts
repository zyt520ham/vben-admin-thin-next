import { doBaseUploadApi } from '/@/utils/http/NetworkEngine';

import { IReqUploadWxCost } from '/@/api/sys/model/uploadCostModel';
import { ApiEnum } from '/@/api/ApiPath';

/**
 * @description: 微信花费上传
 */
export const uploadWxCostApi = (params: IReqUploadWxCost) =>
  doBaseUploadApi<any>(ApiEnum.UploadWxCost, params, () => {});
