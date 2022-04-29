<template>
  <div>
    <div class="divider-custom-warper">
      <Checkbox
        v-model:checked="getIsCheckAll"
        :indeterminate="getIsIndeterminate"
        @change="onCheckAllChange($event)"
        >全选</Checkbox
      >
      <span class="float-right">
        <Space :size="7">
          <RadioGroup
            disabled
            button-style="solid"
            size="small"
            v-model:value="getModelValueComputed['multType']"
          >
            <RadioButton :value="0">单选</RadioButton>
            <RadioButton :value="1">多选</RadioButton>
          </RadioGroup>
          <RadioGroup
            button-style="solid"
            size="small"
            v-model:value="getModelValueComputed['useValueType']"
          >
            <RadioButton :value="0">包括值</RadioButton>
            <RadioButton :value="1">排除值</RadioButton>
          </RadioGroup>
        </Space>
      </span>
    </div>
    <CheckboxGroup
      :options="getSelectOptionsComputed"
      v-model:value="getModelValueComputed['values']"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { Checkbox, CheckboxGroup, RadioButton, RadioGroup, Space } from 'ant-design-vue';
  interface IFilterItem {
    /** 配置单选/多选*/
    multType: 0 | 1;
    /** 选中值/过滤值*/
    useValueType: 0 | 1;
    values: (string | number)[];
  }

  interface IProps {
    filterData: IFilterItem;
    selectOptions: { label: string; value: string }[] | (string | number)[];
  }
  const props = withDefaults(defineProps<IProps>(), {
    filterData: () => {
      return {
        multType: 1,
        useValueType: 0,
        values: [],
      };
    },
    selectOptions: () => [],
  });
  const emits = defineEmits<{
    (e: 'update:filterData', value: IFilterItem): void;
  }>();
  /** 全选状态绑定*/
  const getIsCheckAll = ref<Boolean>(false);
  /** 非全选状态，只控制显示样式*/
  const getIsIndeterminate = ref<Boolean>(false);
  const getSelectOptionsComputed = computed(() => {
    return props.selectOptions;
  });
  const getModelValueComputed = computed({
    get: () => {
      return props.filterData;
    },
    set: (nV) => {
      console.log('发送emit', JSON.stringify(nV));
      emits('update:filterData', nV);
    },
  });
  const onCheckAllChange = (e: any) => {
    if (e.target.checked) {
      const formData = getModelValueComputed.value;
      formData['values'] = getSelectOptionsComputed.value.map((ele) => {
        return ele.value || ele;
      });
      getModelValueComputed.value = formData;
    } else {
      const formData = getModelValueComputed.value;
      formData['values'] = [];
      getModelValueComputed.value = formData;
    }
  };

  watch(
    () => getModelValueComputed.value.values,
    (nVal: any[]) => {
      getIsCheckAll.value = nVal.length === getSelectOptionsComputed.value.length;
      getIsIndeterminate.value =
        !!nVal.length && nVal.length < getSelectOptionsComputed.value.length;
    },
    {
      immediate: true,
    },
  );
</script>
<script lang="ts">
  export default {
    name: 'MilestoneFilterItem',
  };
</script>

<style scoped>
  .divider-custom-warper {
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: 5px;
    margin-bottom: 5px;
  }
</style>
