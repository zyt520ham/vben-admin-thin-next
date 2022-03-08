import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
import { IProjectListReq } from '/@/api/sys/model/projectModel';

enum Api {
  GetProjectsList = '/project/list',

  rgGetMenuList = '/rbac/menu/list',
}

/**
 * @description: 获取项目列表
 */

export const getProjsListApi = (params: IProjectListReq) =>
  doBaseApiRequest<any>(Api.GetProjectsList, params, {});
