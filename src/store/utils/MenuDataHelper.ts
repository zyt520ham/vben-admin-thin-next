import { IMenuListDataItem, IMenuRawData } from '/@/api/sys/model/menuModel';
import { AppRouteRecordRaw } from '/@/router/types';

import { RouteMeta } from 'vue-router';
import { compNameEnum, compPathMap, compsList } from '/@/enums/CompPathEnum';

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
  // if (item.label == 'aa') {
  //   debugger;
  // }
  metaItem.title = item.label;
  metaItem.currentPath = item.path;
  if (item.redirect) {
    metaItem.redirect = item.redirect;
  }
  metaItem.icon = item.icon ? `${item.icon}|svg` : '';
  metaItem.menuLevel = item.menuLevel;

  if (item.externalLinkUrl) {
    if (item.openLinkUseExternal) {
      metaItem.openLinkUseExternal = item.openLinkUseExternal;
      metaItem.isLink = item.openLinkUseExternal;
      // metaItem.currentPath = item.externalLinkUrl;

      metaItem.frameSrc = item.externalLinkUrl;
      metaItem.paramPath = item.externalLinkUrl;
    } else {
      metaItem.frameSrc = item.externalLinkUrl;
      // metaItem.paramPath = item.externalLinkUrl;
    }
  }
  metaItem.hideMenu = item.hiddenInMenu;
  metaItem.parentId = item.parentId;
  metaItem.menuType = item.menuType;
  // metaItem.isLink = item.openLinkUseExternal;
  metaItem.serverId = item.serverId;
  metaItem.project_id = item.project_id;
  metaItem.orderNo = item.orderNum;

  metaItem.compPath = compentPathReplace(item);
  metaItem.compsKey = item.compsKey;
  if (item.menuLevel === 0 && item.menuType === 'endPoint') {
    //一层菜单

    const returnItem: AppRouteRecordRaw = {
      name: item.label,
      meta: metaItem,
      fullPath: '/' + metaItem.currentPath,
      component: metaItem.compPath,
      path: '/' + metaItem.currentPath,
      // redirect: item.id,
      // children: [
      //   {
      //     name: item.label,
      //     meta: metaItem,
      //     component: compentPathReplace(item),
      //     path: item.path + '.index',
      //   },
      // ],
    };
    return returnItem;
  } else {
    const returnItem: AppRouteRecordRaw = {
      name: item.label,
      meta: metaItem,
      fullPath: item.id,
      path: metaItem.currentPath,
      component: metaItem.compPath,
    };
    return returnItem;
  }
}

enum eCompsKeyEnum {
  kLayoutIndex = 'LayoutIndex',
  kRouteMiddleView = 'RouterMiddleView',
  kHome = 'Home',
  kTestVue = 'TestVue',
  kMenu1_1 = 'menu1-1',
  kMenu1_2_1 = 'menu1-2-1',
  kMenu1_2_2 = 'menu1-2-2',
  kMenu1_3 = 'menu1-3',
  kMenu2 = 'menu2',
  kMenu3 = 'menu3',
  kSysUserListView = 'SysUserListView',
  kSysMenuMgView = 'SysMenuMgView',
  kSysRoleMgView = 'SysRoleMgView',
  kSysAuthorityView = 'SysAuthorityView',
  kSysUserProfile = 'SysUserProfileView',
  kSysMyDepartment = 'SysMyDepartmentView',
  kSysDepartmentMgView = 'SysDepartmentMgView',
  kIFrameView = 'IFrameView',
  kIFrameUseToken = 'IFrameUseTokenView',
  kSysProjUserMg = 'SysProjUserMg',
  kSysProjRoleMg = 'SysProjRolesMgView',
  kSysProjDetailView = 'SysProjDetailView',
  kSysProjPermissionMg = 'SysProjPermissionMg',
  kSysProjMenusMg = 'SysProjMenusMg',
}

