<!--
 * @Description  : 角色编辑页面
 * @Author       : zhangyantao
 * @Date         : 2022/3/3
 * @FilePath     : src/views/rg/proj-setting/roles-list/RoleEditDrawer.vue
-->
<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDraw"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmitFn"
    destroyOnClose
  >
    <BasicForm @register="registerForm">
      <template #slotField1="{ model, field }">
        <a-input v-model:value="model[field]" /> <br />
      </template>
      <template #slotField2="{ model, field }">
        <a-input v-model:value="model[field]" :disabled="isUpdateMenu" /> <br />
      </template>
      <template #slotField3="{ model, field }">
        <a-input v-model:value="model[field]" /> <br />
      </template>
      <template #slotMenu>
        <BasicTree
          ref="roleEdtiDrawerTree"
          :treeData="treeData"
          :replaceFields="{ title: 'name', key: 'path' }"
          checkable
          toolbar
          :selectable="false"
          title="菜单设置"
        />
      </template>
      <!--      <template #slotField4="{ model, field }">-->
      <!--        <a-radio-group v-model:value="model[field]" button-style="solid">-->
      <!--          <a-radio-button :value="0">正常</a-radio-button>-->
      <!--          <a-radio-button :value="1">停用</a-radio-button>-->
      <!--        </a-radio-group>-->
      <!--      </template>-->
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form';

  import { roleFormSchemas } from '/@/views/rg/proj-setting/roles-list/Roles.data';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import {
    getPermissionsByRoleApi,
    updateRoleInfoApi,
    updateRolePermissionsApi,
  } from '/@/api/sys/roleApi';
  import { usePermissionStoreWithOut } from '/@/store/modules/permission';
  import { log } from '/@/utils/log';
  import {
    IReqGetPermissionsByRole,
    IReqUpdateRoleInfo,
    IReqUpdateRolePermissions,
  } from '/@/api/sys/model/roleModel';
  import { IRoleInfo } from '/#/store';
  import { IReqErr } from '/#/axios';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'RoleEditDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup() {
      const editRoleInfo = ref<IRoleInfo>({} as any);
      const [registerDraw, { setDrawerProps, closeDrawer }] = useDrawerInner(
        async (data: { record: IRoleInfo; isUpdateRole: boolean }) => {
          console.log('useDrawerInner  callback', data);
          editRoleInfo.value = data.record;
          await formMethods.resetFields();
          if (data) {
            isUpdateMenu.value = !!data?.isUpdateRole;
          }
          if (isUpdateMenu.value) {
            await formMethods.setFieldsValue({ ...data.record });
          }
          const params: IReqGetPermissionsByRole = {
            role: data.record.role,
          };
          treeData.value = usePermissionStoreWithOut().getBackMenuList.slice() as any;
          if (data.isUpdateRole) {
            const permissionsRoleMap: any = await getPermissionsByRoleApi(params);
            log('获取到的权限列表', permissionsRoleMap);

            roleEdtiDrawerTree.value.setCheckedKeys(permissionsRoleMap[data.record.role]);
          }
        },
      );

      const [registerForm, formMethods] = useForm({
        labelWidth: 90,
        schemas: roleFormSchemas(),
        showActionButtonGroup: false,
        layout: 'horizontal',
      });

      const treeData = ref<TreeItem[]>([]);
      const isUpdateMenu = ref(true);
      const checkedList = ref([]);
      const getTitle = computed(() => (!unref(isUpdateMenu.value) ? '新增角色' : '编辑角色'));
      const handleSubmitFn = () => {
        const formItemData = formMethods.getFieldsValue();
        if (!isUpdateMenu.value) {
          // 新增角色
        } else {
          let basicFlag = false;
          let permissionsFlag = false;

          const roleInfoParams: IReqUpdateRoleInfo = {
            old_role: editRoleInfo.value.role,
            new_role: formItemData.role,
            description: formItemData.description,
            order_num: formItemData.order_num,
          };
          updateRoleInfoApi(roleInfoParams).then(
            (resp) => {
              log(resp);
              message.success('角色数据修改成功');
              basicFlag = true;
              if (basicFlag && permissionsFlag) {
                setDrawerProps({ confirmLoading: false, mask: false });
              }
            },
            (err: IReqErr) => {
              message.error(err.retMsg!);
            },
          );

          const allCheckedKeys: any[] = roleEdtiDrawerTree.value.getCheckedKeys();
          log('handleSubmitFn', allCheckedKeys);
          const params: IReqUpdateRolePermissions = {
            role: editRoleInfo.value.role,
            selected_menus: allCheckedKeys.join('##'),
          };
          setDrawerProps({ confirmLoading: true, mask: true });
          updateRolePermissionsApi(params).then(
            (resp) => {
              log(resp);
              message.success('角色权限修改成功');
              permissionsFlag = true;
              if (basicFlag && permissionsFlag) {
                setDrawerProps({ confirmLoading: false, mask: false });
                closeDrawer();
              }
            },
            (err: IReqErr) => {
              message.error(err.retMsg!);
              setDrawerProps({ confirmLoading: false, mask: false });
            },
          );
        }

        // setDrawerProps({ confirmLoading: true, mask: true });
        // setTimeout(() => {
        //   setDrawerProps({ confirmLoading: false, mask: false });
        //   closeDrawer();
        // }, 3000);
      };
      const roleEdtiDrawerTree = ref<any>(null);
      const treeCheckEventFn = (...args) => {
        log('treeCheckEventFn', args);
      };
      return {
        isUpdateMenu,
        registerDraw,
        getTitle,
        handleSubmitFn,
        registerForm,
        treeData,
        checkedList,
        treeCheckEventFn,
        roleEdtiDrawerTree,
      };
    },
  });
</script>
