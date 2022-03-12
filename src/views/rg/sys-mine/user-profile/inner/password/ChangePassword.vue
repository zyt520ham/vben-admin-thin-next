<template>
  <PageWrapper content="修改成功后会自动退出当前登录！">
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';

  import { formSchema } from './pwd.data';
  import { message } from 'ant-design-vue';
  import { IReqUpdateUserPsd } from '/@/api/sys/model/userModel';
  import { updateUserPsdApi } from '/@/api/sys/user';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm, PageWrapper },
    setup() {
      const [register, { validate, resetFields, getFieldsValue }] = useForm({
        size: 'small',
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
      });

      async function handleSubmit() {
        try {
          await validate();
        } catch (error: any) {
          const errFields = error.errorFields;
          if (errFields.errors?.length > 0) {
            message.error(errFields.errors?.[0]);
          }
          return;
        }

        const { passwordOld, passwordNew } = getFieldsValue();
        // TODO custom api
        const params: IReqUpdateUserPsd = {
          old_password: passwordOld,
          new_password: passwordNew,
        };
        try {
          await updateUserPsdApi(params);
        } catch (e: any) {
          message.error(e.retMsg!);
          return;
        }

        message.success('修改密码 成功，请重新登录');
        useUserStoreWithOut().logout(true);
      }

      return { register, resetFields, handleSubmit };
    },
  });
</script>
