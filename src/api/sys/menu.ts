import { IMenuListDataItem } from './model/menuModel';
import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';

enum Api {
  GetMenuList = '/getMenuList',

  rgGetMenuList = '/rbac/menu/list',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return doBaseApiRequest<IMenuListDataItem>(Api.rgGetMenuList, {}, {});
  // return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};
