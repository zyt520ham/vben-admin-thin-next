import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
import { IReqGetRoles, IRespRolesListData } from '/@/api/sys/model/roleModel';
import { RequestOptions } from '/#/axios';

enum Api {
  GetRoleList = '/rbac/role/list',
}

/**
 * @description: 获取项目角色列表
 */

export const getRoleListApi = (params: IReqGetRoles, options?: RequestOptions) =>
  doBaseApiRequest<IRespRolesListData>(Api.GetRoleList, params, options ? options : {});
