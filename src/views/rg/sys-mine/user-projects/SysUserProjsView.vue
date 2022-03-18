<!--
 * @Description  : 用户拥有项目列表
 * @Author       : zhangyantao
 * @Date         : 2022/2/25
 * @FilePath     : src/views/rg/sys-mine/SysUserProjsView.vue
-->
<template>
  <PageWrapper dense contentFullHeight :class="`${prefixCls}`">
    <div class="w-full h-full space-y-5px">
      <!--      <a-card v-if="useSearchState" class="w-full rg-antd-cart" hoverable>-->
      <!--        <BasicForm @register="formRegisterFn" />-->
      <!--      </a-card>-->
      <BasicTable @register="registerTableFn">
        <template #tableTitle>
          <span class="flex space-x-3">
            <span class="font-bold">项目列表</span>
          </span>
        </template>
        <template #toolbar>
          <!--          <GzShowSearchFormBtn-->
          <!--            :prop-show-state="useSearchState"-->
          <!--            :prop-toggle-show-state="useSearchBtnEventFn"-->
          <!--          />-->
        </template>
        <template #colCreateTime="{ record, column }">
          <span>{{ tableRowFormatFn(record, column) }}</span>
        </template>
        <template #colAction="{ record }">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                // onClick: tableHandleEdit.bind(null, record),
                tooltip: '编辑',
              },
              {
                icon: 'icon-park-outline:lock',
                color: 'error',
                ifShow: record.state === 0,
                tooltip: '锁定项目',
                popConfirm: {
                  title: '是否锁定项目',
                  // confirm: tableHandleLockFn.bind(null, record),
                },
              },
              {
                icon: 'mdi:lock-open-variant-outline',
                // color: 'error',
                ifShow: record.state !== 0,
                tooltip: '解锁项目',
                popConfirm: {
                  title: '是否解锁项目',
                  // confirm: tableHandleUnlockFn.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </BasicTable>
    </div> </PageWrapper
></template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, SorterResult, TableAction, useTable } from '/@/components/Table';
  import { getProjsColumnsCfg } from '/@/views/rg/sys-settings/projs-list/inner/projs.data';
  import { log } from '/@/utils/log';
  import { arrSortFn } from '/@/utils/arrayUtils';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useProjsStoreWithOut } from '/@/store/modules/projectsStore';

  export default defineComponent({
    name: 'SysUserProjsView',
    components: {
      BasicTable,
      TableAction,
    },
    setup() {
      const { prefixCls } = useDesign('sys-user-projs');

      const tableRowFormatFn = (record, column) => {
        return record[column.dataIndex];
      };
      const tableSortFn = (sortInfo: SorterResult) => {
        log('tableSortFn', sortInfo);
        const list = tableMethods.getRawDataSource().slice();
        const sortList = arrSortFn(list, sortInfo.field, sortInfo.order);
        tableMethods.setTableData(sortList);
      };
      const getMyProjsApi = () => {
        return new Promise((resolve) => {
          const list = useProjsStoreWithOut().getMyProjects;
          resolve(list);
        });
      };
      const [registerTableFn, tableMethods] = useTable({
        title: '用户列表',
        api: getMyProjsApi,
        showTableSetting: true,
        bordered: true,
        columns: getProjsColumnsCfg,
        canResize: true,
        pagination: false,
        showIndexColumn: false,
        sortFn: tableSortFn,
        // actionColumn: {
        //   width: '160px',
        //   title: '操作',
        //   fixed: 'right',
        //   dataIndex: 'action',
        //   slots: { customRender: 'colAction' },
        // },
      });
      return {
        prefixCls,
        registerTableFn,
        tableRowFormatFn,
      };
    },
  });
</script>

<style scoped></style>
