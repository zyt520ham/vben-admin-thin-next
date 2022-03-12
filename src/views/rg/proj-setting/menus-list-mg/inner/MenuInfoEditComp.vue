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
      <a-radio-group
        :disabled="getEditingState === false"
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
        :disabled="getEditingState === false"
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
    <template v-if="menuFormItem.menuType === getEditingState.leaf">
      <a-form-item label="组件类型">
        <a-radio-group size="small" button-style="solid" v-model:value="menuFormItem.compType">
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
        <a-radio-group v-model:value="menuFormItem.menuListShow" size="small" button-style="solid">
          <a-radio-button :value="true">显示</a-radio-button>
          <a-radio-button :value="false">隐藏</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="页面缓存">
        <a-radio-group v-model:value="menuFormItem.useCache" size="small" button-style="solid">
          <a-radio-button :value="true">开启</a-radio-button>
          <a-radio-button :value="false">关闭</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </template>
    <!--                <a-form-item>-->
    <!--               -->
    <!--                </a-form-item>-->
    <template v-if="getEditingState">
      <div class="w-auto text-center">
        <!--        <a-button size="small" type="primary" @click="editBtnClick">{{-->
        <!--          getAddState ? '添加' : '修改'-->
        <!--        }}</a-button>-->
      </div>
    </template>
  </a-form>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref, watch } from 'vue';
  import { usePermissionStoreWithOut } from '/@/store/modules/permission';
  import { MenuNodeTypeEnum } from '/@/enums/menuEnum';

  export default defineComponent({
    name: 'MenuInfoEditComp',
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
    setup(props, { expose }) {
      const getEditingState = computed(() => {
        return props.prop_useEditing;
      });
      onMounted(() => {
        if (treeSelectedItem.value) {
          formUpdatePropItemFn();
        }
      });
      watch(
        () => props.prop_treeSelectedItem,
        (nV: any) => {
          treeSelectedItem.value = nV;
          formUpdatePropItemFn();
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
      const treeSelectedItem: any = ref({});
      const menuFormItem: any = ref({});
      const formUpdatePropItemFn = () => {
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
      };
      // formUpdatePropItemFn();
      //#region public =================================
      expose({ formUpdatePropItemFn });
      //#endregion
      return {
        getEditingState,
        getMenuTypeEnum,
        menuFormItem,
        formUpdatePropItemFn,
      };
    },
  });
</script>

<style scoped></style>
