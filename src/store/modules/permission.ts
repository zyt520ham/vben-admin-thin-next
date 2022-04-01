import type { AppRouteRecordRaw, Menu } from '/@/router/types';

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from './user';
import { useAppStoreWithOut } from './app';
import { toRaw } from 'vue';
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';

import projectSetting from '/@/settings/projectSetting';

import { PermissionModeEnum } from '/@/enums/appEnum';

import { asyncRoutes } from '/@/router/routes';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';

import { filter } from '/@/utils/helper/treeHelper';

import { addMenuItemApi, getMenuList, updateMenuItemApi } from '/@/api/sys/menu';

import { useMessage } from '/@/hooks/web/useMessage';
import { PageEnum } from '/@/enums/pageEnum';
import { IMenuListDataItem, IReqAddMenuItem, IReqEditMenuItem } from '/@/api/model/menuModel';
import { transformMenuDataToAppRouteRecord } from '/@/store/utils/MenuDataHelper';
import { resetRouter, router } from '/@/router';
import { RouteRecordRaw } from 'vue-router';
import { routesListChanged } from '/@/layouts/iframe/useFrameKeepAlive';
import { useProjsStoreWithOut } from '/@/store/modules/projectsStore';
import { error, log, logNoTrace } from '/@/utils/log';
import { getUserPermissionsListApi } from '/@/api/sys/user';
import { IPermissionDataItem, permissionMenuType } from '/@/api/model/userModel';

