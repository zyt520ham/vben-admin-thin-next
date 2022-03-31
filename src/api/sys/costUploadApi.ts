import { doBaseUploadApi } from '/@/utils/http/NetworkEngine';

import { IReqUploadWxCost } from '/@/api/sys/model/uploadCostModel';

enum Api {
  UploadWxCost = '/tripartite/wx/upwxcost',
}

/**
 * @description: 获取项目列表
 */

export const uploadWxCostApi = (params: IReqUploadWxCost) =>
  doBaseUploadApi<any>(Api.UploadWxCost, params, () => {});
