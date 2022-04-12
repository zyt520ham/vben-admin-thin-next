import type {
  ProjectConfig,
  HeaderSetting,
  MenuSetting,
  TransitionSetting,
  MultiTabsSetting,
} from '/#/config';
import type { BeforeMiniState } from '/#/store';

import { defineStore } from 'pinia';
import { store } from '/@/store';

import { ThemeEnum } from '/@/enums/appEnum';
import { APP_DARK_MODE_KEY_ } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';
import { darkMode } from '/@/settings/designSetting';
import { resetRouter } from '/@/router';
import { deepCopy, deepMerge } from '/@/utils';
import { useUserStoreWithOut } from '/@/store/modules/user';
import projectSetting from '/@/settings/projectSetting';

interface AppState {
  darkMode?: ThemeEnum;
  // Page loading status
  pageLoading: boolean;
  // project config
  projectConfig: ProjectConfig | null;
  // When the window shrinks, remember some states, and restore these states when the window is restored
  beforeMiniInfo: BeforeMiniState;
}
let timeId: TimeoutHandle;
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: deepCopy(projectSetting),
    beforeMiniInfo: {},
  }),
  getters: {
    getPageLoading(): boolean {
      return this.pageLoading;
    },
    getDarkMode(): 'light' | 'dark' | string {
      return this.darkMode || localStorage.getItem(APP_DARK_MODE_KEY_) || darkMode;
    },

    getBeforeMiniInfo(): BeforeMiniState {
      return this.beforeMiniInfo;
    },

    getProjectConfig(): ProjectConfig {
      return this.projectConfig || ({} as ProjectConfig);
    },

    getHeaderSetting(): HeaderSetting {
      return this.getProjectConfig.headerSetting;
    },
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting;
    },
    getTransitionSetting(): TransitionSetting {
      return this.getProjectConfig.transitionSetting;
    },
    getMultiTabsSetting(): MultiTabsSetting {
      return this.getProjectConfig.multiTabsSetting;
    },
  },
  actions: {
    loadLoginUserProjCfg() {
      console.log('-------------loadLoginUserProjCfg');
      const userId = useUserStoreWithOut().getUserId || '';
      const userLocal = Persistent.getProjCfgLocal<ProjectConfig>(userId);
      console.log('xxxxxxxxx', userLocal);
      if (userLocal) {
        this.projectConfig = deepMerge(this.projectConfig || {}, userLocal);
      }
    },
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading;
    },

    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode;
      localStorage.setItem(APP_DARK_MODE_KEY_, mode);
    },

    setBeforeMiniInfo(state: BeforeMiniState): void {
      this.beforeMiniInfo = state;
    },

    setProjectConfig(config: DeepPartial<ProjectConfig>, useCache = false): void {
      // debugger;
      // debugger;
      this.projectConfig = deepMerge(this.projectConfig || {}, config);
      if (useCache) {
        // Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig, useCache);
        Persistent.updateProjCfgLocal(useUserStoreWithOut().getUserId, this.projectConfig!);
      }
    },

    async resetAllState(immediate = false) {
      resetRouter();
      this.darkMode = undefined;
      this.pageLoading = false;
      const nProjSetting = deepCopy(projectSetting);

      this.setProjectConfig(nProjSetting, false);
      // this.projectConfig = Object.assign({}, projectSetting);
      this.beforeMiniInfo = {};
      Persistent.clearAll(immediate);
    },
    async setPageLoadingAction(loading: boolean): Promise<void> {
      if (loading) {
        clearTimeout(timeId);
        // Prevent flicker
        timeId = setTimeout(() => {
          this.setPageLoading(loading);
        }, 50);
      } else {
        this.setPageLoading(loading);
        clearTimeout(timeId);
      }
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
