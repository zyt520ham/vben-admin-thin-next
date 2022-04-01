export enum ApiEnum {
  //user
  rgUpdateUserInfo = '/personal/update',
  rgLogin = '/site/login',
  rgLogout = '/site/logout',
  rgGetUserInfo = '/user/info',

  //管理员重置用户密码
  rgResetUserPsd = '/user/reset-password',
  //个人修改密码
  rgUpdateUserPsd = '/personal/modify-password',
  //获取权限菜单列表
  rgGetPermissions = '/site/permission',

  //costUploadApi
  UploadWxCost = '/tripartite/wx/upwxcost',
  UploadLineCost = '/tripartite/wx/uplinecost',
  //urlTokenApi.ts
  getTokenExchangedUrl = '/tripartite/exchangeurl',

  //roleApi.ts
  rgGetRoleList = '/rbac/role/list',
  rgUpdateUserRole = '/rbac/association/role-user',
  //获取相应角色对应的菜单权限
  rgGetPermissionsByRole = '/rbac/association/role-menu-list',
  //更新角色菜单权限
  rgUpdateRolePermissions = '/rbac/association/role-menu',
  //更新role 基础信息
  rgUpdateRoleInfo = '/rbac/role/update',

  rgCreateRoleInfo = '/rbac/role/create',

  rgDelRole = '/rbac/role/delete',

  //projectApi.ts
  GetProjectsList = '/project/list',

  UpdateChooseProj = '/personal/set-default-project',

  rgGetProjUsers = '/project/users',

  rgGetProjUsers_v1 = '/user/list',
  //添加用户到项目
  rgAddUsersFromProj = '/project/authorization',
  //删除用户从项目
  rgDelUserFromProj = '/user/project-authorization',

  //menu.ts
  rgGetMenuList = '/rbac/menu/list',
  //add menuItem
  rgAddMenuItem = '/rbac/menu/create',
  //删除menuItem
  rgDelMenuItem = '/rbac/menu/delete',
  //更新menuItem
  rgUpdateMenuItem = '/rbac/menu/update',

  //  cost.ts
  rgGetWxCost = '/tripartite/wx/getcostname',
  rgGetLineCost = '/tripartite/wx/linelistcost',
}
