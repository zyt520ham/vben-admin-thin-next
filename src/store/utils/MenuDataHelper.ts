import { IMenuListDataItem, IMenuRawData } from '/@/api/sys/model/menuModel';
import { AppRouteRecordRaw } from '/@/router/types';

import { RouteMeta } from 'vue-router';

export function transformMenuDataToAppRouteRecord(
  menuListData: IMenuListDataItem,
): AppRouteRecordRaw[] {
  //
  const menuList = menuListData.list;
  menuList.sort((a, b) => {
    return a.orderNum - b.orderNum;
  });

  const tempMap: any = {};
  const menuLevelList: IMenuRawData[] = [];
  function traverseListFunc(menuItem: IMenuRawData, parentItem?: IMenuRawData) {
    if (!parentItem) {
      //最外层
      menuLevelList.push(menuItem);
    } else {
      if (!parentItem.children) {
        parentItem.children = [];
      }
      parentItem.children.push(menuItem);
    }
  }
  const levelMap: { [key: number | string]: IMenuRawData[] } = {};
  menuList.map((ele) => {
    tempMap[ele.id] = ele;
    if (!levelMap[ele.menuLevel]) {
      levelMap[ele.menuLevel] = [];
    }
    levelMap[ele.menuLevel].push(ele);
  });
  for (let i = 0; i < Object.keys(levelMap).length; i++) {
    //
    const tempLevelList = levelMap[i];
    tempLevelList.map((ele) => {
      if (ele.levelLevel === 0) {
        traverseListFunc(ele, undefined);
      } else {
        traverseListFunc(ele, tempMap[ele.parentId]);
      }
    });
  }
  const appRouteRecordList: any[] = [];
  const routesMap: any = {};
  const transformItemFunc = (menuItem: IMenuRawData) => {
    const rItem = transformToAppRouteRecordItem(menuItem);
    routesMap[rItem.fullPath!] = rItem;
    try {
      if (rItem.meta!.menuLevel == 0) {
        appRouteRecordList.push(rItem);
      } else {
        //
        const parentRoute = routesMap[rItem.meta!.parentId!];
        if (parentRoute) {
          if (!parentRoute.children) {
            parentRoute.children = [];
          }
          parentRoute.children.push(rItem);
        }
      }
    } catch (e) {
      debugger;
    }
  };
  const traverseListFunc1 = (item: IMenuRawData) => {
    const menuItem: IMenuRawData = tempMap[item.id];
    transformItemFunc(menuItem);
    if (item.children && item.children.length > 0) {
      item.children.map((child) => {
        traverseListFunc1(child);
      });
    }
  };
  menuLevelList.forEach((ele) => {
    traverseListFunc1(ele);
  });
  // debugger;
  return appRouteRecordList;
}

export function transformToAppRouteRecordItem(item: IMenuRawData): AppRouteRecordRaw {
  const metaItem: RouteMeta = {} as RouteMeta;
  metaItem.title = item.label;
  if (item.redirect) {
    metaItem.redirect = item.redirect;
  }
  metaItem.icon = item.icon || '';
  metaItem.menuLevel = item.menuLevel;
  if (item.externalLinkUrl) {
    metaItem.frameSrc = item.externalLinkUrl;
  }
  metaItem.hideMenu = item.hiddenInMenu;
  metaItem.parentId = item.parentId;
  metaItem.menuType = item.menuType;
  metaItem.isLink = item.openLinkUseExternal;
  metaItem.serverId = item.serverId;
  metaItem.project_id = item.project_id;
  metaItem.orderNo = item.orderNum;

  if (item.menuLevel === 0 && item.menuType === 'endPoint') {
    //一层菜单

    const returnItem: AppRouteRecordRaw = {
      name: item.label,
      meta: {
        title: item.label,
        icon: item.icon || '',
        menuLevel: 0,
        hideChildrenInMenu: true,
      },
      fullPath: '/' + item.path,
      component: 'layout',
      path: '/' + item.path,
      redirect: item.id,
      children: [
        {
          name: item.label,
          meta: metaItem,
          component: 'Test',
          path: item.path + '.index',
        },
      ],
    };
    return returnItem;
  } else {
    const returnItem: AppRouteRecordRaw = {
      name: item.label,
      meta: metaItem,
      fullPath: item.id,
      path: item.path,
      component: item.menuLevel === 0 ? 'layout' : 'Test',
    };
    return returnItem;
  }
}
