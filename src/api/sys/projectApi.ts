import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
import {
  IProjectListReq,
  IReqGetProjUser,
  IReqProjAddUsers,
  IReqProjDelUser,
  IReqProjIncludeUsers,
  IReqUpdateProjData,
  IReqUpdateProjState,
  IRespProjectsData,
  IRespProjsIncludeUsers,
  IRespProjUsers,
} from '/@/api/model/projectModel';
import { RequestOptions } from '/#/axios';
import { ApiEnum } from '/@/api/ApiPath';

// enum Api {
//   GetProjectsList = '/project/list',
//
//   UpdateChooseProj = '/personal/set-default-project',
//   rgGetMenuList = '/rbac/menu/list',
//
//   rgGetProjUsers = '/project/users',
//
//   rgGetProjUsers_v1 = '/user/list',
//   //添加用户到项目
//   rgAddUsersFromProj = '/project/authorization',
//   //删除用户从项目
//   rgDelUserFromProj = '/user/project-authorization',
// }

/**
 * @description: 获取项目列表
 */

export const getProjsListApi = (params: IProjectListReq) =>
  doBaseApiRequest<IRespProjectsData>(ApiEnum.GetProjectsList, params, {});

export const updateCurrentChooseProjApi = (params: any = {}, options: RequestOptions = {}) =>
  doBaseApiRequest<any>(ApiEnum.UpdateChooseProj, params, options || {});

//获取当前项目下的用户列表
export const getProjUsersApi = (params: IReqProjIncludeUsers, options: RequestOptions = {}) =>
  doBaseApiRequest<IRespProjsIncludeUsers>(ApiEnum.rgGetProjUsers, params, options);

//获取用户列表新接口
export const getProjUsersV1Api = (params: IReqGetProjUser, options: RequestOptions = {}) =>
  doBaseApiRequest<IRespProjUsers>(ApiEnum.rgGetProjUsers_v1, params, options);
//从项目移除用户
export const deleteUserFromProjApi = (params: IReqProjDelUser, options: RequestOptions = {}) => {
  params.cancel = 'yes'; // 项目删除用户必传字段
  return doBaseApiRequest<IRespProjUsers>(ApiEnum.rgDelUserFromProj, params, options);
};
//项目邀请用户
export const addUsersFromProjApi = (params: IReqProjAddUsers, options: RequestOptions = {}) =>
  doBaseApiRequest<any>(ApiEnum.rgAddUsersFromProj, params, options);

//项目数据修改接口
export const updateProjDataApi = (params: IReqUpdateProjData, options: RequestOptions = {}) =>
  doBaseApiRequest<any>(ApiEnum.rgUpdateProjectData, params, options);

//项目状态修改
export const updateProjStateApi = (params: IReqUpdateProjState, options: RequestOptions = {}) =>
  doBaseApiRequest<any>(ApiEnum.rgUpdateProjectState, params, options);
//
