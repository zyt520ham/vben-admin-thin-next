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
  [compNameEnum.kProjMenusListMgView]: 'rg/proj-setting/ProjMenusListMg.vue',
  [compNameEnum.kProjPermissionsMgView]: 'rg/proj-setting/ProjPermissionsMg.vue',
  [compNameEnum.kProjRolesListMgView]: 'rg/proj-setting/roles-list/ProjRolesListMg.vue',
  [compNameEnum.kProjUsersMgView]: 'rg/proj-setting/ProjUsersMgView.vue',
  [compNameEnum.kSysUserProfilesView]: 'rg/sys-mine/SysUserProfilesView.vue',
  [compNameEnum.kSysUserProjsView]: 'rg/sys-mine/SysUserProjsView.vue',
  [compNameEnum.kSysProjsListMgView]: 'rg/sys-settings/SysProjsListMg.vue',
  [compNameEnum.kSysUsersListMgView]: 'rg/sys-settings/SysUsersListMg.vue',
};
