import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum';
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
} from '/@/enums/appEnum';

import { CacheTypeEnum } from '/@/enums/cacheEnum';

export type LocaleType = 'zh_CN' | 'en' | 'ru' | 'ja' | 'ko';

export interface MenuSetting {
  bgColor: string;
  fixed: boolean;
  collapsed: boolean;
  canDrag: boolean;
  show: boolean;
  hidden: boolean;
  split: boolean;
  menuWidth: number;
  mode: MenuModeEnum;
  type: MenuTypeEnum;
  theme: ThemeEnum;
  topMenuAlign: 'start' | 'center' | 'end';
  trigger: TriggerEnum;
  accordion: boolean;
  closeMixSidebarOnChange: boolean;
  collapsedShowTitle: boolean;
  mixSideTrigger: MixSidebarTriggerEnum;
  mixSideFixed: boolean;
}

export interface MultiTabsSetting {
  cache: boolean;
  /** tags view show*/
  show: boolean;
  showQuick: boolean;
  canDrag: boolean;
  showRedo: boolean;
  showFold: boolean;
}

export interface HeaderSetting {
  bgColor: string;
  fixed: boolean;
  show: boolean;
  theme: ThemeEnum;
  // Turn on full screen
  showFullScreen: boolean;
  // Whether to show the lock screen
  useLockPage: boolean;
  // Show document button
  showDoc: boolean;
  // Show message center button
  showNotice: boolean;
  showSearch: boolean;
}

export interface LocaleSetting {
  showPicker: boolean;
  // Current language
  locale: LocaleType;
  // default language
  fallback: LocaleType;
  // available Locales
  availableLocales: LocaleType[];
}

export interface TransitionSetting {
  //  Whether to open the page switching animation
  enable: boolean;
  // Route basic switching animation
  basicTransition: RouterTransitionEnum;
  // Whether to open page switching loading
  openPageLoading: boolean;
  // Whether to open the top progress bar
  openNProgress: boolean;
}

export interface ProjectConfig {
  /*// 权限缓存存放位置。默认存放于localStorage*/
  permissionCacheType: CacheTypeEnum;
  /*  // 是否显示SettingButton */
  showSettingButton: boolean;
  /*// 是否显示主题切换按钮*/
  showDarkModeToggle: boolean;
  /*// 设置按钮位置 可选项*/
  settingButtonPosition: SettingButtonPositionEnum;
  /*  // 权限模式,默认前端角色权限模式
  // ROUTE_MAPPING: 前端模式（菜单由路由生成，默认）
  // ROLE：前端模式（菜单路由分开）*/
  permissionMode: PermissionModeEnum;
  /*  // 会话超时处理方案
  // SessionTimeoutProcessingEnum.ROUTE_JUMP: 路由跳转到登录页
  // SessionTimeoutProcessingEnum.PAGE_COVERAGE: 生成登录弹窗，覆盖当前页面*/
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum;
  /*// 网站灰色模式，用于可能悼念的日期开启*/
  grayMode: boolean;
  /*  // 色弱模式*/
  colorWeak: boolean;
  // 项目主题色
  themeColor: string;
  // 是否取消菜单,顶部,多标签页显示, 用于可能内嵌在别的系统内
  fullContent: boolean;
  // 主题内容宽度
  contentMode: ContentEnum;
  // 是否显示logo
  showLogo: boolean;
  // 是否显示底部信息 copyright
  showFooter: boolean;
  // 头部配置
  headerSetting: HeaderSetting;
  // 菜单配置
  menuSetting: MenuSetting;
  // 多标签
  multiTabsSetting: MultiTabsSetting;
  // 动画配置
  transitionSetting: TransitionSetting;
  // 是否开启KeepAlive缓存  开发时候最好关闭,不然每次都需要清除缓存
  openKeepAlive: boolean;
  // 自动锁屏时间，为0不锁屏。 单位分钟 默认1个小时
  lockTime: number;
  // 显示面包屑
  showBreadCrumb: boolean;
  // 显示面包屑图标
  showBreadCrumbIcon: boolean;
  // 是否使用全局错误捕获
  useErrorHandle: boolean;
  // 是否开启回到顶部
  useOpenBackTop: boolean;
  //  是否可以嵌入iframe页面
  canEmbedIFramePage: boolean;
  // 切换界面的时候是否删除未关闭的message及notify
  closeMessageOnSwitch: boolean;
  // 切换界面的时候是否取消已经发送但是未响应的http请求。
  // 如果开启,想对单独接口覆盖。可以在单独接口设置
  removeAllHttpPending: boolean;
}

export interface GlobConfig {
  // Site title
  title: string;
  // Service interface url
  apiUrl: string;
  // Upload url
  uploadUrl?: string;
  //  Service interface url prefix
  urlPrefix?: string;
  // Project abbreviation
  shortName: string;
}
export interface GlobEnvConfig {
  /*# 网站标题*/
  VITE_GLOB_APP_TITLE: string;
  /* 接口地址 可以由nginx做转发或者直接写实际地址 */
  VITE_GLOB_API_URL: string;
  /* # 接口地址前缀，有些系统所有接口地址都有前缀，可以在这里统一加，方便切换 */
  VITE_GLOB_API_URL_PREFIX?: string;
  /* # 简称，用于配置文件名字 不要出现空格、数字开头等特殊字符*/
  VITE_GLOB_APP_SHORT_NAME: string;
  /*  # 文件上传接口  可选*/
  VITE_GLOB_UPLOAD_URL?: string;
}
