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
