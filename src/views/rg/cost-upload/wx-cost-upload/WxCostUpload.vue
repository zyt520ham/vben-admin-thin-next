<template>
  <PageWrapper :class="`${prefixCls}`" contentFullHeight dense>
    <a-card v-if="showSearchFormState" class="w-full rg-antd-cart">
      <BasicForm @register="formRegister" v-model:value="formData" />
    </a-card>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <span class="flex space-x-3">
          <span class="font-bold">已上传花费列表</span>
          <a-button size="small">上传新花费</a-button>
        </span>
      </template>
      <template #toolbar>
        <GzShowSearchFormBtn
          :prop-show-state="showSearchFormState"
          :prop-toggle-show-state="useSearchBtnEventFn"
        />
      </template>
      <template #colWxAccount="{ record, column }">
        <a-space :size="3">
          <template v-for="account in record[column.dataIndex]" :key="account">
            <a-tag>{{ wxAccountFormatFn(account) }}</a-tag>
          </template>
        </a-space>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'WxCostUpload',
  };
</script>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, SorterResult, useTable } from '/@/components/Table';
  import { useDesign } from '/@/hooks/web/useDesign';
  import GzShowSearchFormBtn from '/@/components/GzShowSearchFormBtn';
  import { ref } from 'vue';
  import {
    getformSchemas,
    getWxCostColumnsCfg,
    testUploadWxAccountListData,
    wxAccountNameMaps,
    wxCostTableColumnsEnum,
  } from './inner/wxcost.data';
  import { log } from '/@/utils/log';
  import { arrSortFn } from '/@/utils/arrayUtils';

  const { prefixCls } = useDesign('upload-cost-wx');

  //#region search form =================================
  const showSearchFormState = ref<boolean>(true);
  const useSearchBtnEventFn = (isShow: boolean) => {
    showSearchFormState.value = isShow;
  };
  const formData = ref();
  const [formRegister] = useForm({
    labelWidth: '120px',
    size: 'small',
    showAdvancedButton: true,
    schemas: getformSchemas(),
    actionColOptions: {
      span: 24,
    },
  });
  //#endregion

  //#region table  ========================================
  const tableSortFn = (sortInfo: SorterResult) => {
    log('tableSortFn', sortInfo);
    const list = tableMethods.getRawDataSource().slice();
    const sortList = arrSortFn(list, sortInfo.field, sortInfo.order);
    tableMethods.setTableData(sortList);
  };
  const getUploadedCostList = () => {
    return new Promise((resolve, reject) => {
      const allDateKeys = Object.keys(testUploadWxAccountListData);
      allDateKeys.sort((a, b) => {
        return b.localeCompare(a);
      });
      const tableRawDatasList: any[] = [];
      allDateKeys.map((ele) => {
        if (testUploadWxAccountListData[ele]) {
          tableRawDatasList.push({
            [wxCostTableColumnsEnum.kUploadDate as string]: ele,
            [wxCostTableColumnsEnum.kWxAccount as string]: testUploadWxAccountListData[
              ele
            ] as string[],
          });
        }
      });
      resolve(tableRawDatasList);
    });
  };
  const [registerTable, tableMethods] = useTable({
    showTableSetting: true,
    api: getUploadedCostList,
    bordered: true,
    columns: getWxCostColumnsCfg,
    canResize: true,
    pagination: false,
    showIndexColumn: false,
    sortFn: tableSortFn,
  });
  const wxAccountFormatFn = (accountId: string) => {
    const name = wxAccountNameMaps[accountId] || '';
    return `${name}[${accountId}]`;
  };
  //#endregion ---------------------------------------------
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-upload-cost-wx';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
    background-color: #ebeef5;
  }
</style>
