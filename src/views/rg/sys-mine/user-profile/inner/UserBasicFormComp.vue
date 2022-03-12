<template>
  <div class="py-8 bg-white flex flex-col justify-center items-center">
    <BasicForm @register="register" />
    <div class="flex justify-center">
      <a-button @click="resetFieldsFn"> 重置 </a-button>
      <a-button class="!ml-4" type="primary" @click="handleSubmitFn"> 确认 </a-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { userInfoEditSchema } from '/@/views/rg/sys-mine/user-profile/inner/userProfile.data';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { IReqUpdateUserInfo } from '/@/api/sys/model/userModel';
  import { message } from 'ant-design-vue';
  export default defineComponent({
    name: 'UserBasicFormComp',
    components: {
      BasicForm,
    },
    setup() {
      const [register, formMethods] = useForm({
        size: 'small',
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: userInfoEditSchema,
      });
      const getUserInfo = computed(() => {
        return useUserStoreWithOut().getUserInfoV1;
      });
      onMounted(() => {
        if (getUserInfo.value) {
          const oriFrom: IReqUpdateUserInfo = {};
          if (getUserInfo.value?.nickname) {
            oriFrom.nickname = getUserInfo.value?.nickname;
          }
          if (getUserInfo.value?.phone) {
            oriFrom.phone = getUserInfo.value.phone;
          }
          if (getUserInfo.value?.email !== undefined) {
            oriFrom.email = getUserInfo.value.email;
          }
          if (
            getUserInfo.value?.sex !== undefined ||
            getUserInfo.value.sex === 1 ||
            getUserInfo.value.sex === 0
          ) {
          }
          {
            oriFrom.sex = getUserInfo.value.sex;
          }
          formMethods.setFieldsValue<IReqUpdateUserInfo>(oriFrom);
        }
      });
      //#region action btn =================================
      const resetFieldsFn = () => {
        formMethods.resetFields();
      };
      const handleSubmitFn = async () => {
        try {
          await formMethods.validateFields();
        } catch (e: any) {
          debugger;
          if (e.errorFileds && e.errorFiled.length > 0) {
            const erritem = e.errorFiled[0];
            message.error(erritem.errors[0]);
            return;
          }
        }
        const formItem = formMethods.getFieldsValue();
        useUserStoreWithOut().modifyUserInfo(formItem);
      };
      //#endregion
      return {
        register,
        handleSubmitFn,
        resetFieldsFn,
      };
    },
  });
</script>

<style scoped></style>
