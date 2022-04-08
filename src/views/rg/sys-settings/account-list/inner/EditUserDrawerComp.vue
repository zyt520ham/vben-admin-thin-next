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
    name: 'EditUserDrawerComp',
  };
</script>
<script lang="ts" setup>
  // import { useDesign } from '/@/hooks/web/useDesign';
  import { logNoTrace } from '/@/utils/log';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import BasicForm from '/@/components/Form/src/BasicForm.vue';
  import { useForm } from '/@/components/Form';

  import { AddUserFormColEnum, getEditUserFormCfg } from './account.data';
  import { message } from 'ant-design-vue';
  import { updateUserInfoByAdminApi } from '/@/api/sys/user';

  import { IReqErr } from '/#/axios';
  import { IUserInfo } from '/#/store';
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
    schemas: getEditUserFormCfg,
    showActionButtonGroup: false,
  });

  //#endregion ---------------------------------------------

  //#region  drawer ========================================
  const [registerDrawer, drawInnerMethods] = useDrawerInner(async (propData: IUserInfo) => {
    logNoTrace('useDrawerInner');
    const oriFormData = {
      [AddUserFormColEnum.kUserId]: propData.user_id,
      [AddUserFormColEnum.kAccount]: propData.account,
      [AddUserFormColEnum.kNickName]: propData.nickname,
    };
    if (propData.phone) {
      oriFormData[AddUserFormColEnum.kPhone] = propData.phone;
    }
    if (propData.email) {
      oriFormData[AddUserFormColEnum.kEmail] = propData.email;
    }
    await formMethods.setFieldsValue(oriFormData);
    drawInnerMethods.setDrawerProps({ confirmLoading: false });
  });
  const handleEnterFn = () => {
    logNoTrace('handleEnter');
    formMethods
      .validate()
      .then(() => {
        logNoTrace(':success');
        const formData: any = formMethods.getFieldsValue() as any;
        drawInnerMethods.setDrawerProps({
          confirmLoading: true,
          loading: true,
        });
        updateUserInfoByAdminApi(formData).then(
          (resp) => {
            logNoTrace(resp);
            message.success('修改用户信息成功');
            emit('update_user_list');
            drawInnerMethods.setDrawerProps({
              confirmLoading: false,
              loading: false,
            });
            drawInnerMethods.closeDrawer();
          },
          (err: IReqErr) => [message.error(err.retMsg!)],
        );
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
