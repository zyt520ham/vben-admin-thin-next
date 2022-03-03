<!--
 * @Description  : 角色编辑页面
 * @Author       : zhangyantao
 * @Date         : 2022/3/3
 * @FilePath     : /Users/zhangyantao/wsp_web/openStudy/github-root/vben-admin-thin-next/src/views/rg/proj-setting/roles-list/RoleEditDrawer.vue
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
        <a-input v-model:value="model[field]" /> <br />
      </template>
      <template #slotField3="{ model, field }">
        <a-input v-model:value="model[field]" /> <br />
      </template>
      <template #slotField4="{ model, field }">
        <a-radio-group v-model:value="model[field]" button-style="solid">
          <a-radio-button :value="0">正常</a-radio-button>
          <a-radio-button :value="1">停用</a-radio-button>
        </a-radio-group>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form';

  import { roleFormSchemas } from '/@/views/rg/proj-setting/roles-list/Roles.data';

  export default defineComponent({
    name: 'RoleEditDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup() {
      const [registerDraw, { setDrawerProps, closeDrawer }] = useDrawerInner(
        async (data: { record: any; isUpdateRole: boolean }) => {
          console.log('useDrawerInner  callback', data);
          await formMethods.resetFields();
          if (data?.isUpdateRole) {
            isUpdateMenu.value = !!data?.isUpdateRole;
          }
          if (isUpdateMenu.value) {
            await formMethods.setFieldsValue({ ...data.record });
          }
        },
      );

      const [registerForm, formMethods] = useForm({
        labelWidth: 90,
        schemas: roleFormSchemas(),
        showActionButtonGroup: false,
        layout: 'horizontal',
      });
      const isUpdateMenu = ref(true);
      const getTitle = computed(() => (!unref(isUpdateMenu.value) ? '新增角色' : '编辑角色'));
      const handleSubmitFn = () => {
        console.log('handleSubmitFn');
        setDrawerProps({ confirmLoading: true, mask: true });
        setTimeout(() => {
          setDrawerProps({ confirmLoading: false, mask: false });
          closeDrawer();
        }, 3000);
      };

      return {
        registerDraw,
        getTitle,
        handleSubmitFn,
        registerForm,
      };
    },
  });
</script>
