import type { RouteMeta } from 'vue-router';

export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}
/** 菜单数据对象 */
export interface IMenuRawData extends Record<string, any> {
  id: string; // fullPath
  label: string; //title
  icon?: string; //图标
  compsKey: string; //解析组件映射key
  useStatus: boolean; //是否可用
  cTime: number; //创建时间
  menuType: 'rootpath' | 'middlepath' | 'endPoint'; //菜单类型 -根菜单 -子菜单 -节点
  parentId: string; //父级id
  path: string; //路由节点path
  hiddenInMenu: boolean; //是否菜单中隐藏
  viewHiddenMenubar: boolean; //打开当前页面是否隐藏menu列表
  orderNum: number; //排序id
  redirect?: string; //重定向地址
  menuLevel: number; //菜单层级
  //-------叶子节点使用的属性----------
  useCache?: boolean; //是否启用页面缓存
  children?: IMenuRawData[]; //子菜单
  alwaysShowInRootMenu?: boolean; //是否始终在菜单中显示
  externalLinkUrl?: string; //外链地址
  openLinkUseExternal?: boolean; //打开content url 是否使用外链方式

  serverId?: number;
  project_id?: string;
}
/** menu list data */
export interface IMenuListDataItem {
  list: IMenuRawData[];
}
/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];
/** 删除菜单参数*/
export interface IReqDelMenuItem {
  serverId: number;
}
export interface IReqAddMenuItem {
  hiddenInMenu;
  viewHiddenMenubar?;
  id;
  label;
  icon;
  compsKey;
  useStatus;
  menuType;
  path;
  menuLevel;
  orderNum;
  openLinkUseExternal;
  externalLinkUrl;
}
