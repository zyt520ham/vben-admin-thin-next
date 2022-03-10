import { defHttp } from '/@/utils/http/axios';
import {
  ILoginParams,
  ILoginServerData,
  IReqUserPsdResetByAdmin,
  IUserInfoParams,
  IUserItemServerData,
} from './model/userModel';

import { ErrorMessageMode, RequestOptions } from '/#/axios';
import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',

  rgLogin = '/site/login',
  rgLogout = '/site/logout',
  rgUserInfo = '/user/info',

  //管理员重置用户密码
  rgUserPsdReset = '/user/reset-password',
}

/**
 * @description: user login api
 */
export function loginApi(params: ILoginParams, mode: ErrorMessageMode = 'modal') {
  const promise = doBaseApiRequest<ILoginServerData>(Api.rgLogin, params, {
    errorMessageMode: mode,
  });
  return promise;
}

/**
 * @description: getUserInfo
 */
export function getUserInfo(params: IUserInfoParams) {
  const promise = doBaseApiRequest<IUserItemServerData>(Api.rgUserInfo, params, {
    errorMessageMode: 'none',
  });
  return promise;
  // return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  const promise = doBaseApiRequest<ILoginServerData>(
    Api.rgLogout,
    {},
    {
      errorMessageMode: 'none',
    },
  );
  return promise;
  // return defHttp.get({ url: Api.Logout });
}

//管理员重置用户密码
export const resetUserPsdByAdminApi = (params: IReqUserPsdResetByAdmin, options?: RequestOptions) =>
  doBaseApiRequest<any>(Api.rgUserPsdReset, params, options);
