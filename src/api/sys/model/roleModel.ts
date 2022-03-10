import { IRoleInfo } from '/#/store';

export interface IReqGetRoles {
  page?: number;
  page_size?: number;
  project_id?: string;
}
export interface IRespRolesListData {
  list: IRoleInfo[];
  total: number;
}

export interface IReqUserRolesUpdate {
  user_id: number;
  /** 角色id，## 分割 */
  selected_roles: string;
}

export interface IRespUserRolesData {
  selected_roles: string[];
  user_id: number;
}

//获取菜单权限列表
export interface IReqGetPermissionsByRole {
  role?: string;
}

export interface IReqUpdateRolePermissions {
  role: string;
  /** ## 分割*/
  selected_menus: string;
}

export interface IReqUpdateRoleInfo {
  old_role: string;
  new_role?: string;
  order_num?: number;
  description?: string;
}