export function compentPathReplace(item: IMenuRawData): string {
  // if (item.label === 'aa') {
  //   debugger;
  // }
  let compPath = item.compsKey;
  if (item.menuLevel == 0 && item.menuType === 'rootpath') {
    return 'layout';
  } else if (item.menuLevel > 0 && item.menuType === 'middlepath') {
    return 'ParentLayout';
  } else if (item.useExternalLink) {
    return '';
  }
  // else {
  //   return 'Test';
  // }
  //新的修正过的keyname，不用走老的映射方式获取了
  if (compsList.includes(item.compsKey as any)) {
    compPath = compPathMap[item.compsKey];
    return compPath;
  }
  switch (item.compsKey) {
    case eCompsKeyEnum.kLayoutIndex:
      compPath = 'layout';
      item.compsKey = 'layout';
      break;
    case eCompsKeyEnum.kRouteMiddleView:
      compPath = 'ParentLayout';
      item.compsKey = 'RouterMiddleView';
      break;
    case eCompsKeyEnum.kSysProjUserMg:
      compPath = compPathMap[compNameEnum.kProjUsersMgView];
      item.compsKey = compNameEnum.kProjUsersMgView;
      break;
    case eCompsKeyEnum.kSysProjRoleMg:
      compPath = compPathMap[compNameEnum.kProjRolesListMgView];
      item.compsKey = compNameEnum.kProjRolesListMgView;
      break;
    case eCompsKeyEnum.kSysProjDetailView:
      compPath = compPathMap[compNameEnum.kProjDetailView];
      item.compsKey = compNameEnum.kProjDetailView;
      break;
    case eCompsKeyEnum.kSysProjPermissionMg:
      compPath = compPathMap[compNameEnum.kProjPermissionsMgView];
      item.compsKey = compNameEnum.kProjPermissionsMgView;
      break;
    case eCompsKeyEnum.kSysProjMenusMg:
      compPath = compPathMap[compNameEnum.kProjMenusListMgView];
      item.compsKey = compNameEnum.kProjMenusListMgView;
      break;
    //////////////////////////
    case eCompsKeyEnum.kSysMyDepartment:
      compPath = compPathMap[compNameEnum.kSysUserProjsView];
      item.compsKey = compNameEnum.kSysUserProjsView;
      break;
    case eCompsKeyEnum.kSysUserProfile:
      compPath = compPathMap[compNameEnum.kSysUserProfilesView];
      item.compsKey = compNameEnum.kSysUserProfilesView;
      break;
    //////////////////////////
    case eCompsKeyEnum.kSysUserListView:
      compPath = compPathMap[compNameEnum.kSysUsersListMgView];
      item.compsKey = compNameEnum.kSysUsersListMgView;
      break;
    case eCompsKeyEnum.kSysDepartmentMgView:
      compPath = compPathMap[compNameEnum.kSysProjsListMgView];
      item.compsKey = compNameEnum.kSysProjsListMgView;
      break;
    /////////////////////////////
    case eCompsKeyEnum.kMenu1_1:
      compPath = 'rg/leve-menus/Menu1-1.vue';
      break;
    case eCompsKeyEnum.kMenu1_2_1:
      compPath = 'rg/leve-menus/Menu1-1-2.vue';
      break;
    case eCompsKeyEnum.kMenu1_2_2:
      compPath = 'rg/leve-menus/Menu1-1-2.vue';
      break;
    case eCompsKeyEnum.kMenu1_3:
      compPath = 'rg/leve-menus/Menu1-3.vue';
      break;
    case eCompsKeyEnum.kMenu2:
      compPath = 'rg/leve-menus/Menu2.vue';
      break;
    case eCompsKeyEnum.kMenu3:
      compPath = 'rg/leve-menus/Menu3.vue';
      break;

    /////////////////////////////
    case 'Home':
      compPath = 'rg/home/Home.vue';
    default:
  }
  return compPath;
}
