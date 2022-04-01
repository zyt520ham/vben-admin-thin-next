import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
import { RequestOptions } from '/#/axios';
import { ApiEnum } from '/@/api/ApiPath';

// enum Api {
//   getTokenExchangedUrl = '/tripartite/exchangeurl',
// }

/**
 * @description: 三方页面替换token接口
 */
export const getTokenExchangedUrlApi = (params: { url: string }, options: RequestOptions = {}) => {
  return doBaseApiRequest<string>(ApiEnum.getTokenExchangedUrl, params, options);
};
