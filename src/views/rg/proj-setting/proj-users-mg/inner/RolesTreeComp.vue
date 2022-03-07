<!--
 * @Description  : 项目树形表
 * @Author       : zhangyantao
 * @Date         : 2022/3/4
 * @FilePath     : src/views/rg/sys-settings/account-list/inner/ProjectsTreeComp.vue
-->
<template>
  <div class="w-full">
    <BasicTree
      title="项目列表"
      :toolbar="false"
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      :replaceFields="replaceFieldsData"
      @select="handleSelectFn"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTree, ReplaceFields } from '/@/components/Tree';
  import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

  export default defineComponent({
    name: 'RolesTreeComp',
    components: {
      BasicTree,
    },
    props: {
      propTreeData: {
        type: Array as PropType<TreeDataItem[]>,
        required: true,
        default: undefined,
      },
      propReplaceFields: {
        type: Object as PropType<ReplaceFields>,
        required: true,
        default: undefined,
      },
    },
    emits: ['select'],
    setup(props, { emit }) {
      const replaceFieldsData = ref<ReplaceFields>(props.propReplaceFields as any);
      const treeData = ref<TreeDataItem>(props.propTreeData as any);
      const handleSelectFn = (selectedKeys: string[]) => {
        if (selectedKeys.length > 0) {
          emit('select', selectedKeys[0]);
        }
      };
      return {
        handleSelectFn,
        treeData,
        replaceFieldsData,
      };
    },
  });
</script>

<style scoped lang="less"></style>
