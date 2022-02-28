<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition
        :name="
          getTransitionName({
            route,
            openCache,
            enableTransition: getEnableTransition,
            cacheTabs: getCaches,
            def: getBasicTransition,
          })
        "
        mode="out-in"
        appear
      >
        <keep-alive v-if="canOpenCache(route)">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </RouterView>
  <FrameLayout v-if="getCanEmbedIFramePage" />
</template>

<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';

  import FrameLayout from '/@/layouts/iframe/index.vue';

  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { getTransitionName } from './transition';

  import { useMultipleTabStore } from '/@/store/modules/multipleTab';
  import { RouteLocationNormalized } from 'vue-router';

  export default defineComponent({
    name: 'PageLayout',
    components: { FrameLayout },
    setup() {
      const { getShowMultipleTab } = useMultipleTabSetting();
      // const tabStore = useMultipleTabStore();

      const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting();

      const { getBasicTransition, getEnableTransition } = useTransitionSetting();

      const openCache = computed(() => {
        if (unref(getOpenKeepAlive) && unref(getShowMultipleTab)) {
          //缓存页面大前提允许
          return true;
        }
        return false;
      });

      const getCaches = computed((): string[] => {
        if (!unref(getOpenKeepAlive)) {
          return [];
        }
        const list = useMultipleTabStore().getCachedTabList;
        return list;
      });
      function canOpenCache(route: RouteLocationNormalized) {
        if (openCache.value) {
          //缓存页面大前提允许
          if (route.meta.ignoreKeepAlive) {
            return false;
          }
          return true;
        } else {
          return false;
        }
      }
      return {
        getTransitionName,
        openCache,
        getCaches,
        canOpenCache,
        getEnableTransition,
        getBasicTransition,
        getCanEmbedIFramePage,
      };
    },
  });
</script>
