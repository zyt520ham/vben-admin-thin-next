import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
import {
  IReqGetPermissionsByRole,
  IReqGetRoles,
  IReqUpdateRoleInfo,
  IReqUpdateRolePermissions,
  IReqUserRolesUpdate,
  IRespRolesListData,
  IRespUserRolesData,
} from '/@/api/sys/model/roleModel';
import { RequestOptions } from '/#/axios';

enum Api {
  GetRoleList = '/rbac/role/list',
  rgUpdateUserRole = '/rbac/association/role-user',
  //获取相应角色对应的菜单权限
  rgGetPermissionsByRole = '/rbac/association/role-menu-list',
  //更新角色菜单权限
  rgUpdateRolePermissions = '/rbac/association/role-menu',
  //更新role 基础信息
  rgUpdateRoleInfo = '/rbac/role/update',
}

/**
 * @description: 获取项目角色列表
 */
//获取proj下的角色列表
export const getRoleListApi = (params: IReqGetRoles, options?: RequestOptions) =>
  doBaseApiRequest<IRespRolesListData>(Api.GetRoleList, params, options ? options : {});

//更新user的角色
export const updateUserRolesApi = (params: IReqUserRolesUpdate, options?: RequestOptions) =>
  doBaseApiRequest<IRespUserRolesData>(Api.rgUpdateUserRole, params, options);

//更新role 的基础数据
export const updateRoleInfoApi = (params: IReqUpdateRoleInfo, options?: RequestOptions) =>
  doBaseApiRequest<IRespUserRolesData>(Api.rgUpdateRoleInfo, params, options);

//通过role 获取菜单权限接口
export const getPermissionsByRoleApi = (
  params: IReqGetPermissionsByRole,
  options?: RequestOptions,
) => doBaseApiRequest<any>(Api.rgGetPermissionsByRole, params, options);

//更新服务器 role的菜单权限
export const updateRolePermissionsApi = (
  params: IReqUpdateRolePermissions,
  options?: RequestOptions,
) => doBaseApiRequest<any>(Api.rgUpdateRolePermissions, params, options);
