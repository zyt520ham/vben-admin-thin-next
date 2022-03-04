<template>
  <PageWrapper :class="`${prefixCls}`" dense content-class="flex space-x-5px p-5px">
    <div class="w-1/3 lg:w-1/5 xl:w-1/6 h-full">
      <a-card class="w-full rg-antd-cart" :bordered="true" hoverable>
        <span>123123</span>
      </a-card>
    </div>
    <div class="w-2/3 lg:w-4/5 xl:w-5/6 h-full space-y-5px">
      <a-card v-if="useSearchState" class="w-full rg-antd-cart">
        <BasicForm @register="formRegister" />
      </a-card>
      <BasicTable @register="registerTableFn">
        <template #toolbar>
          <GzShowSearchFormBtn
            :prop-show-state="useSearchState"
            :prop-toggle-show-state="useSearchBtnEventFn"
          />
        </template>
        <template #colUserId="{ record, column }">
          <a-tag>{{ record[column.dataIndex] }}</a-tag>
        </template>
        <template #colStatus="{ record, column }">
          <template v-if="record[column.dataIndex] * 1 === 0">
            <a-tag color="blue">正常</a-tag>
          </template>
          <template v-else>
            <a-tag color="red">锁定</a-tag>
          </template>
        </template>
      </BasicTable>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicColumn, BasicTable, SorterResult, useTable } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    getAccountColumnsCfg,
    getSearchFormCfg,
    testDataList,
  } from '/@/views/rg/sys-settings/account-list/inner/account.data';
  import GzShowSearchFormBtn from '/@/components/GzShowSearchFormBtn';
  import { arrSortFn } from '/@/utils/arrayUtils';

  export default defineComponent({
    name: 'SysUsersListMg',
    components: {
      PageWrapper,
      BasicTable,
      BasicForm,
      GzShowSearchFormBtn,
    },
    setup() {
      //样式表当前页面根元素
      const prefixCls = useDesign('sys-users-mg');

      //#region table data =================================
      let tableDatas: any[] = [];
      let isSorting = false;
      //#endregion
      //#region table func =================================
      //拉取人员信息列表
      const loadUserFromServerApi = () => {
        return new Promise<any[]>((resolve) => {
          if (isSorting) {
            isSorting = false;
            resolve(tableDatas);
          } else {
            const list = testDataList;
            resolve(list);
          }
        });
      };
      //table fn 排序
      const tableSortFn = (sortInfo: SorterResult) => {
        console.log('tableSortFn', sortInfo);
        isSorting = true;
        const list = tableMethods.getDataSource().slice();
        const sortList = arrSortFn(list, sortInfo.field, sortInfo.order);
        // list.sort((a, b) => {
        //   if (sortInfo.order === 'ascend') {
        //     //升序
        //     return a[sortInfo.field] - b[sortInfo.field];
        //   } else {
        //     return b[sortInfo.field] - a[sortInfo.field];
        //   }
        // });
        tableDatas = sortList;
      };
      const tableColumnValueFormatFn = (record: any, column: BasicColumn) => {
        // if (column.dataIndex === 'status') {
        //   if (record.status * 1 === 0) {
        //     return '正常';
        //   } else {
        //     return '锁定';
        //   }
        // }
        return record[column.dataIndex!];
      };
      //#endregion
      //table 注册
      const [registerTableFn, tableMethods] = useTable({
        title: '用户列表',
        api: loadUserFromServerApi,

        showTableSetting: true,
        bordered: true,
        columns: getAccountColumnsCfg,
        canResize: true,
        pagination: false,
        showIndexColumn: false,
        sortFn: tableSortFn,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'colAction' },
        },
      });
      //#region form data =================================

      //#endregion
      //#region form func =================================

      const [formRegister, formMethods] = useForm({
        labelWidth: '80px',
        size: 'small',
        showAdvancedButton: true,
        schemas: getSearchFormCfg,
        actionColOptions: {
          span: 24,
        },
        advancedBtnEventFunc: () => {
          tableMethods.redoHeight();
        },
      });
      console.log(formMethods);
      // formMethods.resetFields();
      //#endregion
      //#region searchBtn =================================
      //是否使用search 组件
      const useSearchState = ref(false);
      //search btn event回调
      const useSearchBtnEventFn = (settingState: boolean) => {
        useSearchState.value = settingState;
        tableMethods.redoHeight();
      };
      //#endregion

      return {
        prefixCls,
        useSearchState,
        useSearchBtnEventFn,
        registerTableFn,
        formRegister,
        tableColumnValueFormatFn,
      };
    },
  });
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-sys-users-mg';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
  }
  .box-radius {
    border-radius: 5px;
  }
</style>
