<!--
 * @Description  : 微信花费上传 Drawer
 * @Author       : zhangyantao
 * @Date         :
 * @FilePath     : src/views/rg/cost-upload/wx-cost-upload/inner/WxUploadDrawerComp.vue
-->
<template>
  <BasicDrawer
    destroyOnClose
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="花费上传"
    width="500px"
    @ok="handleSubmitFn"
  >
    <BasicForm @register="registerForm">
      <template #slotChooseFile="{ model }">
        <a-upload
          :multiple="true"
          :file-list="fileList"
          :remove="handleRemoveFn"
          :before-upload="beforeUploadFn"
          :accept="getChooseFileTypeFn(model)"
        >
          <a-button>
            <UploadOutlined />
            选择文件
          </a-button>
        </a-upload>
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

  const [registerDrawer, drawInnerMethods] = useDrawerInner(async (propData) => {
    drawInnerMethods.setDrawerProps({ confirmLoading: false });
    await formMethods.resetFields();
    await formMethods.setFieldsValue({
      file_type: 'csv',
    });
  });
  const handleSubmitFn = () => {};

  //#region form ========================================
  const [registerForm, formMethods] = useForm({
    labelWidth: 90,
    schemas: wxUploadFormSchemas(),
    showActionButtonGroup: false,
  });
  //#endregion ---------------------------------------------

  //#region upload ========================================
  const fileList = ref<FileItem[]>([]);
  // const uploading = ref<boolean>(false);
  //选择文件之后，上传文件之前
  const beforeUploadFn = (file: FileItem) => {
    fileList.value = [...fileList.value, file];
    return false;
  };
  //移除选择的文件
  const handleRemoveFn = (file: FileItem) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
  };
  //根据form data 返回选择文件的类型
  const getChooseFileTypeFn = (model: any) => {
    console.log(model);
    if (model['file_type'] === 'csv') {
      return '.csv';
    }
    return '*';
  };
  //#endregion ---------------------------------------------
</script>

<style lang="less" scoped></style>
