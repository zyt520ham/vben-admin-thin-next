<!--
 * @Description  : 里程碑配置上传 Drawer
 * @Author       : zhangyantao
 * @Date         :
 * @FilePath     : src/views/rg/cost-upload/wx-cost-upload/inner/MilestoneV2UploadDrawerComp.vue
-->
<template>
  <BasicDrawer
    :destroyOnClose="true"
    :maskClosable="false"
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="花费上传"
    width="500px"
    @ok="handleSubmitFn"
  >
    <BasicForm @register="registerForm">
      <template #slotChooseFile="{ values, model, field }">
        <!--        <a-form-item :label="schema.label" required :name="field">-->
        <a-upload
          :multiple="false"
          :file-list="model[field]"
          :remove="handleRemoveFn"
          :before-upload="beforeUploadFn"
          :accept="getChooseFileTypeFn(values)"
        >
          <a-button size="small">
            <UploadOutlined />
            选择文件
          </a-button>
        </a-upload>
        <!--        </a-form-item>-->
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts">
  export default {
    name: 'MilestoneV2UploadDrawerComp',
  };
</script>
<script lang="ts" setup>
  import { ref } from 'vue';

  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form';

  import { UploadOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import { isDevMode } from '/@/utils/env';
  import { IReqUploadMileStoneCfg } from '/@/api/model/uploadCostModel';

  import { uploadMileStoneCfgApi } from '/@/api/sys/costUploadApi';
  import { IReqErr } from '/#/axios';
  import { mileStoneV2UploadFormSchemas } from '/@/views/rg/cost-upload/mile-store-upload/v2/inner/milestone.data';

  interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    url?: string;
    preview?: string;
    originFileObj?: any;
    file: string | Blob;
  }
  interface IFormDataItem {
    file_type: string;
    type: 'apppackage' | 'country' | 'mediasource' | 'config';
    choose_file: FileItem[];
  }
  //#region emit ========================================
  // 基于类型
  //
  const emit = defineEmits<{
    (e: 'register', value: any): any;
    (
      e: 'update_milestone_list',
      cfgType: 'apppackage' | 'country' | 'mediasource' | 'config',
    ): void;
  }>();
  //#endregion ---------------------------------------------
  //#region form ========================================
  const [registerForm, formMethods] = useForm({
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    size: 'small',
    labelAlign: 'left',
    schemas: mileStoneV2UploadFormSchemas(),
    showActionButtonGroup: false,
  });

  //#endregion ---------------------------------------------

  //#region drawer =================================
  const [registerDrawer, drawInnerMethods] = useDrawerInner(async (propData) => {
    drawInnerMethods.setDrawerProps({ confirmLoading: false });
    await formMethods.resetFields();
    const setterValue = {
      file_type: 'csv',
    };
    if (propData.type) {
      setterValue['type'] = propData.type;
    }
    await formMethods.setFieldsValue(setterValue);
  });
  const handleSubmitFn = () => {
    formMethods
      .validate()
      .then(() => {
        console.log('success');
        const formObj: IFormDataItem = formMethods.getFieldsValue() as any;

        const params: IReqUploadMileStoneCfg = {
          type: formObj.type,
          file: formObj.choose_file[0] as any,
        };

        uploadMileStoneCfgApi(params).then(
          (resp) => {
            drawInnerMethods.setDrawerProps({
              loading: true,
              confirmLoading: true,
            });
            setTimeout(() => {
              drawInnerMethods.setDrawerProps({
                loading: false,
                confirmLoading: false,
              });
              emit('update_milestone_list', formObj.type);
            }, 1000);
          },
          (err: IReqErr) => {
            message.error(err.retMsg!);
          },
        );

        // drawInnerMethods.closeDrawer();
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
    if (isDevMode()) {
      const formItem = formMethods.getFieldsValue();
      console.log(formItem);
    }
  };

  //#endregion ---------------------------------------------

  //#region upload ========================================
  const fileList = ref<FileItem[]>([]);
  // const uploading = ref<boolean>(false);
  //选择文件之后，上传文件之前
  const beforeUploadFn = (file: FileItem) => {
    fileList.value = [...fileList.value, file];
    console.log('beforeUpload', file);
    const formItem = formMethods.getFieldsValue();

    // const formItem = formMethods.getFieldsValue();
    if (file) {
      formItem['choose_file'] = [file];
    } else {
      formItem['choose_file'] = undefined;
    }
    formMethods.setFieldsValue(formItem).then(() => {
      formMethods.validateFields(['choose_file']);
    });

    return false;
  };
  //移除选择的文件
  const handleRemoveFn = (file: FileItem) => {
    const formItem = formMethods.getFieldsValue();
    let fileList = formItem['choose_file'];
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    formItem['choose_file'] = newFileList;
    formMethods.setFieldsValue(formItem).then(() => {
      formMethods.validateFields(['choose_file']);
    });
  };
  //根据form data 返回选择文件的类型
  const getChooseFileTypeFn = (value: any) => {
    if (value['file_type'] === 'csv') {
      return '.csv';
    }
    return '*';
  };

  //#endregion ---------------------------------------------
</script>

<style lang="less" scoped></style>
