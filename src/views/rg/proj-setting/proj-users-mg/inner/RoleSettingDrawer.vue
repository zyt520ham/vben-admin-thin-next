<template>
  <BasicDrawer
    destroyOnClose
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="角色设置面板"
    width="500px"
    @ok="handleSubmitFn"
  >
    <BasicForm @register="registerForm">
      <template #slotField1="{ model, field }">
        <a-input v-model:value="model[field]" disabled />
      </template>
      <template #slotField2="{ model, field }">
        <a-input v-model:value="model[field]" disabled />
      </template>
      <template #slotField3="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :replaceFields="{ title: 'description', key: 'role' }"
          checkable
          toolbar
          :selectable="false"
          title="角色选择列表"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';

  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  import { roleSettingFormSchemas } from '/@/views/rg/proj-setting/proj-users-mg/inner/projUsers.data';
  import { useProjsStoreWithOut } from '/@/store/modules/projectsStore';
  import { IUserInfo } from '/#/store';
  import { message } from 'ant-design-vue';
  import { updateUserRolesApi } from '/@/api/sys/roleApi';
  import { IReqUserRolesUpdate } from '/@/api/sys/model/roleModel';
  // import { useUserStoreWithOut } from '/@/store/modules/user';
  import { log } from '/@/utils/log';
  import { IReqErr } from '/#/axios';

  export default defineComponent({
    name: 'RoleSettingDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },

    emits: ['success', 'register'],
    setup(_, { emit }) {
      const treeData = ref<TreeItem[]>([]);
      const editUserInfo = ref<IUserInfo>({} as any);
      const [registerForm, { resetFields, setFieldsValue, getFieldsValue }] = useForm({
        labelWidth: 90,
        schemas: roleSettingFormSchemas(),
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        editUserInfo.value = data;
        resetFields();
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        // if (unref(treeData).length === 0) {
        const projRoles = useProjsStoreWithOut().getCurrentProjRoles.slice();
        treeData.value = projRoles as any as TreeItem[];
        // }

        await setFieldsValue({
          account: editUserInfo.value.account,
          nickname: editUserInfo.value.nickname,
          project_roles: editUserInfo.value.project_roles,
        });
      });
      const handleSubmitFn = async () => {
        try {
          const values = getFieldsValue();
          console.log(values);
          if (!values.project_roles || values.project_roles?.length <= 0) {
            message.warning('请您先设置角色属性');
            return;
          }
          // setDrawerProps({ confirmLoading: true });
          // TODO custom api
          const params: IReqUserRolesUpdate = {
            user_id: editUserInfo.value.user_id,
            selected_roles: values.project_roles.join('##'),
          };
          updateUserRolesApi(params).then(
            (resp) => {
              log('请求结果：', resp);
              closeDrawer();
              editUserInfo.value.project_roles = values.project_roles;
              emit('success', editUserInfo);
            },
            (err: IReqErr) => {
              message.error(err.retMsg!);
            },
          );
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      };

      return {
        registerDrawer,
        registerForm,
        handleSubmitFn,
        treeData,
      };
    },
  });
</script>
