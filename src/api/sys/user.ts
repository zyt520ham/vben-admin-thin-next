import { defHttp } from '/@/utils/http/axios';
import {
  ILoginParams,
  ILoginServerData,
  IUserInfoParams,
  IUserItemServerData,
} from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',

  rgLogin = '/site/login',
  rgUserInfo = '/user/info',
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
  return defHttp.get({ url: Api.Logout });
}
