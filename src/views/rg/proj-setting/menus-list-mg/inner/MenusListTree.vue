<template>
  <BasicTree
    ref="menusTreeRef"
    search
    toolbar
    :tree-data="menuTreeData"
    :replace-fields="replaceFields"
    :clickRowToExpand="false"
    checkStrictly
    :selectable="true"
    :action-list="actionList"
    @select="treeSelectEventFn"
  />
</template>

<script lang="ts">
  import { computed, defineComponent, h, onMounted, ref, VNode } from 'vue';
  import BasicTree from '/@/components/Tree/src/Tree.vue';
  import { usePermissionStoreWithOut } from '/@/store/modules/permission';
  import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
  import { ActionItem, TreeActionType } from '/@/components/Tree';
  import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { log } from '/@/utils/log';
  export default defineComponent({
    name: 'MenusListTree',
    components: { BasicTree },
    emits: ['changedSelectedTree'],
    setup(_, { emit, expose }) {
      //#region life cycle =================================
      onMounted(() => {
        actionList.value = [
          {
            render: (node: VNode) => {
              return h(PlusOutlined, {
                class: 'ml-2 text-blue-500',
                onClick: (e) => {
                  treeHandlePlusFn(node);
                  e.stopPropagation();
                },
              });
            },
          },
          {
            render: (node: VNode) => {
              return h(DeleteOutlined, {
                class: 'ml-2 text-blue-500',
                onClick: (e) => {
                  treeHandleDeleteFn(node);
                  e.stopPropagation();
                },
              });
            },
          },
        ];
        if (menuTreeData.value.length > 0) {
          const item = menuTreeData.value[0];
          lastSelectKey = item.path;
          menusTreeRef.value!.setSelectedKeys([lastSelectKey]);
          emit('changedSelectedTree', lastSelectKey, item);
        }
      });
      //#endregion ---------------------------
      //#region tree =================================
      const menusTreeRef = ref<Nullable<TreeActionType>>(null);
      const treeHandlePlusFn = (node: VNode) => {
        console.log('treeHandlePlusFn', node);
      };
      const treeHandleDeleteFn = (node: VNode) => {
        console.log('treeHandleDeleteFn', node);
      };
      let lastSelectKey = '';
      const treeSelectEventFn = (selectedKeys: string[], e: any) => {
        log('treeSelectEventFn', selectedKeys, e);
        if (e.selected === true) {
          lastSelectKey = selectedKeys[0];
          const selectedItem = e.selectedNodes[0].props;
          emit('changedSelectedTree', lastSelectKey, selectedItem);
        } else {
          menusTreeRef.value!.setSelectedKeys([lastSelectKey]);
        }
      };
      //#endregion -------------------------------

      const menuTreeData = computed<TreeDataItem[]>(() => {
        return usePermissionStoreWithOut().getBackMenuList as any;
      });
      const replaceFields = {
        key: 'path',
        title: 'name',
        children: 'children',
      };
      const actionList = ref<ActionItem[]>([]);
      const menuTreeClearSelectedItem = () => {
        lastSelectKey = '';
        menusTreeRef.value!.setSelectedKeys([]);
        emit('changedSelectedTree', lastSelectKey, null);
      };
      //#region public function =================================
      expose({
        menuTreeClearSelectedItem,
      });
      //#endregion
      return {
        menusTreeRef,
        menuTreeData,
        replaceFields,
        actionList,
        treeSelectEventFn,
        menuTreeClearSelectedItem,
      };
    },
  });
</script>

<style scoped></style>
