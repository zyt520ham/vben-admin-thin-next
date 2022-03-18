import ConstDefs from '/@/enums/ConstDefs';
import { getSecondTimestampNow } from '/@/utils/dateUtil';
import { md5 } from '/@/utils/stringUtils';
// import { getAppEnvConfig } from '/@/utils/env';
import { defHttp } from '/@/utils/http/axios';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { IReqErr, RequestOptions, Result } from '/#/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { isBoolean } from '/@/utils/is';
import { logNoTrace } from '/@/utils/log';
import { useMessage } from '/@/hooks/web/useMessage';
const { createErrorModal } = useMessage();
import { useI18n } from '/@/hooks/web/useI18n';
export interface IReqCommomParams {
  /** 时间戳, 60秒内有效 长度秒级 */
  timestamp?: number;
  /** 参数签名 */
  sign?: string;
}
function apiReqHelper() {
  function getCommomHeader() {
    return {
      [ConstDefs.ServerApi.reqestHeaderKeysEnum.kContentType]: 'application/x-www-form-urlencoded',
      [ConstDefs.ServerApi.reqestHeaderKeysEnum.kLoginToken]:
        useUserStoreWithOut().getLoginInfo?.login_token || 'nologin',
      [ConstDefs.ServerApi.reqestHeaderKeysEnum.kPlatform]: 'pc',
      [ConstDefs.ServerApi.reqestHeaderKeysEnum.kProject]:
        useUserStoreWithOut().getLoginInfo?.project || 'nologin',
    };
  }
  function computedParamsSign(params: any & IReqCommomParams) {
    Object.assign(params, {
      timestamp: getSecondTimestampNow(),
      // sign: '',
    });
    const keyList: string[] = Object.keys(params);
    keyList.sort((a, b) => {
      return a.localeCompare(b, 'kf', { sensitivity: 'variant' });
    });
    // console.log(keyList);
    let queryString = '';
    keyList.forEach((key) => {
      const value = params[key];
      // console.log(value);
      if (
        key !== 'sign' &&
        ((value !== undefined && value !== null && value !== '') || isBoolean(value))
      ) {
        if (queryString.length === 0) {
          queryString = queryString + `${key}=${value}`;
        } else {
          queryString = queryString + `&${key}=${value}`;
        }
      }
    });
    queryString = queryString + `&key=${ConstDefs.ServerApi.stringSignKey}`;
    console.log('params-ori:', JSON.stringify(params));
    console.log('signString', queryString);
    let md5String = md5(queryString);
    md5String = md5String.toLowerCase();
    console.log('md5string', md5String);
    params.sign = md5String;
    return params;
  }

  function serverBaseUrl(path: string): string {
    // eslint-disable-next-line no-unused-expressions
    // const { VITE_GLOB_API_URL } = getAppEnvConfig();
    return '/admin' + path;
  }
  return {
    getCommomHeader,
    computedParamsSign,
    serverBaseUrl,
  };
}

export function doBaseApiRequest<T>(
  uriPath: string,
  params: any,
  options?: RequestOptions,
): Promise<T> {
  const uri = apiReqHelper().serverBaseUrl(uriPath);
  const reqHeader = apiReqHelper().getCommomHeader();
  const signdParams = apiReqHelper().computedParamsSign(params);

  const cfg: AxiosRequestConfig = {} as any;
  cfg.url = uri;
  if (signdParams) {
    cfg.data = signdParams;
  }
  if (reqHeader && Object.keys(reqHeader).length > 0) {
    cfg.headers = reqHeader;
  }
  const requestOption: RequestOptions = {
    isReturnNativeResponse: false, //关闭使用axiosresponse返回
    ignoreCancelToken: true,
    withToken: false,
  };
  if (options) {
    Object.assign(requestOption, options);
  }
  const promise = new Promise<T>((resolve, reject) => {
    defHttp
      .post<Result<T>>(cfg, requestOption)
      .then(
        (resp) => {
          logNoTrace('[url]:' + cfg.url, '\n', '[params]:', cfg.data, '\n', '[resp]:', resp);
          // console.log('resp', resp);
          if (resp.retCode === 0) {
            resolve(resp.data);
          } else {
            const err: IReqErr = new Error(resp.retMsg);
            err.retCode = resp.retCode;
            err.retMsg = resp.retMsg;
            err.respData = resp.data;
            reject(err);
          }
        },
        (error: AxiosError) => {
          if (error.response?.status === 401) {
            const { t } = useI18n();
            createErrorModal({ title: t('sys.api.errorTip'), content: error.response.data.retMsg });
            reject(error);
            return;
          }
          // debugger;
          const errData = error.response?.data;
          if (errData) {
            const err: IReqErr = new Error(errData.retMsg);
            err.retCode = errData.retCode;
            // err.status = error.response?.status;
            err.retMsg = errData.retMsg;
            err.respData = errData.data;
            reject(err);
            return;
            // debugger;
          }
          // const err: IReqErr = new Error(resp.retMsg);
          // err.retCode = resp.retCode;
          // err.retMsg = resp.retMsg;
          // err.respData = resp.data;
          reject(error);
        },
      )
      .catch((err: IReqErr) => {
        console.error(err);
        debugger;
        reject(err);
      });
  });
  return promise;
}
