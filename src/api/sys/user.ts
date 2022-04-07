import {
  ILoginParams,
  ILoginServerData,
  IPermissionDataItem,
  IReqCreateUser,
  IReqUpdateUserInfo,
  IReqUpdateUserPsd,
  IReqUserPsdResetByAdmin,
  IUserInfoParams,
  IUserItemServerData,
} from '../model/userModel';

import { ErrorMessageMode, RequestOptions } from '/#/axios';
import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
import { IUserInfo } from '/#/store';
import { ApiEnum } from '/@/api/ApiPath';
//
// enum Api {
// // Login = '/login',
// // Logout = '/logout',
// // GetUserInfo = '/getUserInfo',
// // // GetPermCode = '/getPermCode',
// }
/**
 * @description: user login api
 */
export function loginApi(params: ILoginParams, mode: ErrorMessageMode = 'modal') {
  const promise = doBaseApiRequest<ILoginServerData>(ApiEnum.rgLogin, params, {
    errorMessageMode: mode,
  });
  return promise;
}

/**
 * @description: getUserInfo
 */
export function getUserInfo(params: IUserInfoParams) {
  const promise = doBaseApiRequest<IUserItemServerData>(ApiEnum.rgGetUserInfo, params, {
    errorMessageMode: 'none',
  });
  return promise;
  // return defHttp.get<GetUserInfoModel>({ url: ApiEnum.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return '';
  // return defHttp.get<string[]>({ url: ApiEnum.GetPermCode });
}

export function doLogout() {
  const promise = doBaseApiRequest<ILoginServerData>(
    ApiEnum.rgLogout,
    {},
    {
      errorMessageMode: 'none',
    },
  );
  return promise;
  // return defHttp.get({ url: ApiEnum.Logout });
}

//管理员重置用户密码
export const resetUserPsdByAdminApi = (params: IReqUserPsdResetByAdmin, options?: RequestOptions) =>
  doBaseApiRequest<any>(ApiEnum.rgResetUserPsd, params, options);

//修改用户信息
export const updateUserProfileApi = (params: IReqUpdateUserInfo, options?: RequestOptions) =>
  doBaseApiRequest<IUserInfo>(ApiEnum.rgUpdateUserInfo, params, options);

//修改个人密码
export const updateUserPsdApi = (params: IReqUpdateUserPsd, options?: RequestOptions) =>
  doBaseApiRequest<IUserInfo>(ApiEnum.rgUpdateUserPsd, params, options);

//获取个人菜单权限列表
export const getUserPermissionsListApi = (params: any = {}, options?: RequestOptions) =>
  doBaseApiRequest<IPermissionDataItem>(ApiEnum.rgGetPermissions, params, options);

//新建用户
export const getCreateUserApi = (params: IReqCreateUser, options?: RequestOptions) =>
  doBaseApiRequest<IPermissionDataItem>(ApiEnum.rgCreateUser, params, options);
export const delUserApi = (params: { user_id: string | number }, options?: RequestOptions) =>
  doBaseApiRequest<IPermissionDataItem>(ApiEnum.rgDelUser, params, options);
