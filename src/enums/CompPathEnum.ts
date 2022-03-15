export enum compNameEnum {
  kProjDetailView = 'ProjDetailView',
  kProjMenusListMgView = 'ProjMenusListMg',
  kProjPermissionsMgView = 'ProjPermissionsMg',
  kProjRolesListMgView = 'ProjRolesListMg',
  kProjUsersMgView = 'ProjUsersMgView',
  kSysUserProfilesView = 'SysUserProfilesView',
  kSysUserProjsView = 'SysUserProjsView',
  kSysProjsListMgView = 'SysProjsListMg',
  kSysUsersListMgView = 'SysUsersListMg',
}
export const compsList = [
  compNameEnum.kProjDetailView,
  compNameEnum.kProjMenusListMgView,
  compNameEnum.kProjPermissionsMgView,
  compNameEnum.kProjRolesListMgView,
  compNameEnum.kProjUsersMgView,
  compNameEnum.kSysUserProfilesView,
  compNameEnum.kSysUserProjsView,
  compNameEnum.kSysProjsListMgView,
  compNameEnum.kSysUsersListMgView,
];
export const compPathMap = {
  [compNameEnum.kProjDetailView]: 'rg/proj-setting/ProjDetailView.vue',
  [compNameEnum.kProjMenusListMgView]: 'rg/proj-setting/menus-list-mg/ProjMenusListMg.vue',
  [compNameEnum.kProjPermissionsMgView]: 'rg/proj-setting/ProjPermissionsMg.vue',
  [compNameEnum.kProjRolesListMgView]: 'rg/proj-setting/roles-list/ProjRolesListMg.vue',
  [compNameEnum.kProjUsersMgView]: 'rg/proj-setting/proj-users-mg/ProjUsersMgView.vue',
  [compNameEnum.kSysUserProfilesView]: 'rg/sys-mine/user-profile/SysUserProfilesView.vue',
  [compNameEnum.kSysUserProjsView]: 'rg/sys-mine/user-projects/SysUserProjsView.vue',
  [compNameEnum.kSysProjsListMgView]: 'rg/sys-settings/projs-list/SysProjsListMg.vue',
  [compNameEnum.kSysUsersListMgView]: 'rg/sys-settings/account-list/SysUsersListMg.vue',
};

export const compDescMap = {
  [compNameEnum.kProjDetailView]: '项目详情页面',
  [compNameEnum.kProjMenusListMgView]: '项目菜单管理页面',
  [compNameEnum.kProjPermissionsMgView]: '项目权限管理页面',
  [compNameEnum.kProjRolesListMgView]: '项目角色管理页面',
  [compNameEnum.kProjUsersMgView]: '项目用户管理页面',
  [compNameEnum.kSysUserProfilesView]: '个人信息页面',
  [compNameEnum.kSysUserProjsView]: '个人项目页面',
  [compNameEnum.kSysProjsListMgView]: '系统项目列表管理页面',
  [compNameEnum.kSysUsersListMgView]: '系统人员管理页面',
};
