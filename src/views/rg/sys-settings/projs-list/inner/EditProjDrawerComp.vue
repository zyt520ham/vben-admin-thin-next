<template>
  <BasicDrawer
    :destroy-on-close="true"
    :mask-closable="true"
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
    name: 'EditProjDrawerComp',
  };
</script>
<script lang="ts" setup>
  // import { useDesign } from '/@/hooks/web/useDesign';
  import { logNoTrace } from '/@/utils/log';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import BasicForm from '/@/components/Form/src/BasicForm.vue';
  import { useForm } from '/@/components/Form';

  import { message } from 'ant-design-vue';
  import { IReqErr } from '/#/axios';
  import { getEditProjFormCfg, editProjFormColEnum } from './projs.data';
  import { updateProjDataApi } from '/@/api/sys/projectApi';
  import { useProjsStoreWithOut } from '/@/store/modules/projectsStore';
  // const { prefixCls } = useDesign('adduser-drawer-comp');

  //#region emit ========================================
  const emit = defineEmits<{
    (e: 'register', value: any): any;
    (e: 'update_Proj_list', value?: any): void;
  }>();
  //#endregion ---------------------------------------------

  //#region form ========================================
  const [registerForm, formMethods] = useForm({
    // labelWidth: '120px',
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    size: 'small',
    labelAlign: 'left',
    schemas: getEditProjFormCfg,
    showActionButtonGroup: false,
  });

  //#endregion ---------------------------------------------

  //#region  drawer ========================================
  const [registerDrawer, drawInnerMethods] = useDrawerInner(async (propData) => {
    logNoTrace('useDrawerInner', propData);
    const oriForm = {
      [editProjFormColEnum.kProjId]: propData[editProjFormColEnum.kProjId],
      [editProjFormColEnum.kProjName]: propData[editProjFormColEnum.kProjName],
      [editProjFormColEnum.kProjOrder]: propData[editProjFormColEnum.kProjOrder],
      [editProjFormColEnum.kProjStatus]: propData[editProjFormColEnum.kProjStatus],
    };
    await formMethods.setFieldsValue(oriForm);
    drawInnerMethods.setDrawerProps({ confirmLoading: false });
  });
  const handleEnterFn = () => {
    logNoTrace('handleEnter');
    formMethods
      .validate()
      .then(() => {
        logNoTrace(':success');
        const formData: any = formMethods.getFieldsValue() as any;
        drawInnerMethods.setDrawerProps({ confirmLoading: true });
        updateProjDataApi(formData).then(
          async (resp) => {
            const data = await useProjsStoreWithOut().checkAllProjects(true);
            drawInnerMethods.setDrawerProps({ confirmLoading: false });
            emit('update_Proj_list');
            drawInnerMethods.closeDrawer();
          },
          (err: IReqErr) => {},
        );
        console.log(formData);
      })
      .catch((e) => {
        if (e.errorFields?.length > 0) {
          const errObj = e.errorFields[0];
          const errMsg = errObj.errors || '';
          if (errMsg) {
            message.error(errMsg!);
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
