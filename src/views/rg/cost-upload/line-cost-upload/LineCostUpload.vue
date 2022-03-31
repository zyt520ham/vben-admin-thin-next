<!--
 * @Description  : Line 花费上传页面
 * @Author       : zhangyantao
 * @Date         :
 * @FilePath     : src/views/rg/cost-upload/line-cost-upload/LineCostUpload.vue
-->
<template>
  <PageWrapper :class="`${prefixCls}`" contentFullHeight dense>
    <a-card v-if="showSearchFormState" class="w-full rg-antd-cart">
      <BasicForm @register="formRegister" v-model:value="formData" />
    </a-card>
    <BasicTable @register="tableRegister">
      <template #tableTitle>
        <span class="flex space-x-3">
          <span class="font-bold">已上传花费列表</span>
          <TableAction
            :divider="false"
            :actions="[
              {
                tooltip: {
                  title: '上传新花费',
                  placement: 'top',
                },
                type: 'primary',
                size: 'small',
                shape: 'circle',
                icon: 'tabler:book-upload',
                onClick: tableToolsAddUpload.bind(null),
              },
            ]"
          />
        </span>
      </template>
      <template #toolbar>
        <GzShowSearchFormBtn
          :prop-show-state="showSearchFormState"
          :prop-toggle-show-state="useSearchBtnEventFn"
        />
      </template>
    </BasicTable>
    <LineUploadDrawerComp
      @register="registerDrawerFn"
      @update_cost_table_list="updateCostTableListFn"
    />
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'LineCostUpload',
  };
</script>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, SorterResult, TableAction, useTable } from '/@/components/Table';
  import GzShowSearchFormBtn from '/@/components/GzShowSearchFormBtn';
  import { log } from '/@/utils/log';
  import { arrSortFn } from '/@/utils/arrayUtils';
  import { formatToDate } from '/@/utils/dateUtil';
  import moment from 'moment';
  import {
    getLineCostColumnsCfg,
    getLineCostSearchFormSchemas,
    LineCostTableColumnsEnum,
    lineUploadDatesList,
  } from '/@/views/rg/cost-upload/line-cost-upload/inner/linecost.data';
  import LineUploadDrawerComp from './inner/LineUploadDrawerComp.vue';
  import { useDrawer } from '/@/components/Drawer';
  const { prefixCls } = useDesign('upload-cost-line');

  //#region search ========================================

  //#endregion ---------------------------------------------
  //#region search form ========================================
  const showSearchFormState = ref<boolean>(false);
  const useSearchBtnEventFn = (isShow: boolean) => {
    showSearchFormState.value = isShow;
    tableMethods.redoHeight();
  };

  const formData = ref();
  const resetFormEventFn = () =>
    new Promise<void>((resolve) => {
      let rowDataList = tableMethods.getRawDataSource();

      tableMethods.setTableData(rowDataList.slice());
      resolve();
    });
  const searchFormEventFn = () => {
    return new Promise<void>((resolve) => {
      const formData = formMethods.getFieldsValue();
      const dateString = formData[LineCostTableColumnsEnum.kUploadDate];
      const dateForDay = formatToDate(moment(dateString, 'YYYY-MM-DD hh:mm:ss'), 'YYYYMMDD');
      // debugger;
      console.log('searchFormEventFn', formData);
      const searchItem: any = {};
      // for (const formDataKey in formData) {
      //   if (formData[formDataKey]) {
      //     searchItem[formDataKey] = formData[formDataKey];
      //   }
      // }
      searchItem[LineCostTableColumnsEnum.kUploadDate] = dateForDay;
      const allSearchKeys = Object.keys(searchItem);

      let rowDataList = tableMethods.getRawDataSource();

      const filterList = rowDataList.filter((ele) => {
        let oldSearchResult: Nullable<boolean> = null;
        let index = 0;
        while (index < allSearchKeys.length) {
          const key = allSearchKeys[index];
          if (index === 0) {
            if (ele[key].indexOf(searchItem[key]) >= 0) {
              oldSearchResult = true;
            } else {
              oldSearchResult = false;
            }
          } else {
            if (ele[key].indexOf(searchItem[key]) >= 0) {
              oldSearchResult = oldSearchResult && true;
            } else {
              oldSearchResult = oldSearchResult && false;
            }
          }
          index++;
        }

        return oldSearchResult;
      });
      tableMethods.setTableData(filterList);
      resolve();
    });
  };
  const [formRegister, formMethods] = useForm({
    labelWidth: '120px',
    size: 'small',
    showAdvancedButton: true,
    schemas: getLineCostSearchFormSchemas(),
    actionColOptions: {
      span: 24,
    },
    advancedBtnEventFunc: () => {
      tableMethods.redoHeight();
    },
    resetButtonOptions: {
      size: 'small',
    },
    submitButtonOptions: {
      size: 'small',
    },
    resetFunc: resetFormEventFn,
    submitFunc: searchFormEventFn,
  });
  //#endregion ---------------------------------------------
  //#region table ========================================
  const tableSortFn = (sortInfo: SorterResult) => {
    log('tableSortFn', sortInfo);
    const list = tableMethods.getRawDataSource().slice();
    const sortList = arrSortFn(list, sortInfo.field, sortInfo.order);
    tableMethods.setTableData(sortList);
  };
  const getUploadedCostListApi = () => {
    console.log('getUploadedCostListApi');
    return new Promise((resolve, reject) => {
      const allDateList = lineUploadDatesList.slice();
      allDateList.sort((a, b) => {
        return b.localeCompare(a);
      });
      const tableRawDatasList: any[] = [];
      allDateList.map((ele) => {
        if (ele) {
          tableRawDatasList.push({
            [LineCostTableColumnsEnum.kUploadDate as string]: ele,
          });
        }
      });
      resolve(tableRawDatasList);
    });
  };
  const [tableRegister, tableMethods] = useTable({
    showTableSetting: true,
    api: getUploadedCostListApi,
    bordered: true,
    columns: getLineCostColumnsCfg,
    canResize: true,
    pagination: false,
    showIndexColumn: false,
    sortFn: tableSortFn,
  });
  const tableToolsAddUpload = () => {
    drawerMethods.openDrawer(true, {});
  };
  //#endregion ---------------------------------------------
  //#region drawer ========================================
  const [registerDrawerFn, drawerMethods] = useDrawer();
  const updateCostTableListFn = (list: any) => {
    console.log('updateCostTableListFn line', list);
    tableMethods.reload();
    drawerMethods.closeDrawer();
  };
  //#endregion ---------------------------------------------
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-upload-cost-line';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
  }
</style>
