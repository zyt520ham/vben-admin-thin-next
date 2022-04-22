export enum ApiEnum {
  //#region user.ts ========================================
  rgUpdateUserInfo = '/personal/update',
  rgLogin = '/site/login',
  rgLogout = '/site/logout',
  rgGetUserInfo = '/user/info',
  //创建用户
  rgCreateUser = '/user/create',
  //删除用户
  rgDelUser = '/user/delete',
  //管理员重置用户密码
  rgResetUserPsd = '/user/reset-password',
  //个人修改密码
  rgUpdateUserPsd = '/personal/modify-password',
  //获取权限菜单列表
  rgGetPermissions = '/site/permission',
  //更新用户账户状态
  rgUpdateUserBanState = '/user/ban',
  /** 管理员更新用户信息 */
  rgUpdateUserInfoByAdmin = '/user/update',
  //#endregion ---------------------------------------------

  //#region costUploadApi.ts ========================================
  UploadWxCost = '/tripartite/wx/upwxcost',
  UploadLineCost = '/tripartite/wx/uplinecost',
  UploadMilestoneCfg = '/temp/oss-milestone-upload',
  //urlTokenApi.ts
  getTokenExchangedUrl = '/tripartite/exchangeurl',
  //#endregion ---------------------------------------------

  //#region roleApi.ts ========================================
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

  //#endregion ---------------------------------------------

  //#region projectApi.ts ========================================
  GetProjectsList = '/project/list',

  UpdateChooseProj = '/personal/set-default-project',

  rgGetProjUsers = '/project/users',

  rgGetProjUsers_v1 = '/user/list',
  //添加用户到项目
  rgAddUsersFromProj = '/project/authorization',
  //删除用户从项目
  rgDelUserFromProj = '/user/project-authorization',
  //修改项目信息
  rgUpdateProjectData = '/project/update',
  //修改项目状态
  rgUpdateProjectState = '/project/state',
  //menu.ts
  rgGetMenuList = '/rbac/menu/list',
  //add menuItem
  rgAddMenuItem = '/rbac/menu/create',
  //删除menuItem
  rgDelMenuItem = '/rbac/menu/delete',
  //更新menuItem
  rgUpdateMenuItem = '/rbac/menu/update',
  //#endregion ---------------------------------------------
  //#region  cost.ts ========================================
  rgGetWxCost = '/tripartite/wx/getcostname',
  rgGetLineCost = '/tripartite/wx/linelistcost',
  rgGetCfgForMilestoreUploaded = '/temp/oss-milestone-list',
  //#endregion ---------------------------------------------
}
