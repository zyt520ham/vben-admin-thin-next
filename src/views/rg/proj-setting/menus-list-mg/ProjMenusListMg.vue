<template>
  <PageWrapper contentFullHeight dense>
    <div class="w-full h-full flex flex-row space-x-5px p-5px">
      <div class="w-3/7 lg:w-5/12 xl:w-5/12 h-full">
        <a-card class="w-full max-h-full rg-antd-cart overflow-auto">
          <a-tooltip placement="topLeft">
            <template #title>
              <span>新增根节点</span>
            </template>
            <a-button shape="circle" class="m-auto" size="small" @click="addRootNodeFn">
              <template #icon>
                <PlusOutlined />
              </template>
            </a-button>
          </a-tooltip>
          <MenusListTree
            ref="menusListTreeRef"
            @changedSelectedTree="changedSelectedTreeEventFn"
            @deleteItemEventFn="treeDelItemEventFn"
            @addItemEventFn="treeAddItemEventFn"
          />
        </a-card>
      </div>
      <div class="w-4/7 lg:w-7/12 xl:w-7/12 h-full">
        <a-card class="rg-antd-cart w-full h-fix max-h-max overflow-hidden">
          <a-tabs v-model:activeKey="activeTabKey">
            <a-tab-pane key="editUserMenusTab1">
              <template #tab>
                <span>
                  <Icon icon="carbon:edit" />
                  菜单项数据
                </span>
              </template>
              <a-radio-group v-model:value="getFormEditingState" button-style="solid">
                <a-radio-button :value="false">预览模式</a-radio-button>
                <a-radio-button :value="true">编辑模式</a-radio-button>
              </a-radio-group>
              <a-divider orientation="right" size="small" />
              <MenuInfoEditComp
                ref="menuInfoEditCompRef"
                :prop_useEditing="getFormEditingState"
                :prop_treeSelectedItem="editFormMenuItem"
                @editItemFinish="editCompEditFinishFn"
              />
            </a-tab-pane>
            <a-tab-pane key="editUserMenusTab2">
              <template #tab>
                <span>
                  <Icon icon="clarity:note-edit-line" />
                  菜单内数据权限
                </span>
              </template>
              <span>数据权限列表</span>
              <a-empty />
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
  import MenusListTree from './inner/MenusListTree.vue';
  import { log } from '/@/utils/log';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import MenuInfoEditComp from './inner/MenuInfoEditComp.vue';
  import { Menu } from '/@/router/types';
  import { message } from 'ant-design-vue';
  import { isDevMode } from '/@/utils/env';
  import { deleteMenuItemApi } from '/@/api/sys/menu';
  import { IReqDelMenuItem } from '/@/api/sys/model/menuModel';
  import { IReqErr } from '/#/axios';
  import { usePermissionStoreWithOut } from '/@/store/modules/permission';
  export default defineComponent({
    name: 'ProjMenusListMg',
    components: {
      Icon,
      PlusOutlined,
      PageWrapper,
      MenusListTree,
      MenuInfoEditComp,
    },
    setup() {
      //#region MenuList =================================
      const menusListTreeRef = ref<InstanceType<typeof MenusListTree>>();
      const addRootNodeFn = () => {
        log('addRootNodeFn');
        menusListTreeRef.value!.menuTreeClearSelectedItem();

        getFormEditingState.value = true;
        editFormMenuItem.value = null as any;
        menuInfoEditCompRef.value.doAddRootMenu();
      };
      const changedSelectedTreeEventFn = (selectedKey: string, selectedItem: Menu) => {
        log('changedSelectedTreeEventFn', selectedKey, selectedItem);
        //判断选中条目存
        if (selectedKey) {
          //选择菜单，默认设置预览模式
          getFormEditingState.value = false;
          editFormMenuItem.value = selectedItem;
        }
      };
      const treeDelItemEventFn = (record: Menu) => {
        if (isDevMode()) {
          const params: IReqDelMenuItem = {
            serverId: record.serverId!,
          };
          deleteMenuItemApi(params).then(
            (resp) => {
              log(resp);
              usePermissionStoreWithOut()
                .refreshLoadServerMenus()
                .then(() => {
                  menusListTreeRef.value!.menuTreeToSelectedFirstItem();
                });
            },
            (err: IReqErr) => {
              message.error(err.retMsg!);
            },
          );
        } else {
          message.warn('暂不允许删除菜单');
        }
      };
      const treeAddItemEventFn = (record: Menu) => {
        log('treeAddItemEventFn', record);
        // editFormMenuItem.value = record;
        // addRootNodeFn();
        menusListTreeRef.value!.menuTreeClearSelectedItem();
        editFormMenuItem.value = undefined;
        getFormEditingState.value = true;
        menuInfoEditCompRef.value.doAddOtherMenu(record);
      };
      //#endregion---------------------

      //#region tabBar =================================
      const activeTabKey = ref('editUserMenusTab1');
      //#endregion---------------------
      //#region menu edit view =================================
      const menuInfoEditCompRef = ref<any>(null);
      //是否编辑模式
      const getFormEditingState = ref<boolean>(false);
      const editFormMenuItem = ref<Menu & Record<any, any>>();
      const editCompEditFinishFn = (editItem: Menu) => {
        menusListTreeRef.value!.menuTreeToSelectedItemByKey(editItem.path);
        getFormEditingState.value = false;
      };
      //#endregion ---------------------

      return {
        menusListTreeRef,
        addRootNodeFn,
        changedSelectedTreeEventFn,
        treeDelItemEventFn,
        treeAddItemEventFn,
        editFormMenuItem,
        activeTabKey,
        getFormEditingState,
        menuInfoEditCompRef,
        editCompEditFinishFn,
      };
    },
  });
</script>

<style scoped></style>
