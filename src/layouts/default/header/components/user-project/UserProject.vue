<!--
 * @Description  : 显示项目组件
 * @Author       : zhangyantao
 * @Date         :
 * @FilePath     : src/layouts/default/header/components/user-project/UserProject.vue
-->
<template>
  <div :class="`${prefixCls}`" class="p-1" @click="changeModalFn(true)">
    <Tooltip title="点击切换项目" placement="bottom">
      <template #default>
        <span class="mx-5px">{{ projectNameComputed }}</span>
      </template>
    </Tooltip>
    <ChangeProjectModal @register="registerChangeProjectModal" />
  </div>
</template>
<script lang="ts">
  export default {
    name: 'UserProject',
  };
</script>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Tooltip } from 'ant-design-vue';
  import ChangeProjectModal from '/@/layouts/default/header/components/change-project/ChangeProjectModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useProjsStoreWithOut } from '/@/store/modules/projectsStore';
  import { IProjectInfo } from '/#/store';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  const { prefixCls } = useDesign('user-project');
  // const showModal = ref(false);
  const changeModalFn = (showModal: boolean) => {
    if (showModal) {
      changeProjMethods.openModal(true);
    }
  };
  const projectNameComputed = computed(() => {
    const allProjsMap = useProjsStoreWithOut().getAllProjectsMap;
    const proj: IProjectInfo = allProjsMap[useUserStoreWithOut().getLoginInfo?.project || ''];
    if (proj) {
      return '当前项目：' + proj.project_name;
    }
    return '';
  });

  const [registerChangeProjectModal, changeProjMethods] = useModal();
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-user-project';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
  }
</style>