interface PermissionState {
  // Permission code list
  permCodeList: string[] | number[];
  // Whether the route has been dynamically added
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  lastBuildMenuTime: number;
  // Backstage menu list
  backMenuList: Menu[];
  backMenuMap: { [key: string]: Menu };
  frontMenuList: Menu[];
  // user 权限列表
  permMenusList: string[];
}
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
    backMenuMap: {},
    // menu List
    frontMenuList: [],
    permMenusList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getBackMenuMap(): { [key: string]: Menu } {
      return this.backMenuMap;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
    getPermMenusList(): string[] {
      return this.permMenusList;
    },
  },
  actions: {
    setPermMenusList(menuList: string[]) {
      this.permMenusList = menuList;
    },
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      const toMapFunc = (menuItem) => {
        this.backMenuMap[menuItem.path] = menuItem;
        if (menuItem.children?.length > 0) {
          menuItem.children.map((subItem) => {
            toMapFunc(subItem);
          });
        }
      };
      list.map((menuItem) => {
        toMapFunc(menuItem);
      });
      list?.length > 0 && this.setLastBuildMenuTime();
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.backMenuMap = {};
      this.lastBuildMenuTime = 0;
    },

    searchBackMenuByPath(path: string) {
      if (this.backMenuMap[path]) {
        return this.backMenuMap[path];
      }
      return null;
    },
    async changePermissionCode() {
      // const codeList = await getPermCode();
      // this.setPermCodeList(codeList);
    },
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n();
      const userStore = useUserStore();
      const appStore = useAppStoreWithOut();

      let routes: AppRouteRecordRaw[] = [];
      const roleList = toRaw(userStore.getRoleList) || [];
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig;

      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { roles } = meta || {};
        if (!roles) return true;
        return roleList.some((role) => roles.includes(role));
      };

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath: string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }
        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return;
      };

      switch (permissionMode) {
        case PermissionModeEnum.ROLE:
          routes = filter(asyncRoutes, routeFilter);
          routes = routes.filter(routeFilter);
          // Convert multi-level routing to level 2 routing
          routes = flatMultiLevelRoutes(routes);
          break;

        case PermissionModeEnum.ROUTE_MAPPING:
          routes = filter(asyncRoutes, routeFilter);
          routes = routes.filter(routeFilter);
          const menuList = transformRouteToMenu(routes, true);
          routes = filter(routes, routeRemoveIgnoreFilter);
          routes = routes.filter(routeRemoveIgnoreFilter);
          menuList.sort((a, b) => {
            return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
          });

          this.setFrontMenuList(menuList as any);
          // Convert multi-level routing to level 2 routing
          routes = flatMultiLevelRoutes(routes);
          break;

        //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
        case PermissionModeEnum.BACK:
          const { createMessage } = useMessage();

          createMessage.loading({
            content: t('sys.app.menuLoading'),
            duration: 1,
          });

          // !Simulate to obtain permission codes from the background,
          // this function may only need to be executed once, and the actual project can be put at the right time by itself
          let routeList: AppRouteRecordRaw[] = [];
          try {
            //TODO:: 还不知道此接口作用  看文档说是按钮权限相关

            // this.changePermissionCode();
            // const menuDataList: IMenuListDataItem =  await getMenuList();

            // //添加多级测试路由
            // menuDataList.list.push(...(testMenus as any));
            routeList = (await this.loadServerMenusData()) || []; //transformMenuDataToAppRouteRecord(menuDataList || { list: [] });
          } catch (error) {
            console.error(error);
          }

          // Dynamically introduce components
          routeList = transformObjToRoute(routeList);

          //  Background routing to menu structure
          const backMenuList = transformRouteToMenu(routeList);
          this.setBackMenuList(backMenuList as any);

          // remove meta.ignoreRoute item
          routeList = filter(routeList, routeRemoveIgnoreFilter);
          routeList = routeList.filter(routeRemoveIgnoreFilter);

          routeList = flatMultiLevelRoutes(routeList);
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
          break;
      }

      routes.push(ERROR_LOG_ROUTE);
      //首页显示处理
      patchHomeAffix(routes);
      // 项目列表处理
      useProjsStoreWithOut().checkAllProjects();
      return routes;
    },
    //重新拉取服务端菜单列表
    refreshLoadServerMenus() {
      return new Promise<void>(async (resolve) => {
        let routeList = await this.loadServerMenusData();
        log('refreshLoadServerMenus', routeList);
        // Dynamically introduce components
        routeList = transformObjToRoute(routeList as any);

        //  Background routing to menu structure
        const backMenuList = transformRouteToMenu(routeList);
        this.setBackMenuList(backMenuList as any);

        // remove meta.ignoreRoute item
        // routeList = filter(routeList, routeRemoveIgnoreFilter);
        // routeList = routeList.filter(routeRemoveIgnoreFilter);
        let routes: AppRouteRecordRaw[] = [];
        routeList = flatMultiLevelRoutes(routeList);
        routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
        resetRouter();

        routes.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw);
        });

        router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);

        this.setDynamicAddedRoute(true);
        routesListChanged();

        resolve();
      });
    },
    //从服务器拉去menuList
    async loadServerMenusData() {
      let routeList: AppRouteRecordRaw[] = [];
      try {
        //TODO:: 还不知道此接口作用  看文档说是按钮权限相关
        // this.changePermissionCode();
        const p1 = getMenuList();
        const p2 = getUserPermissionsListApi();
        try {
          const values = await Promise.all([p1, p2]);
          const menuDataList: IMenuListDataItem = values[0];
          const permissionsList: IPermissionDataItem = values[1];
          //设置权限列表
          this.parsePermissionsMenus(permissionsList.menu);
          //针对服务端菜单做菜单权限过滤
          const tempList: any[] = [];
          menuDataList.list.map((ele) => {
            if (this.getPermMenusList.includes(ele.id)) {
              tempList.push(ele);
            }
          });
          menuDataList.list = tempList;
          // const permissionsMenus: string[] = flattenFn(permissionsList.menu);

          // //TODO:: 添加多级测试路由
          // menuDataList.list.push(...(testMenus as any));

          routeList = transformMenuDataToAppRouteRecord(menuDataList || { list: [] });
          console.log('转换后的AppRouteRecord:', routeList);
        } catch (e) {
          return [];
        }

        return routeList;
      } catch (error) {
        debugger;
        console.error(error);

        return null;
      }
    },

    //新增菜单逻辑
    async addMenuItem(menuItem: IReqAddMenuItem) {
      console.log('addMenuItem', menuItem);
      try {
        const resp = await addMenuItemApi(menuItem);
        logNoTrace(resp);
        await this.refreshLoadServerMenus();
      } catch (e: any) {
        error(e.retMsg!);
      }
    },
    async updateMenuItem(menuItem: IReqEditMenuItem) {
      console.log('updateMenuItem', menuItem);
      try {
        const resp = await updateMenuItemApi(menuItem);
        logNoTrace(resp);
        await this.refreshLoadServerMenus();
      } catch (e: any) {
        error(e.retMsg!);
      }
    },

    parsePermissionsMenus(menus: permissionMenuType[]) {
      const pathList: string[] = [];
      const parseChildren = (childrenItem: permissionMenuType) => {
        pathList.push(childrenItem.id);
        if (childrenItem.children?.length > 0) {
          childrenItem.children.map((ele) => {
            parseChildren(ele);
          });
        }
      };
      menus.map((ele) => {
        parseChildren(ele);
      });
      this.setPermMenusList(pathList);
    },
  },
});

// Need to be used outside the setup
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
