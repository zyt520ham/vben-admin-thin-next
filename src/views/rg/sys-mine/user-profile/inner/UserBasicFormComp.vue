<template>
  <div class="py-8 bg-white flex flex-col justify-center items-center">
    <BasicForm @register="register" />
    <div class="flex justify-center">
      <a-button @click="resetFields"> 重置 </a-button>
      <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { userInfoEditSchema } from '/@/views/rg/sys-mine/user-profile/inner/userProfile.data';
  export default defineComponent({
    name: 'UserBasicFormComp',
    components: {
      BasicForm,
    },
    setup() {
      const [register] = useForm({
        size: 'small',
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: userInfoEditSchema,
      });
      return {
        register,
      };
    },
  });
</script>

<style scoped></style>
