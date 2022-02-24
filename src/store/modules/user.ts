import type { IUserInfo, UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { ILoginParams, ILoginServerData, LoginParams } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { h } from 'vue';

interface UserState {
  userInfo: Nullable<UserInfo>;
  userInfo_v1: Nullable<IUserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;

  loginInfo: Nullable<ILoginServerData>;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    loginInfo: null,
    userInfo_v1: null,
  }),
  getters: {
    getLoginInfo(): ILoginServerData | null {
      let loginInfo = null;
      const cacheLoginInfo = getAuthCache<string>(TOKEN_KEY);
      if (cacheLoginInfo) {
        try {
          loginInfo = JSON.parse(cacheLoginInfo);
        } catch {
          debugger;
        }
      }

      return this.loginInfo || loginInfo;
    },
    getUserInfoV1(): IUserInfo | null {
      return this.userInfo_v1;
    },
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || this.getLoginInfo?.login_token || '';
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY) || [];
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setLoginInfo(vLoginInfo: ILoginServerData | null) {
      if (!vLoginInfo) {
        setAuthCache(TOKEN_KEY, '');
        this.loginInfo = null;
      } else {
        this.loginInfo = Object.assign({}, vLoginInfo);
        setAuthCache(TOKEN_KEY, JSON.stringify(vLoginInfo));
      }
    },
    setUserInfoV1(vUserInfo: IUserInfo | null) {
      if (vUserInfo) {
        this.userInfo_v1 = Object.assign({}, vUserInfo);
        this.lastUpdateTime = new Date().getTime();
        setAuthCache(USER_INFO_KEY, vUserInfo);
      } else {
        this.userInfo_v1 = null;
        setAuthCache(USER_INFO_KEY, null);
      }
    },
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      // setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      // setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.loginInfo = null;
      this.roleList = [];
      this.sessionTimeout = false;
      this.userInfo_v1 = null;
      this.loginInfo = null;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<IUserInfo | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const requestParams: ILoginParams = {
          account: loginParams.username,
          password: loginParams.password,
        };

        const data: ILoginServerData = await loginApi(requestParams, mode);

        // save token
        this.setLoginInfo(data);
        this.setToken(data.login_token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<IUserInfo | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;

      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();

          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }

        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<IUserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo({ user_id: this.getLoginInfo!.user_id });
      this.setUserInfoV1(userInfo);
      // debugger;
      // const { roles = [] } = userInfo;
      // if (isArray(roles)) {
      //   const roleList = roles.map((item) => item.value) as RoleEnum[];
      //   this.setRoleList(roleList);
      // } else {
      //   userInfo.roles = [];
      //   this.setRoleList([]);
      // }
      // this.setUserInfo(userInfo);
      return userInfo as IUserInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setLoginInfo(null);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      this.setUserInfoV1(null);

      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
