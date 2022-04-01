import { RequestOptions } from '/#/axios';
import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
import { ApiEnum } from '/@/api/ApiPath';
import { IReqGetLineCost, IReqGetWxCost } from '/@/api/model/costModel';

/**
 * @description: 微信花费获取
 */
export const getCostForWxApi = (params: IReqGetWxCost, options: RequestOptions = {}) => {
  return doBaseApiRequest<any>(ApiEnum.rgGetWxCost, params, options);
};

/**
 * @description: line花费获取
 */
export const getCostForLineApi = (params: IReqGetLineCost, options: RequestOptions = {}) => {
  return doBaseApiRequest<any>(ApiEnum.rgGetLineCost, params, options);
};
