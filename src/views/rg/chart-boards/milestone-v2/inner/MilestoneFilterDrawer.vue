<template>
  <BasicDrawer
    :destroy-on-close="true"
    :mask-closable="false"
    v-bind="$attrs"
    @register="registerDrawer"
    show-footer
    title="设置查询筛选条件"
    width="500px"
    @ok="handleEnterFn"
  >
    <BasicForm @register="registerForm">
      <template #fieldAppPackageSys="{ model, field }">
        <div class="divider-custom-warper">
          <Checkbox @change="onCheckAllChange($event, field)">全选</Checkbox>
          <span class="float-right">
            <Space :size="7">
              <RadioGroup
                disabled
                button-style="solid"
                size="small"
                v-model:value="model[field]['multType']"
              >
                <RadioButton :value="0">单选</RadioButton>
                <RadioButton :value="1">多选</RadioButton>
              </RadioGroup>
              <RadioGroup
                button-style="solid"
                size="small"
                v-model:value="model[field]['useValueType']"
              >
                <RadioButton :value="0">包括值</RadioButton>
                <RadioButton :value="1">排除值</RadioButton>
              </RadioGroup>
            </Space>
          </span>
        </div>

        <CheckboxGroup :options="getAppPfOptionsComputed" v-model:value="model[field]['values']" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts">
  export default {
    name: 'MilestoneFilterDrawer',
  };
</script>
<script lang="ts" setup>
  // import { useDesign } from '/@/hooks/web/useDesign';
  import { logNoTrace } from '/@/utils/log';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import BasicForm from '/@/components/Form/src/BasicForm.vue';
  import { useForm } from '/@/components/Form';

  import { Checkbox, CheckboxGroup, RadioButton, RadioGroup, Space } from 'ant-design-vue';

  import { getSeachFilterFormCfg } from '/@/views/rg/chart-boards/milestone-v2/inner/data/drawer.data';
  import { computed } from 'vue';
  // const { prefixCls } = useDesign('adduser-drawer-comp');

  //#region emit ========================================
  // const emit = defineEmits<{
  //   (e: 'register', value: any): any;
  // }>();
  //#endregion ---------------------------------------------

  const getAppPfOptionsComputed = computed(() => {
    return [
      {
        label: '安卓',
        value: 'AOS',
      },
      {
        label: '苹果',
        value: 'IOS',
      },
      {
        label: 'web',
        value: 'WEBGLOBAL',
      },
    ];
  });
  const onCheckAllChange = (e: any, field: string) => {
    if (e.target.checked) {
      const formData = formMethods.getFieldsValue();
      formData[field]['values'] = getAppPfOptionsComputed.value.map((ele) => {
        return ele.value;
      });
      formMethods.setFieldsValue(formData);
    } else {
      const formData = formMethods.getFieldsValue();
      formData[field]['values'] = [];
      formMethods.setFieldsValue(formData);
    }
  };
  //#region form ========================================
  const [registerForm, formMethods] = useForm({
    // labelWidth: '120px',
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
    size: 'small',
    labelAlign: 'left',
    schemas: getSeachFilterFormCfg,
    showActionButtonGroup: false,
  });

  //#endregion ---------------------------------------------

  //#region  drawer ========================================
  const [registerDrawer, drawInnerMethods] = useDrawerInner(async (propData) => {
    logNoTrace('useDrawerInner');
    drawInnerMethods.setDrawerProps({ confirmLoading: false });
  });
  const handleEnterFn = () => {
    const formData = formMethods.getFieldsValue();
    logNoTrace('handleEnter', formData);
  };
  //#endregion ---------------------------------------------
</script>

<style lang="less">
  //@prefix-cls: ~'@{namespace}-adduser-drawer-comp';
  //@ns-prefix: ~'@{namespace}';
  //.@{prefix-cls} {
  //}
  .divider-custom-warper {
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: 5px;
    margin-bottom: 5px;
  }
</style>
