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
    <div v-if="getIsFilterLoadingFinish">
      <span>说明:全不选某字段，会被认作无需过滤该字段~~</span>
      <Divider />
      <BasicForm @register="registerForm">
        <template #fieldStartDay="{ model, field }">
          <MilestoneFilterItem
            v-model:filterData="model[field]"
            :selectOptions="getFieldOptions(field)"
          />
        </template>
        <template #fieldAppPackageSys="{ model, field }">
          <MilestoneFilterItem
            v-model:filterData="model[field]"
            :selectOptions="getFieldOptions(field)"
          />
        </template>
        <template #fieldAppPackageGroup="{ model, field }">
          <MilestoneFilterItem
            v-model:filterData="model[field]"
            :selectOptions="getFieldOptions(field)"
          />
        </template>
        <template #fieldCountryGroup="{ model, field }">
          <MilestoneFilterItem
            v-model:filterData="model[field]"
            :selectOptions="getFieldOptions(field)"
          />
        </template>
        <template #fieldMediaSourceGroup="{ model, field }">
          <MilestoneFilterItem
            v-model:filterData="model[field]"
            :selectOptions="getFieldOptions(field)"
          />
        </template>
      </BasicForm>
    </div>
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

  import MilestoneFilterItem from '/@/views/rg/chart-boards/milestone-v2/inner/MilestoneFilterItem.vue';

  import { getSeachFilterFormCfg } from '/@/views/rg/chart-boards/milestone-v2/inner/data/drawer.data';
  import { ref } from 'vue';
  import { MilestoneColumnsKeyEnum } from '/@/views/rg/chart-boards/milestone-v2/inner/data/milestone.data';
  import { getColsValues } from '/@/views/rg/chart-boards/milestone-v2/inner/MileStoneRequest';
  import { useFilterModel } from '/@/views/rg/chart-boards/milestone-v2/inner/model/filterModel';
  import { Divider } from 'ant-design-vue';
  import { deepMerge } from '/@/utils/index';

  // const { prefixCls } = useDesign('adduser-drawer-comp');

  //#region emit ========================================
  const emits = defineEmits<{
    (e: 'register', value: any): any;
    (e: 'reloadData', value?: any): any;
  }>();
  //#endregion ---------------------------------------------
  //#region select options =================================
  const allSelectOptionsRef = ref({});
  const getIsFilterLoadingFinish = ref<boolean>(false);
  //#endregion  -------------------------------------

  function getFieldOptions(field: string) {
    return allSelectOptionsRef.value[field];
  }

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
    drawInnerMethods.setDrawerProps({ loading: true });
    // getColsValues()
    if (useFilterModel.filterOptionsMap) {
      allSelectOptionsRef.value = useFilterModel.filterOptionsMap;
    } else {
      const fieldsValues = await getColsValues([
        MilestoneColumnsKeyEnum.kStartDay,
        MilestoneColumnsKeyEnum.kMediaSourceGroup,
        MilestoneColumnsKeyEnum.kCountryGroup,
        MilestoneColumnsKeyEnum.kAppPackageGroup,
        MilestoneColumnsKeyEnum.kAppPackageSys,
      ]);
      allSelectOptionsRef.value = fieldsValues;
      useFilterModel.filterOptionsMap = fieldsValues;
    }
    getIsFilterLoadingFinish.value = true;
    if (useFilterModel.filterKeys.length > 0) {
      const formData = formMethods.getFieldsValue();
      useFilterModel.filterKeys.forEach((ele) => {
        formData[ele] = useFilterModel.filterMap[ele];
      });
      await formMethods.setFieldsValue(formData);
    }

    drawInnerMethods.setDrawerProps({ loading: false });
  });
  const handleEnterFn = () => {
    const formData = formMethods.getFieldsValue();
    useFilterModel.filterMap = deepMerge(useFilterModel.filterMap, formData);
    logNoTrace('handleEnter', formData, useFilterModel.filterMap);
    emits('reloadData');
    drawInnerMethods.closeDrawer();
  };
  //#endregion ---------------------------------------------
</script>

<style lang="less">
  //@prefix-cls: ~'@{namespace}-adduser-drawer-comp';
  //@ns-prefix: ~'@{namespace}';
  //.@{prefix-cls} {
  //}
</style>
