<!--
 * @Description  : 项目菜单管理
 * @Author       : zhangyantao
 * @Date         : 2022/2/25
 * @FilePath     : /Users/zhangyantao/wsp_web/openStudy/github-root/vben-admin-thin-next/src/views/rg/proj-setting/ProjMenusListMg.vue
-->
<template>
  <PageWrapper :class="`${prefixCls}`" content-class="flex pagewarp-content">
    <div class="w-1/3 lg:w-1/5 xl:w-1/6 h-full">
      <a-card :bordered="false" class="box-radius menu-list h-fix" :bodyStyle="cardContentStyle">
        <a-button type="primary" color="success" @click="addRootNode">新增根节点</a-button>
        <BasicTree
          ref="menusTreeRef"
          selectable
          :selectedKeys="menuSelectedKeys"
          search
          checkStrictly
          :treeData="treeData"
          :replaceFields="replaceFields"
          @select="handleSelect"
          :actionList="actionList"
        />
      </a-card>
    </div>
    <div class="w-2/3 lg:w-4/5 xl:w-5/6 h-full">
      <a-card
        :bordered="true"
        class="box-radius menu-edit h-fix max-h-max overflow-hidden"
        :bodyStyle="cardContentStyle"
        size="small"
        @tabChange="onTabChange"
      >
        <a-tabs v-model:activeKey="activeTableKey" size="small" type="card">
          <a-tab-pane
            v-for="pane in tabListNoTitle"
            :key="pane.key"
            :tab="pane.tab"
            :closable="false"
          >
            <div class="w-full space-y-10" v-if="activeTableKey === 'tab1'">
              <a-radio-group v-model:value="openEditForm" button-style="solid">
                <a-radio-button :value="false">预览模式</a-radio-button>
                <a-radio-button :value="true">编辑模式</a-radio-button>
              </a-radio-group>

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
                  <a-radio-group
                    :disabled="getEditModeState === false"
                    size="small"
                    button-style="solid"
                    v-model:value="menuFormItem.menuType"
                  >
                    <a-radio-button :value="getMenuTypeEnum.catalogue">目录</a-radio-button>
                    <a-radio-button :value="getMenuTypeEnum.leaf">菜单</a-radio-button>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="菜单名称" name="name">
                  <a-input
                    :disabled="getEditModeState === false"
                    v-model:value="menuFormItem.name"
                    size="small"
                  />
                </a-form-item>
                <a-form-item label="菜单路径" name="path">
                  <a-input v-model:value="menuFormItem.path" />
                </a-form-item>
                <a-form-item label="菜单图标" name="icon">
                  <a-input v-model:value="menuFormItem.icon" />
                </a-form-item>
                <a-form-item label="父级菜单" name="parentId">
                  <a-input disabled v-model:value="menuFormItem.parentName" />
                </a-form-item>
                <a-form-item label="父级路径" name="parentId">
                  <a-input disabled v-model:value="menuFormItem.parentId" />
                </a-form-item>
                <a-form-item label="排序" name="orderNo">
                  <a-input v-model:value="menuFormItem.orderNo" />
                </a-form-item>
                <template v-if="menuFormItem.menuType === getMenuTypeEnum.leaf">
                  <a-form-item label="组件类型">
                    <a-radio-group
                      size="small"
                      button-style="solid"
                      v-model:value="menuFormItem.compType"
                    >
                      <a-radio-button value="customComp">自定义组件</a-radio-button>
                      <a-radio-button value="iframeComp">iFrame组件</a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                  <template v-if="menuFormItem.compType === 'customComp'">
                    <a-form-item label="组件选择">
                      <a-input v-model:value="menuFormItem.compsKey" />
                      <!--                      <a-select />-->
                    </a-form-item>
                  </template>
                  <template v-else-if="menuFormItem.compType === 'iframeComp'">
                    <a-form-item label="iFrame地址">
                      <a-textarea v-model:value="menuFormItem.iframeSrc" />
                    </a-form-item>
                    <a-form-item label="iFrame Token类型">
                      <a-input v-model:value="menuFormItem.iframeTokenType" />
                    </a-form-item>
                  </template>
                  <a-form-item label="Menu显示">
                    <a-radio-group
                      v-model:value="menuFormItem.menuListShow"
                      size="small"
                      button-style="solid"
                    >
                      <a-radio-button :value="true">显示</a-radio-button>
                      <a-radio-button :value="false">隐藏</a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="页面缓存">
                    <a-radio-group
                      v-model:value="menuFormItem.useCache"
                      size="small"
                      button-style="solid"
                    >
                      <a-radio-button :value="true">开启</a-radio-button>
                      <a-radio-button :value="false">关闭</a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                </template>
                <!--                <a-form-item>-->
                <!--               -->
                <!--                </a-form-item>-->
                <template v-if="getEditModeState">
                  <div class="w-auto text-center">
                    <a-button size="small" type="primary" @click="editBtnClick">{{
                      getAddState ? '添加' : '修改'
                    }}</a-button>
                  </div>
                </template>
              </a-form>
            </div>
            <div v-else-if="activeTableKey === 'tab2'">
              <a-empty />
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { computed, defineComponent, h, onMounted, ref, unref } from 'vue';

  import { PageWrapper } from '/@/components/Page/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicTree, ReplaceFields } from '/@/components/Tree/index';
  import { usePermissionStoreWithOut } from '/@/store/modules/permission';
  // import { BasicForm } from '/@/components/Form';
  import { MenuNodeTypeEnum } from '/@/enums/menuEnum';
  import { Menu } from '/@/router/types';
  import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import AButton from '/@/components/Button/src/BasicButton.vue';
  import { IMenuRawData } from '/@/api/sys/model/menuModel';

  export default defineComponent({
    name: 'ProjMenusListMg',
    components: { AButton, PageWrapper, BasicTree },
    setup() {
      const { prefixCls } = useDesign('proj-menus-mg');

      const cardContentStyle = {
        padding: '5px',
      };
      //是否新增编辑
      const getAddState = ref(false);
      //-----------tree---------------
      const replaceFields: ReplaceFields = {
        key: 'path',
        title: 'name',
        children: 'children',
      };
      //树形checked list
      const menusTreeRef = ref({});
      const menuSelectedKeys = ref<string[]>([]);
      const actionList = ref<any>([]);
      function handlePlus(node) {
        console.log('handlePlus', node);
        getAddState.value = true; //  设置为新增模式
        openEditForm.value = true; // 开启编辑
        treeSelectedItem.value = undefined;
        menuSelectedKeys.value = [];
        menuFormItem.value.icon = '';
        menuFormItem.value.name = '';
        menuFormItem.value.orderNo = 0;
        menuFormItem.value.parentId = node.parentId;
        menuFormItem.value.parentName =
          usePermissionStoreWithOut().getBackMenuMap[node.meta?.parentId || '']?.name;
        menuFormItem.value.path = '';
        menuFormItem.value.menuType = '';
        menuFormItem.value.compType = 0;
        menuFormItem.value.iframeSrc = '';
        menuFormItem.value.iframeTokenType = '';
        menuFormItem.value.useCache = true;
        menuFormItem.value.menuListShow = true;
      }
      function handleDelete(node) {
        console.log('handleDelete', node);
      }

      //-----------tarbar---------------
      //页签列表
      const tabBarTabs = [
        {
          key: 'tab1',
          tab: '菜单编辑',
        },
        {
          key: 'tab2',
          tab: '数据权限管理',
        },
      ];
      //tab选中页
      const activeTableKey = ref(tabBarTabs[0].key);
      const treeData = computed(() => {
        return usePermissionStoreWithOut().getBackMenuList;
      });
      function addRootNode() {
        console.log('addRootNode');
        openEditForm.value = true;
        treeSelectedItem.value = undefined;
        menuSelectedKeys.value = [];
        getAddState.value = true;
        menuFormItem.value.icon = '';
        menuFormItem.value.name = '';
        menuFormItem.value.orderNo = 0;
        menuFormItem.value.parentId = '';
        menuFormItem.value.parentName = '';
        menuFormItem.value.path = '';
        menuFormItem.value.menuType = '';
        menuFormItem.value.compType = 0;
        menuFormItem.value.iframeSrc = '';
        menuFormItem.value.iframeTokenType = '';
        menuFormItem.value.useCache = true;
        menuFormItem.value.menuListShow = true;
      }
      function onTreeNodeCheck(checkKeys: string[], e: any) {
        console.log('onTreeNodeCheck', checkKeys, e);
      }
      function handleSelect(selectedKeys: string[], e: any) {
        if (e.selected == false) {
          console.log('selectedKeys', selectedKeys, e);

          updateFormData();
          return;
        }
        console.log('handleSelect', selectedKeys, e, e.selectedNodes[0]?.props);
        menuSelectedKeys.value = selectedKeys;
        treeSelectedItem.value = e.selectedNodes[0].props;
        updateFormData();
      }
      function onTabChange(value: string, type?: string) {
        console.log(value, type);
        activeTableKey.value = value;
      }

      //----- 菜单编辑-----
      const openEditForm = ref<boolean>(false);
      //form表单对象
      const menuFormClearItem = {
        icon: '',
        name: '',
        orderNo: 0,
        parentId: '',
        parentName: '',
        path: '',
        menuType: '',
        compType: '',
        iframeSrc: '',
        compsKey: '',
        iframeTokenType: 'none',
        useCache: true,
        menuListShow: true,
      };
      const menuFormItem = ref<Menu & any>(menuFormClearItem);
      const treeSelectedItem = ref<Menu>();
      function updateFormData() {
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
        if (treeSelectedItem.value?.meta?.frameSrc) {
          menuFormItem.value.compType = 'iframeComp';
          menuFormItem.value.iframeSrc = treeSelectedItem.value?.meta?.frameSrc;

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
        }
        menuFormItem.value.useCache = !treeSelectedItem.value?.meta?.ignoreKeepAlive;
        menuFormItem.value.menuListShow = !treeSelectedItem.value?.meta?.hideMenu;
      }
      function editBtnClick() {
        if (getAddState.value) {
          const nMenuItem = Object.assign({}, unref(menuFormItem));
          console.log('新增item', nMenuItem);
          const menuRawData: IMenuRawData = {} as IMenuRawData;
          if (!nMenuItem.parentId) {
            // 根节点
            menuRawData.menuLevel = 0;
            menuRawData.parentId = '';
            menuRawData.id = '/' + nMenuItem.path;
            if (nMenuItem.menuType === 'leaf') {
              menuRawData.menuType = 'endPoint';
            } else {
              menuRawData.menuType = 'rootpath';
            }
            menuRawData.path = nMenuItem.path;
          } else {
            const parentMenu = usePermissionStoreWithOut().getBackMenuMap[nMenuItem.parentId];
            if (parentMenu) {
              menuRawData.parentId = parentMenu.path;
              menuRawData.id = parentMenu.id + '/' + nMenuItem.path;
              menuRawData.menuLevel = parentMenu.meta.menuLevel + 1;
            } else {
              debugger;
            }
            if (nMenuItem.menuType === 'leaf') {
              menuRawData.menuType = 'endPoint';
            } else {
              menuRawData.menuType = 'middlepath';
            }
            menuRawData.path = nMenuItem.path;
          }

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
          usePermissionStoreWithOut().addMenuItem(menuRawData);
        }
      }
      //#region getter =================================
      //菜单对象menu
      const getMenuTypeEnum = computed(() => {
        return MenuNodeTypeEnum;
      });
      //获取是否编辑状态
      const getEditModeState = computed(() => {
        return openEditForm.value;
      });
      //#endregion
      //#region lify cycle  =================================
      onMounted(() => {
        const menuList = usePermissionStoreWithOut().getBackMenuList;

        console.log('menulist:', menuList);
        actionList.value = [
          {
            render: (node) => {
              return h(PlusOutlined, {
                class: 'ml-2',
                onClick: (e) => {
                  handlePlus(node);
                  e.stopPropagation();
                },
              });
            },
          },
          {
            render: (node) => {
              return h(DeleteOutlined, {
                class: 'ml-2',
                onClick: (e) => {
                  handleDelete(node);
                  e.stopPropagation();
                },
              });
            },
          },
        ];
        if (treeData.value?.length > 0) {
          treeSelectedItem.value = treeData.value[0];
          menuSelectedKeys.value.push(treeSelectedItem.value.path);
          updateFormData();
        }

        // treeData.value = menuList;

        console.log(menusTreeRef.value);
        // getMenusTreeComp.
      });
      //#endregion

      return {
        prefixCls,
        getAddState,
        replaceFields,
        cardContentStyle,
        addRootNode,
        tabListNoTitle: tabBarTabs,
        activeTableKey,
        treeData,
        onTreeNodeCheck,
        handleSelect,
        actionList,
        onTabChange,
        openEditForm,
        menuSelectedKeys,
        menuFormItem,
        getMenuTypeEnum,
        treeSelectedItem,
        menusTreeRef,
        getEditModeState,
        editBtnClick,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-proj-menus-mg';
  @ns-prefix:~ '@{namespace}';
  .box-radius {
    border-radius: 5px;
  }
  .@{prefix-cls} {
    padding: 5px;
    width: calc(100%);
    height: calc(100% - 2px);

    margin: 0 0 auto;
    background-color: #ebeef5;
    border-radius: 5px;
    border: 1px solid #e8e9ed;
    & .@{ns-prefix}-page-wrapper-content.pagewarp-content {
      margin: 0px;
      padding: 0;
      height: calc(100%);
    }

    .menu-list {
    }
    .menu-edit {
    }
  }

  .menu-edit {
    margin-left: 5px;
    & .ant-card-body {
      padding: 5px;
    }
  }
</style>
