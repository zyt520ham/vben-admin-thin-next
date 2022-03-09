import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
import { IProjectListReq, IRespProjectsData } from '/@/api/sys/model/projectModel';
import { RequestOptions } from '/#/axios';

enum Api {
  GetProjectsList = '/project/list',

  UpdateChooseProj = '/personal/set-default-project',
  rgGetMenuList = '/rbac/menu/list',
}

/**
 * @description: 获取项目列表
 */

export const getProjsListApi = (params: IProjectListReq) =>
  doBaseApiRequest<IRespProjectsData>(Api.GetProjectsList, params, {});

export const updateCurrentChooseProjApi = (params: any = {}, options: RequestOptions = {}) =>
  doBaseApiRequest<any>(Api.UpdateChooseProj, params, options || {});
