<template>
  <BasicDrawer
    :destroy-on-close="true"
    :mask-closable="false"
    v-bind="$attrs"
    @register="registerDrawer"
    show-footer
    title="新建用户"
    width="500px"
    @ok="handleEnterFn"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>

<script lang="ts">
  export default {
    name: 'AddUserDrawerComp',
  };
</script>
<script lang="ts" setup>
  // import { useDesign } from '/@/hooks/web/useDesign';
  import { logNoTrace } from '/@/utils/log';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import BasicForm from '/@/components/Form/src/BasicForm.vue';
  import { useForm } from '/@/components/Form';

  import { AddUserFormColEnum, getAddUserFormCfg } from './account.data';
  import { message } from 'ant-design-vue';
  import { getCreateUserApi } from '/@/api/sys/user';
  import { IReqCreateUser } from '/@/api/model/userModel';
  import { IReqErr } from '/#/axios';
  // const { prefixCls } = useDesign('adduser-drawer-comp');

  //#region emit ========================================
  const emit = defineEmits<{
    (e: 'register', value: any): any;
    (e: 'update_user_list', value?: any): void;
  }>();
  //#endregion ---------------------------------------------

  //#region form ========================================
  const [registerForm, formMethods] = useForm({
    // labelWidth: '120px',
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    size: 'small',
    labelAlign: 'left',
    schemas: getAddUserFormCfg,
    showActionButtonGroup: false,
  });

  //#endregion ---------------------------------------------

  //#region  drawer ========================================
  const [registerDrawer, drawInnerMethods] = useDrawerInner(async (propData) => {
    logNoTrace('useDrawerInner');
    drawInnerMethods.setDrawerProps({ confirmLoading: false });
  });
  const handleEnterFn = () => {
    logNoTrace('handleEnter');
    formMethods
      .validate()
      .then(() => {
        logNoTrace(':success');
        const formData: any = formMethods.getFieldsValue() as any;
        //  TODO:: 文件上传逻辑
        const params: IReqCreateUser = {
          account: formData[AddUserFormColEnum.kAccount],
          nickname: formData[AddUserFormColEnum.kNickName],
        } as any;
        if (formData[AddUserFormColEnum.kEmail]) {
          params['email'] = formData[AddUserFormColEnum.kEmail];
        }
        if (formData[AddUserFormColEnum.kPhone]) {
          params['phone'] = formData[AddUserFormColEnum.kPhone];
        }
        getCreateUserApi(params).then(
          (resp) => {
            emit('update_user_list');
          },
          (err: IReqErr) => {
            message.error(err.retMsg!);
            drawInnerMethods.closeDrawer();
          },
        );
        console.log(formData);
      })
      .catch((e) => {
        if (e.errorFields?.length > 0) {
          const errObj = e.errorFields[0];
          const errMsg = errObj.errors || '';
          if (errMsg) {
            message.error(errMsg);
          }
        }
        console.log(e);
      });
  };
  //#endregion ---------------------------------------------
</script>

<style lang="less" scoped>
  //@prefix-cls: ~'@{namespace}-adduser-drawer-comp';
  //@ns-prefix: ~'@{namespace}';
  //.@{prefix-cls} {
  //}
</style>
