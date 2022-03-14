import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
import { RequestOptions } from '/#/axios';

enum Api {
  getTokenExchangedUrl = '/tripartite/exchangeurl',
}

/**
 * @description: 三方页面替换token接口
 */
export const getTokenExchangedUrlApi = (params: { url: string }, options: RequestOptions = {}) => {
  return doBaseApiRequest<string>(Api.getTokenExchangedUrl, params, options);
};
