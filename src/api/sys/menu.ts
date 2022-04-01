import {
  IMenuListDataItem,
  IReqAddMenuItem,
  IReqDelMenuItem,
  IReqEditMenuItem,
} from './model/menuModel';
import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
import { RequestOptions } from '/#/axios';
import { ApiEnum } from '/@/api/ApiPath';
//
// enum Api {
//   GetMenuList = '/getMenuList',
//
//   rgGetMenuList = '/rbac/menu/list',
//
//   //add menuItem
//   rgAddMenuItem = '/rbac/menu/create',
//   //删除menuItem
//   rgDelMenuItem = '/rbac/menu/delete',
//   //更新menuItem
//   rgUpdateMenuItem = '/rbac/menu/update',
// }

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return doBaseApiRequest<IMenuListDataItem>(ApiEnum.rgGetMenuList, {}, {});
};

/**
 * @description: add menuItem
 */
export const addMenuItemApi = (params: IReqAddMenuItem, options: RequestOptions = {}) => {
  return doBaseApiRequest<any>(ApiEnum.rgAddMenuItem, params, options);
};

/**
 * @description: delete menuItem
 */
export const deleteMenuItemApi = (params: IReqDelMenuItem, options: RequestOptions = {}) => {
  return doBaseApiRequest<any>(ApiEnum.rgDelMenuItem, params, options);
};

/**
 * @description: update menuItem
 */
export const updateMenuItemApi = (params: IReqEditMenuItem, options: RequestOptions = {}) => {
  return doBaseApiRequest<any>(ApiEnum.rgUpdateMenuItem, params, options);
};
