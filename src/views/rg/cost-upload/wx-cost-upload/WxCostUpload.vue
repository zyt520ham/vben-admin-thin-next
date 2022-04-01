<template>
  <PageWrapper :class="`${prefixCls}`" contentFullHeight dense>
    <a-card v-if="showSearchFormState" class="w-full rg-antd-cart">
      <BasicForm @register="formRegister" v-model:value="formData" />
    </a-card>
    <BasicTable @register="registerTable">
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
          <TableAction
            :divider="false"
            :actions="[
              {
                tooltip: {
                  title: '配置微信账户',
                  placement: 'top',
                },
                type: 'primary',
                size: 'small',
                shape: 'circle',
                icon: 'carbon:task-settings',
                onClick: tableToolsSettingWxAccount.bind(null),
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
      <template #colWxAccount="{ record, column }">
        <a-space :size="3">
          <template v-for="account in record[column.dataIndex]" :key="account">
            <a-tag>{{ wxAccountFormatFn(account) }}</a-tag>
          </template>
        </a-space>
      </template>
    </BasicTable>
    <WxUploadDrawerComp
      @register="registerDrawerFn"
      @update_cost_table_list="updateCostTableListFn"
    />
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
  import { BasicTable, SorterResult, TableAction, useTable } from '/@/components/Table';
  import { useDesign } from '/@/hooks/web/useDesign';
  import GzShowSearchFormBtn from '/@/components/GzShowSearchFormBtn';
  import WxUploadDrawerComp from './inner/WxUploadDrawerComp.vue';
  import { ref } from 'vue';
  import {
    getformSchemas,
    getWxCostColumnsCfg,
    wxAccountNameMaps,
    wxCostTableColumnsEnum,
  } from './inner/wxcost.data';
  import { log } from '/@/utils/log';
  import { arrSortFn } from '/@/utils/arrayUtils';
  import { formatToDate } from '/@/utils/dateUtil';
  import moment from 'moment';
  import { useDrawer } from '/@/components/Drawer';
  import { getCostForWxApi } from '/@/api/sys/costApi';
  import { IReqGetWxCost } from '/@/api/model/costModel';
  import { IReqErr } from '/#/axios';
  import { message } from 'ant-design-vue';

  const { prefixCls } = useDesign('upload-cost-wx');

  //#region search form =================================
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
      const dateString = formData[wxCostTableColumnsEnum.kUploadDate];
      const dateForDay = formatToDate(moment(dateString, 'YYYY-MM-DD hh:mm:ss'), 'YYYYMMDD');
      // debugger;
      console.log('searchFormEventFn', formData);
      const searchItem: any = {};
      // for (const formDataKey in formData) {
      //   if (formData[formDataKey]) {
      //     searchItem[formDataKey] = formData[formDataKey];
      //   }
      // }
      searchItem[wxCostTableColumnsEnum.kUploadDate] = dateForDay;
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
    schemas: getformSchemas(),
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
      const params: IReqGetWxCost = {
        app: '102',
      };
      getCostForWxApi(params).then(
        (resp) => {
          // console.log('getCostForWxApi', resp);
          const allDateKeys = Object.keys(resp);
          allDateKeys.sort((a, b) => {
            return b.localeCompare(a);
          });
          const tableRawDatasList: any[] = [];
          allDateKeys.map((ele) => {
            if (resp[ele]) {
              tableRawDatasList.push({
                [wxCostTableColumnsEnum.kUploadDate as string]: ele,
                [wxCostTableColumnsEnum.kWxAccount as string]: resp[ele] as string[],
              });
            }
          });
          resolve(tableRawDatasList);
        },
        (err: IReqErr) => {
          console.log('getCostForWxApi', err);
          reject();
          message.error(err.retMsg!);
        },
      );
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
  const tableToolsAddUpload = () => {
    drawerMethods.openDrawer(true, {});
  };
  const tableToolsSettingWxAccount = () => {};
  //#endregion ---------------------------------------------

  //#region drawer ========================================
  const [registerDrawerFn, drawerMethods] = useDrawer();
  const updateCostTableListFn = (list: any) => {
    console.log('upateCostTableListFn', list);
    tableMethods.reload();
    drawerMethods.closeDrawer();
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
