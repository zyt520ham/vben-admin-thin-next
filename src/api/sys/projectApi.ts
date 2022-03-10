import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
import {
  IProjectListReq,
  IReqGetProjUser,
  IReqProjIncludeUsers,
  IRespProjectsData,
  IRespProjsIncludeUsers,
  IRespProjUsers,
} from '/@/api/sys/model/projectModel';
import { RequestOptions } from '/#/axios';

enum Api {
  GetProjectsList = '/project/list',

  UpdateChooseProj = '/personal/set-default-project',
  rgGetMenuList = '/rbac/menu/list',

  rgGetProjUsers = '/project/users',

  rgGetProjUsers_v1 = '/user/list',
}

/**
 * @description: 获取项目列表
 */

export const getProjsListApi = (params: IProjectListReq) =>
  doBaseApiRequest<IRespProjectsData>(Api.GetProjectsList, params, {});

export const updateCurrentChooseProjApi = (params: any = {}, options: RequestOptions = {}) =>
  doBaseApiRequest<any>(Api.UpdateChooseProj, params, options || {});

//获取当前项目下的用户列表
export const getProjUsersApi = (params: IReqProjIncludeUsers, options: RequestOptions = {}) =>
  doBaseApiRequest<IRespProjsIncludeUsers>(Api.rgGetProjUsers, params, options);

//获取用户列表新接口
export const getProjUsersV1Api = (params: IReqGetProjUser, options: RequestOptions = {}) =>
  doBaseApiRequest<IRespProjUsers>(Api.rgGetProjUsers_v1, params, options);
