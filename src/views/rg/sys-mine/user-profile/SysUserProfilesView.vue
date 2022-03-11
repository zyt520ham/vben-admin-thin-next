<!--
 * @Description  : 项目个人信息修改页面
 * @Author       : zhangyantao
 * @Date         : 2022/2/25
 * @FilePath     : src/views/rg/sys-mine/SysUserProfilesView.vue
-->
<template>
  <PageWrapper :class="`${prefixCls}`" contentFullHeight dense>
    <div class="w-full h-full flex space-x-5px p-5px">
      <div class="w-1/3 h-full">
        <a-card title="用户信息" class="w-full max-h-full rg-antd-cart overflow-auto">
          <UserProfileInfoView />
        </a-card>
      </div>
      <div class="w-2/3 h-full">
        <a-card class="rg-antd-cart">
          <a-tabs v-model:activeKey="tabActiveKey">
            <a-tab-pane key="userProfileTab1">
              <template #tab>
                <span>
                  <EditOutlined />
                  <apple-outlined />
                  基本资料
                </span>
              </template>
              <UserBasicFormComp />
            </a-tab-pane>
            <a-tab-pane key="userProfileTab2">
              <template #tab>
                <span>
                  <KeyOutlined />
                  密码
                </span>
              </template>
              <ChangePassword />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import UserProfileInfoView from './inner/UserProfileInfoView.vue';
  import { EditOutlined, KeyOutlined } from '@ant-design/icons-vue';
  import ChangePassword from './inner/password/ChangePassword.vue';
  import UserBasicFormComp from './inner/UserBasicFormComp.vue';

  export default defineComponent({
    name: 'SysUserProfilesView',
    components: {
      PageWrapper,
      UserProfileInfoView,
      EditOutlined,
      KeyOutlined,
      ChangePassword,
      UserBasicFormComp,
    },
    setup() {
      const { prefixCls } = useDesign('sys-user-profile');

      //#region tabbar =================================
      const tabActiveKey = ref('userProfileTab1');
      //#endregion
      return {
        prefixCls,
        tabActiveKey,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-sys-user-profile';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
  }
</style>
