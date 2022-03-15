<template>
  <a-form
    :model="menuFormItem"
    class="w-full"
    size="small"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 16 }"
    labelAlign="right"
    layout="horizontal"
  >
    <a-form-item label="类型" name="menuType">
      <template v-if="getEditingState">
        <a-radio-group size="small" button-style="solid" v-model:value="menuFormItem.menuType">
          <a-radio-button :value="getMenuTypeEnum.catalogue">目录</a-radio-button>
          <a-radio-button :value="getMenuTypeEnum.leaf">菜单</a-radio-button>
        </a-radio-group>
      </template>
      <template v-else>
        <a-tag color="processing" v-if="menuFormItem.menuType == getMenuTypeEnum.leaf">菜单</a-tag>
        <a-tag color="warning" v-else>目录</a-tag>
      </template>
    </a-form-item>
    <a-form-item label="菜单名称" name="name">
      <a-input
        :disabled="getEditingState === false"
        v-model:value="menuFormItem.name"
        size="small"
      />
    </a-form-item>
    <a-form-item label="菜单路径" name="path">
      <a-input v-model:value="menuFormItem.path" :disabled="getEditingState === false" />
    </a-form-item>
    <a-form-item label="菜单图标" name="icon">
      <a-input v-model:value="menuFormItem.icon" :disabled="getEditingState === false" />
    </a-form-item>
    <a-form-item label="父级菜单" name="parentId">
      <a-input disabled v-model:value="menuFormItem.parentName" />
    </a-form-item>
    <a-form-item label="父级路径" name="parentId">
      <a-input disabled v-model:value="menuFormItem.parentId" />
    </a-form-item>
    <a-form-item label="菜单层级" name="menuLevel">
      <a-input disabled v-model:value="menuFormItem.menuLevel" />
    </a-form-item>
    <a-form-item label="排序" name="orderNo">
      <a-input v-model:value="menuFormItem.orderNo" />
    </a-form-item>
    <template v-if="menuFormItem.menuType === getMenuTypeEnum.leaf">
      <a-form-item label="组件类型">
        <template v-if="getEditingState">
          <a-radio-group size="small" button-style="solid" v-model:value="menuFormItem.compType">
            <a-radio-button value="customComp">自定义组件</a-radio-button>
            <a-radio-button value="iframeComp">iFrame组件</a-radio-button>
          </a-radio-group>
        </template>
        <template v-else>
          <a-tag v-if="menuFormItem.compType == 'customComp'">自定义组件</a-tag>
          <a-tag v-else>iFrame组件</a-tag>
        </template>
      </a-form-item>
      <template v-if="menuFormItem.compType === 'customComp'">
        <a-form-item label="组件选择">
          <a-input v-model:value="menuFormItem.compsKey" :disabled="getEditingState === false" />
          <!--                      <a-select />-->
        </a-form-item>
      </template>
      <template v-else-if="menuFormItem.compType === 'iframeComp'">
        <a-form-item label="iFrame地址">
          <a-textarea
            v-model:value="menuFormItem.iframeSrc"
            :disabled="getEditingState === false"
          />
        </a-form-item>
        <a-form-item label="iFrame Token类型">
          <a-input
            v-model:value="menuFormItem.iframeTokenType"
            :disabled="getEditingState === false"
          />
        </a-form-item>
      </template>

      <a-form-item label="Menu显示">
        <template v-if="getEditingState">
          <a-radio-group
            v-model:value="menuFormItem.menuListShow"
            size="small"
            button-style="solid"
          >
            <a-radio-button :value="true">显示</a-radio-button>
            <a-radio-button :value="false">隐藏</a-radio-button>
          </a-radio-group>
        </template>
        <template v-else>
          <a-tag color="processing" v-if="menuFormItem.menuListShow == true">显示</a-tag>
          <a-tag v-else>隐藏</a-tag>
        </template>
      </a-form-item>
      <a-form-item label="页面缓存">
        <template v-if="getEditingState">
          <a-radio-group v-model:value="menuFormItem.useCache" size="small" button-style="solid">
            <a-radio-button color="processing" :value="true">开启</a-radio-button>
            <a-radio-button :value="false">关闭</a-radio-button>
          </a-radio-group>
        </template>
        <template v-else>
          <a-tag color="processing" v-if="menuFormItem.useCache == true">开启</a-tag>
          <a-tag v-else>关闭</a-tag>
        </template>
      </a-form-item>
    </template>
    <!--                <a-form-item>-->
    <!--               -->
    <!--                </a-form-item>-->
    <template v-if="getEditingState">
      <div class="w-auto text-center">
        <a-button size="small" type="primary" @click="editBtnClick">{{
          getIsAddState ? '添加' : '修改'
        }}</a-button>
      </div>
    </template>
  </a-form>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref, unref, watch } from 'vue';
  import { usePermissionStoreWithOut } from '/@/store/modules/permission';
  import { MenuNodeTypeEnum } from '/@/enums/menuEnum';
  import { log, logNoTrace } from '/@/utils/log';
  import { menuFormClearItem } from './menu.data';

  import { Menu } from '/@/router/types';
  import { IMenuRawData } from '/@/api/sys/model/menuModel';

  export default defineComponent({
    name: 'MenuInfoEditComp',
    components: {},
    props: {
      prop_useEditing: {
        required: true,
        type: Boolean as PropType<boolean>,
        default: false,
      },
      prop_treeSelectedItem: {
        type: Object,
      },
    },
    emits: ['editItemFinish'],
    setup(props, { expose, emit }) {
      const getEditingState = computed(() => {
        return props.prop_useEditing;
      });
      const getIsAddState = ref<boolean>(false);
      onMounted(() => {
        if (treeSelectedItem.value) {
          formUpdatePropItemFn();
        }
      });
      watch(
        () => props.prop_treeSelectedItem,
        (nV: any) => {
          if (nV) {
            getIsAddState.value = false;
            treeSelectedItem.value = nV;
            formUpdatePropItemFn();
          } else {
            treeSelectedItem.value = null;
          }
        },
      );
      watch(
        () => props.prop_useEditing,
        () => {
          formUpdatePropItemFn();
        },
      );
      //#region enum =================================
      //菜单对象menu
      //获取菜单对象类型
      const getMenuTypeEnum = computed(() => {
        return MenuNodeTypeEnum;
      });
      //#endregion
      const treeSelectedItem: any = ref(null);
      const menuFormItem: any = ref({});
      const formUpdatePropItemFn = () => {
        if (!treeSelectedItem.value) {
          return;
        }
        menuFormItem.value.menuLevel = treeSelectedItem.value.menuLevel;
        if (treeSelectedItem.value!.meta?.menuType === 'endPoint') {
          menuFormItem.value.menuType = getMenuTypeEnum.value.leaf;
        } else {
          menuFormItem.value.menuType = getMenuTypeEnum.value.catalogue;
        }
        menuFormItem.value.name = treeSelectedItem.value?.name;
        menuFormItem.value.orderNo = treeSelectedItem.value?.meta?.orderNo;
        if (treeSelectedItem.value?.meta?.menuLevel === 0) {
          menuFormItem.value.parentName = '当前菜单已经是根节点';
          menuFormItem.value.parentId = '';
        } else {
          menuFormItem.value.parentName =
            usePermissionStoreWithOut().getBackMenuMap[
              treeSelectedItem.value?.meta?.parentId || ''
            ]?.name;
          menuFormItem.value.parentId = treeSelectedItem.value?.meta?.parentId;
        }

        menuFormItem.value.path = treeSelectedItem.value?.meta?.currentPath;
        menuFormItem.value.icon = treeSelectedItem.value?.icon;
        menuFormItem.value.serverId = treeSelectedItem.value?.meta?.serverId || '';
        if (treeSelectedItem.value?.meta?.frameSrc) {
          menuFormItem.value.compType = 'iframeComp';
          menuFormItem.value.iframeSrc = treeSelectedItem.value?.meta?.frameSrc;
          menuFormItem.value.compsKey = '';
          let patt = /###\w+###$/;
          if (patt.test(menuFormItem.value.iframeSrc)) {
            if (menuFormItem.value.iframeSrc.indexOf('###QuickBiToken###') >= 0) {
              menuFormItem.value.iframeTokenType = 'QuickBiToken';
            } else if (menuFormItem.value.iframeSrc.indexOf('###PRestWebApiToken###') >= 0) {
              menuFormItem.value.iframeTokenType = 'PRestWebApiToken';
            } else {
            }
          }
        } else {
          menuFormItem.value.compType = 'customComp';
          menuFormItem.value.compsKey = treeSelectedItem.value?.meta?.compPath;
          menuFormItem.value.iframeSrc = '';
          menuFormItem.value.iframeTokenType = '';
        }
        menuFormItem.value.useCache = !treeSelectedItem.value?.meta?.ignoreKeepAlive;
        menuFormItem.value.menuListShow = !treeSelectedItem.value?.meta?.hideMenu;
      };
      // formUpdatePropItemFn();
      const editBtnClick = () => {
        log('editBtnClick');
        if (getIsAddState.value) {
          doAddMenuItem();
        } else {
          doEditMenuItem();
        }
      };
      const doAddMenuItem = () => {
        logNoTrace('doAddMenuItem');
        const nMenuItem = Object.assign({}, unref(menuFormItem));
        logNoTrace('新增item', nMenuItem);
        const menuRawData: IMenuRawData = {} as IMenuRawData;

        if (nMenuItem.menuLevel === 0) {
          menuRawData.parentId = '';
          if (nMenuItem.menuType === 'leaf') {
            //  选择了叶子
            menuRawData.menuType = 'endPoint';
            menuRawData.path = nMenuItem.path;
          } else {
            //选择了节点
            menuRawData.menuType = 'rootpath';
            menuRawData.path = '/' + nMenuItem.path;
          }
        } else {
          if (nMenuItem.menuType === 'leaf') {
            menuRawData.menuType = 'endPoint';
          } else {
            menuRawData.menuType = 'middlepath';
          }
          menuRawData.menuLevel = nMenuItem.menuLevel;
          menuRawData.parentId = nMenuItem.parentId;
          menuRawData.path = nMenuItem.path;
        }
        menuRawData.id = menuRawData.parentId + menuRawData.path;
        menuRawData.label = nMenuItem.name;
        menuRawData.icon = nMenuItem.icon;
        menuRawData.orderNum = nMenuItem.orderNo;
        menuRawData.useCache = nMenuItem.useCache;
        menuRawData.hiddenInMenu = !nMenuItem.menuListShow;
        if (nMenuItem.compType === 'iframeComp') {
          // iframe

          menuRawData.externalLinkUrl = nMenuItem.iframeSrc;
          menuRawData.openLinkUseExternal = false;
          menuRawData.useStatus = true;
          if (menuRawData.menuLevel == 0) {
            menuRawData.compsKey = 'layout';
          } else {
            menuRawData.compsKey = 'iframe';
          }
        } else {
          menuRawData.compsKey = nMenuItem.compsKey;
        }
        console.log('tranform menu', menuRawData);
        usePermissionStoreWithOut().addMenuItem(menuRawData as any);
        emit('editItemFinish', menuRawData);
      };
      const doEditMenuItem = () => {
        log('doEditMenuItem', menuFormItem);
        const menuRawData: IMenuRawData = {} as IMenuRawData;
        const nMenuItem = Object.assign({}, unref(menuFormItem));
        menuRawData.serverId = nMenuItem.serverId;
        if (nMenuItem.menuLevel === 0) {
          menuRawData.parentId = '';
          if (nMenuItem.menuType === 'leaf') {
            //  选择了叶子
            menuRawData.menuType = 'endPoint';
            menuRawData.path = nMenuItem.path;
          } else {
            //选择了节点
            menuRawData.menuType = 'rootpath';
            menuRawData.path = '/' + nMenuItem.path;
          }
        } else {
          if (nMenuItem.menuType === 'leaf') {
            menuRawData.menuType = 'endPoint';
          } else {
            menuRawData.menuType = 'middlepath';
          }
          menuRawData.menuLevel = nMenuItem.menuLevel;
          menuRawData.parentId = nMenuItem.parentId;
          menuRawData.path = nMenuItem.path;
        }
        menuRawData.id = menuRawData.parentId + menuRawData.path;
        menuRawData.label = nMenuItem.name;
        menuRawData.icon = nMenuItem.icon;
        if (menuRawData.icon?.endsWith('|svg')) {
          menuRawData.icon = menuRawData.icon?.replace('|svg', '');
        }
        menuRawData.orderNum = nMenuItem.orderNo;
        menuRawData.useCache = nMenuItem.useCache;
        menuRawData.hiddenInMenu = !nMenuItem.menuListShow;
        if (nMenuItem.compType === 'iframeComp') {
          // iframe

          menuRawData.externalLinkUrl = nMenuItem.iframeSrc;
          menuRawData.openLinkUseExternal = false;
          menuRawData.useStatus = true;
          if (menuRawData.menuLevel == 0) {
            menuRawData.compsKey = 'layout';
          } else {
            menuRawData.compsKey = 'iframe';
          }
        } else {
          // menuRawData.compsKey = treeSelectedItem.value.meta.compsKey;
          // menuRawData.compsKey = nMenuItem.compsKey;
        }
        console.log('tranform edit menu', menuRawData);
        usePermissionStoreWithOut().updateMenuItem(menuRawData as any);
        // usePermissionStoreWithOut().addMenuItem(menuFormItem);
      };
      //#region public =================================
      const doAddRootMenu = () => {
        logNoTrace('触发新建menu');

        getIsAddState.value = true;

        // getEditingState.value = true;
        menuFormItem.value = Object.assign({}, menuFormClearItem);
        menuFormItem.value.parentName = '当前菜单已经是根节点';
        menuFormItem.value.parentId = '';
        menuFormItem.value.menuLevel = 0;
      };
      //添加其他节点新增
      const doAddOtherMenu = (selectedMenuItem: Menu) => {
        logNoTrace('触发新建menu 关联menu对象是', selectedMenuItem);
        menuFormItem.value = Object.assign({}, menuFormClearItem);
        getIsAddState.value = true;

        if (selectedMenuItem.menuType === 'endPoint') {
          //点击是叶子节点
          // menuFormItem.value.parentName = selectedMenuItem.parentName;
          if (selectedMenuItem.menuLevel === 0) {
            //根级叶子节点
            menuFormItem.value.parentName = '当前菜单已经是根节点';
            menuFormItem.value.parentId = '';
            menuFormItem.value.menuLevel = 0;
          } else {
            menuFormItem.value.parentId = selectedMenuItem.parentId;
            const menuItem = usePermissionStoreWithOut().searchBackMenuByPath(
              selectedMenuItem.parentId,
            );
            menuFormItem.value.parentName = menuItem?.meta?.title || '';
            menuFormItem.value.menuLevel = menuItem!.meta!.menuLevel! + 1;
          }
          // debugger;
        } else {
          menuFormItem.value.parentId = selectedMenuItem.path;
          menuFormItem.value.parentName = selectedMenuItem.meta?.title || '';
          menuFormItem.value.menuLevel = selectedMenuItem.meta!.menuLevel! + 1;
        }
      };
      expose({ formUpdatePropItemFn, doAddRootMenu, doAddOtherMenu });
      //#endregion
      return {
        getEditingState,
        getMenuTypeEnum,
        menuFormItem,
        formUpdatePropItemFn,
        editBtnClick,
        doAddRootMenu,
        doAddOtherMenu,
        getIsAddState,
      };
    },
  });
</script>

<style scoped></style>
