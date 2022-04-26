namespace RGTableDefs {
  export namespace AdsAssetRoiUsdTotal {
    export const tableName = 'ads_asset_roi_usd_total';
    export enum tableColumnsEnum {
      /** 项目id*/
      kApp = 'app',
      /** 玩家安装日期 {STRING} */
      kInstallDay = 'install_day',
      /** 媒体渠道 {STRING} */
      kMediaSoucre = 'mediasource',
      /** 客户端包 {STRING} */
      KAppPackage = 'app_package',
      /** 广告组 {STRING} */
      kAdSet = 'adset',
      /** 广告系列 {string} */
      kCampaign = 'campaign',
      /** 广告 {STRING} */
      kAd = 'ad',
      /** 国家 {STRING}*/
      kCountry = 'country',
      /** 优化师 {STRING} */
      kOperator = 'operator',
      /** 素材 {STRING} */
      kAsset = 'asset',
      /** UA账户 {STRING} */
      kUAAccount = 'ua_account',
      /** 投放区域 {STRING}*/
      kArea = 'area',
      /** 展示 {DOUBLE} */
      kKpiImpressions = 'kpi_impressions',
      /** 点击 {DOUBLE} */
      kKpiClicks = 'kpi_clicks',
      /** 安装 {DOUBLE} */
      kKpiInstalls = 'kpi_installs',
      /** 花费美元金额 {DOUBLE} */
      kCostValue_USD = 'cost_value_usd',
      /** 至今总收入 {DOUBLE} */
      kRevenueTotal = 'revenue_total',
      /** 创意 {STRING} */
      kIdeaer = 'idea',
      /** 制作 {STRING} */
      kMaker = 'maker',
      /** 海外/国内 {STRING} */
      kAppArea = 'app_area',
      /** 次日留存 {DOUBLE} */
      kKpiRetention_1 = 'kpi_retention_1',
      /** 三日留存 {DOUBLE} */
      kKpiRetention_2 = 'kpi_retention_2',
      /** 七日留存 {DOUBLE} */
      kKpiRetention_6 = 'kpi_retention_6',
    }
  }
  export namespace AdsApplicationMilestonesV2 {
    export const tableName = 'ads_application_milestones_v2';
    export enum tableColumnsEnum {
      /** 里程碑开启时间 {STRING}  */
      kStartDay = 'startday',
      /** 里程碑结束时间 {STRING}  */
      kEndDay = 'endday',
      /** 里程碑阶段日期 {STRING}  */
      kStepDay = 'stepday',
      /** 里程碑阶段结束日期 {STRING}  */
      kStepEndDay = 'stependday',
      /** 包分组 {STRING}  */
      kAppPackageGroup = 'app_package_group',
      /** 平台分组 {STRING}  */
      kAppPackagePf = 'app_package_pf',
      /** 系统分组 {STRING}  */
      kAppPackageSys = 'app_package_sys',
      /** 国家分组 {STRING}  */
      kCountryGroup = 'country_group',
      /** 渠道分组 {STRING} */
      kMediaSourceGroup = 'mediasource_group',
      /** 目标花费($) {DOUBLE} */
      kTargetCost = 'target_cost',
      /** 当前花费($) {DOUBLE} */
      kTargetUsd = 'target_usd',
    }
  }
  export namespace AdsApplicationMilestonesV2Asset {
    export const tableName = 'ads_application_milestones_v2_asset';
    export enum tableColumnsEnum {
      /** 开始时间 {STRING} */
      kStartDay = 'startday',
      /** app包 {STRING} */
      kAppPackage = 'app_package_group',
      /** 素材 {STRING} */
      kAsset = 'asset',
      /** 创意 {STRING} */
      kIdea = 'idea',
      /** 制作 {STRING} */
      kMaker = 'maker',
      /** 花费 {DOUBLE} */
      kCost = 'cost',
    }
  }
}

export default RGTableDefs;
