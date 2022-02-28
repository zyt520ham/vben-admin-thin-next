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
        <a-button color="success" @click="resetFields">新增根节点</a-button>
        <BasicTree
          selectable
          :checkedKeys="checkedKeys"
          search
          checkStrictly
          @check="onTreeNodeCheck"
          ref="treeRef"
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
            <div class="w-full" v-if="activeTableKey === 'tab1'">
              <a-switch
                un-checked-children="预览"
                checked-children="编辑"
                v-model:checked="openEditForm"
              />
              <a-form
                :model="menuFormItem"
                class="w-full"
                size="small"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 14 }"
                labelAlign="right"
                layout="horizontal"
              >
                <a-form-item label="类型" name="menuType">
                  <a-radio-group
                    size="small"
                    button-style="solid"
                    v-model:value="menuFormItem.menuType"
                  >
                    <a-radio-button :value="getMenuTypeEume.catalogue">目录</a-radio-button>
                    <a-radio-button :value="getMenuTypeEume.leaf">菜单</a-radio-button>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="菜单名称" name="name">
                  <a-input v-model:value="menuFormItem.name" size="small" />
                </a-form-item>
                <a-form-item label="菜单路径" name="path">
                  <a-input v-model:value="menuFormItem.path" />
                </a-form-item>
                <a-form-item label="菜单图标" name="icon">
                  <a-input v-model:value="menuFormItem.icon" />
                </a-form-item>
                <a-form-item label="父级菜单" name="parentId">
                  <a-input v-model:value="menuFormItem.parentName" />
                </a-form-item>
                <a-form-item label="父级路径" name="parentId">
                  <a-input v-model:value="menuFormItem.parentId" />
                </a-form-item>
                <a-form-item label="排序" name="orderNo">
                  <a-input v-model:value="menuFormItem.orderNo" />
                </a-form-item>
                <template v-if="menuFormItem.menuType === getMenuTypeEume.leaf">
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
                      <a-select />
                    </a-form-item>
                  </template>
                  <template v-else-if="menuFormItem.compType === 'iframeComp'">
                    <a-form-item label="iFrame地址">
                      <a-input />
                    </a-form-item>
                    <a-form-item label="iFrame Token类型">
                      <a-input />
                    </a-form-item>
                  </template>
                  <a-form-item label="Menu显示">
                    <a-radio-group size="small" button-style="solid">
                      <a-radio-button :value="true">显示</a-radio-button>
                      <a-radio-button :value="false">隐藏</a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="页面缓存">
                    <a-radio-group size="small" button-style="solid">
                      <a-radio-button :value="true">开启</a-radio-button>
                      <a-radio-button :value="false">关闭</a-radio-button>
                    </a-radio-group>
                  </a-form-item>
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

    <!--    <a-card :bordered="true" title="资源信息" class="w-1/2 menu-button-table">-->
    <!--      <div> ProjMenusListMg </div>-->
    <!--    </a-card>-->
  </PageWrapper>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue';

  import { PageWrapper } from '/@/components/Page/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicTree, ReplaceFields } from '/@/components/Tree/index';
  import { usePermissionStoreWithOut } from '/@/store/modules/permission';

  // import { BasicForm } from '/@/components/Form';
  import { MenuTypeEnum } from '/@/enums/menuEnum';
  import { Menu } from '/@/router/types';

  // const menuFormSchemas: FormSchema[] = [
  //   {
  //     field: 'menuType',
  //     label: '类型',
  //     component: 'RadioButtonGroup',
  //     helpMessage: ['设置当前项目为目录还是菜单项'],
  //     componentProps: {
  //       placeholder: '选择菜单类型',
  //       options: [
  //         {
  //           label: '目录',
  //           value: MenuTypeEnum.catalogue,
  //         },
  //         {
  //           label: '菜单项',
  //           value: MenuTypeEnum.leaf,
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     field: 'menuName',
  //     label: '名称',
  //     component: 'Input',
  //   },
  //   {
  //     field: 'menuPath',
  //     label: '路由',
  //     component: 'Input',
  //   },
  //   {
  //     field: 'parentId',
  //     label: '父级菜单',
  //     component: 'Input',
  //   },
  // ];

  export default defineComponent({
    name: 'ProjMenusListMg',
    components: { PageWrapper, BasicTree },
    setup() {
      const { prefixCls } = useDesign('proj-menus-mg');
      const rootWarperStyle = {
        margin: 0,
        height: '100%',
        width: '100%',
      };
      const cardContentStyle = {
        padding: '5px',
      };
      const tabListNoTitle = [
        {
          key: 'tab1',
          tab: '菜单编辑',
        },
        {
          key: 'tab2',
          tab: '数据权限管理',
        },
      ];
      const replaceFields: ReplaceFields = {
        key: 'path',
        title: 'name',
        children: 'children',
      };
      const activeTableKey = ref('tab1');
      const treeData = ref<any[]>([]);
      function resetFields() {
        console.log('resetFields');
      }
      function onTreeNodeCheck(checkKeys: string[], e: any) {
        console.log('handleSelect', checkKeys, e);
      }
      function handleSelect(selectedKeys: string[], e: any) {
        console.log('handleSelect', selectedKeys, e, e.selectedNodes[0].props);
        checkedKeys.value = selectedKeys;
        treeSelectedItem.value = e.selectedNodes[0].props;
        updateFormData();
      }
      function actionList() {}
      function onTabChange(value: string, type?: string) {
        console.log(value, type);
        activeTableKey.value = value;
        // if (type === 'key') {
        //   key.value = value;
        // } else if (type === 'noTitleKey') {
        //   noTitleKey.value = value;
        // }
      }
      //树形checked list
      const checkedKeys = ref<string[]>([]);
      //----- 菜单编辑-----
      const openEditForm = ref<boolean>(false);
      //form表单对象
      const menuFormItem = ref<Menu & any>({
        icon: '',
        name: '',
        orderNo: 0,
        parentId: '',
        parentName: '',
        path: '',
        menuType: '',
        compType: '',
      });
      const treeSelectedItem = ref<Menu>();
      function updateFormData() {
        if (treeSelectedItem.value!.meta?.menuType === 'endPoint') {
          menuFormItem.value.menuType = getMenuTypeEume.value.leaf;
        } else {
          menuFormItem.value.menuType = getMenuTypeEume.value.catalogue;
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
      }
      onMounted(() => {
        const menuList = usePermissionStoreWithOut().getBackMenuList;
        console.log('menulist:', menuList);
        treeData.value = menuList;
      });
      const getMenuTypeEume = computed(() => {
        return MenuTypeEnum;
      });

      return {
        prefixCls,
        rootWarperStyle,
        replaceFields,
        cardContentStyle,
        resetFields,
        tabListNoTitle,
        activeTableKey,
        treeData,
        onTreeNodeCheck,
        handleSelect,
        actionList,
        onTabChange,
        openEditForm,
        checkedKeys,
        menuFormItem,
        getMenuTypeEume,
        treeSelectedItem,
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
      height: auto;
      .cc {
        background-color: #00bb00;
      }
    }
    .menu-edit {
      max-height: 100%;
      overflow: auto;
      .cc {
        background-color: #00bb00;
      }
    }
  }

  .menu-edit {
    margin-left: 5px;
    & .ant-card-body {
      padding: 5px;
    }
  }
</style>
