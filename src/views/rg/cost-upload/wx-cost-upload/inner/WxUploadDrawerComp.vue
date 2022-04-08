<!--
 * @Description  : 微信花费上传 Drawer
 * @Author       : zhangyantao
 * @Date         :
 * @FilePath     : src/views/rg/cost-upload/wx-cost-upload/inner/WxUploadDrawerComp.vue
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
    name: 'WxUploadDrawerComp',
  };
</script>
<script lang="ts" setup>
  import { ref } from 'vue';

  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form';
  import { wxUploadFormSchemas } from './wxcost.data';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import { uploadWxCostApi } from '/@/api/sys/costUploadApi';
  import { IReqUploadWxCost } from '/@/api/model/uploadCostModel';
  import { IReqErr } from '/#/axios';
  import { formatToDate } from '/@/utils/dateUtil';
  import moment from 'moment';

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
    upload_date: string;
    wx_account: string;
    choose_file: FileItem[];
  }
  //#region emit ========================================
  // 基于类型
  //
  const emit = defineEmits<{
    (e: 'register', value: any): any;
    (e: 'update_cost_table_list', value: any): void;
  }>();
  //#endregion ---------------------------------------------
  //#region form ========================================
  const [registerForm, formMethods] = useForm({
    // labelWidth: '120px',
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    size: 'small',
    labelAlign: 'left',
    schemas: wxUploadFormSchemas(),
    showActionButtonGroup: false,
  });

  //#endregion ---------------------------------------------

  //#region drawer =================================
  const [registerDrawer, drawInnerMethods] = useDrawerInner(async (propData) => {
    drawInnerMethods.setDrawerProps({ confirmLoading: false });
    await formMethods.resetFields();
    const startFormItem: IFormDataItem = {
      file_type: 'csv',
      upload_date: moment(new Date()).format('YYYYMMDD'),
      // wx_account: '',
      // choose_file: [],
    } as any;
    await formMethods.setFieldsValue(startFormItem);
  });
  const handleSubmitFn = () => {
    formMethods
      .validate()
      .then(() => {
        console.log('success');
        const formData: IFormDataItem = formMethods.getFieldsValue() as IFormDataItem;
        console.log(formData);
        const params: IReqUploadWxCost = {
          file: formData.choose_file[0] as any,
          app: '102',
          account: formData.wx_account,
          day: formatToDate(moment(formData.upload_date, 'YYYYMMDD')),
        };

        uploadWxCostApi(params)
          .then((resp) => {
            console.log(resp);
            emit('update_cost_table_list', [1, 2, 3]);
            drawInnerMethods.closeDrawer();
          })
          .catch((e: IReqErr) => {
            console.log(e);
            message.error(e.retMsg!);
          });
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
    const formItem = formMethods.getFieldsValue();
    console.log(formItem);
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
