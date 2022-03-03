<!--
 * @Description  : SysUsersListMg.vue
 * @Author       : zhangyantao
 * @Date         : 2022/2/25
 * @FilePath     : src/views/rg/sys-settings/SysUsersListMg.vue
-->
<template>
  <!--  <PageWrapper dense :class="`${prefixCls}`">-->
  <!--    <div class="w-1/3 lg:w-1/5 xl:w-1/6 h-full">-->
  <!--      <a-card class="w-full rg-antd-cart" :bordered="true" hoverable />-->
  <!--    </div>-->
  <!--    <div class="w-2/3 lg:w-4/5 xl:w-5/6 h-full"></div>-->
  <!--  </PageWrapper>-->
  <span>SysUsersListMg</span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  // import { useDesign } from '/@/hooks/web/useDesign';
  // import PageWrapper from '/@/components/Page/src/PageWrapper.vue';

  export default defineComponent({
    name: 'SysUsersListMg',
    components: {},
    setup() {
      const prefixCls = ''; //useDesign('sys-users-mg');

      return {
        prefixCls,
      };
    },
  });
</script>

<style scoped lang="less">
  //@prefix-cls: ~'@{namespace}-sys-users-mg';
  //@ns-prefix: ~'@{namespace}';
  //.@{prefix-cls} {
  //  width: 100%;
  //  height: 100%;
  //  background-color: #ebeef5;
  //  padding: 0;
  //  margin: 0;
  //}
</style>
