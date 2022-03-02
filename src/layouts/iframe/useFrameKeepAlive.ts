import type { AppRouteRecordRaw } from '/@/router/types';

import { computed, toRaw, unref } from 'vue';

import { useMultipleTabStore } from '/@/store/modules/multipleTab';

import { uniqBy } from 'lodash-es';

import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';

import { router } from '/@/router';
const iframeRoutes: any[] = []; //用来缓存上次计算出的iframe路由
export function useFrameKeepAlive() {
  // const router = useRouter();
  const { currentRoute } = router;
  const { getShowMultipleTab } = useMultipleTabSetting();
  const tabStore = useMultipleTabStore();
  // const getFramePages = computed(() => {
  //   const ret = getAllFramePages(toRaw(allRoutes.value) as unknown as AppRouteRecordRaw[]) || [];
  //   return ret;
  // });

  function getFramePages(vRoutes?: any[]) {
    if (vRoutes) {
      const tempRoutes = getAllFramePages(toRaw(vRoutes) as unknown as AppRouteRecordRaw[]);
      iframeRoutes.push(...tempRoutes);
    }
    if (iframeRoutes.length == 0) {
      const tempRoutes = getAllFramePages(
        toRaw(router.getRoutes()) as unknown as AppRouteRecordRaw[],
      );
      iframeRoutes.push(...tempRoutes);
    }
    return iframeRoutes;
  }

  const getOpenTabList = computed((): string[] => {
    return tabStore.getTabList.reduce((prev: string[], next) => {
      if (next.meta && Reflect.has(next.meta, 'frameSrc')) {
        prev.push(next.name as string);
      }
      return prev;
    }, []);
  });

  function getAllFramePages(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
    let res: AppRouteRecordRaw[] = [];
    for (const route of routes) {
      const { meta: { frameSrc } = {}, children } = route;
      if (frameSrc) {
        res.push(route);
      }
      if (children && children.length) {
        res.push(...getAllFramePages(children));
      }
    }
    res = uniqBy(res, 'name');
    return res;
  }

  function showIframe(item: AppRouteRecordRaw) {
    return item.name === unref(currentRoute).name;
  }

  function hasRenderFrame(name: string) {
    if (!unref(getShowMultipleTab)) {
      return router.currentRoute.value.name === name;
    }
    return unref(getOpenTabList).includes(name);
  }
  function reloadIFrameRoutes() {
    getFramePages(router.getRoutes());
  }
  return { hasRenderFrame, getFramePages, showIframe, getAllFramePages, reloadIFrameRoutes };
}
export function routesListChanged() {
  const { reloadIFrameRoutes } = useFrameKeepAlive();
  reloadIFrameRoutes();
}
