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

  kUploadWxCost = 'WxCostUpload',
  kUploadLineCost = 'LineCostUpload',
  kUploadMilestone = 'MileStoreUpload',

  KMilestoneV2 = 'MileStoneV2View',
}
//src/views/rg/cost-upload/mile-store-upload/v2/MileStoneUpload.vue
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
  compNameEnum.kUploadWxCost,
  compNameEnum.kUploadLineCost,
  compNameEnum.kUploadMilestone,
  compNameEnum.KMilestoneV2,
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
  [compNameEnum.kUploadWxCost]: 'rg/cost-upload/wx-cost-upload/WxCostUpload.vue',
  [compNameEnum.kUploadLineCost]: 'rg/cost-upload/line-cost-upload/LineCostUpload.vue',
  [compNameEnum.kUploadMilestone]: 'rg/cost-upload/mile-store-upload/v2/MileStoneUpload.vue',
  [compNameEnum.KMilestoneV2]: 'rg/chart-boards/milestone-v2/MilestoneV2Boarder.vue',
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
  [compNameEnum.kUploadWxCost]: '微信花费上传页面',
  [compNameEnum.kUploadLineCost]: 'Line花费上传页面',
  [compNameEnum.kUploadMilestone]: '里程碑V2配置上传页面',
  [compNameEnum.KMilestoneV2]: '里程碑V2看板',
};
