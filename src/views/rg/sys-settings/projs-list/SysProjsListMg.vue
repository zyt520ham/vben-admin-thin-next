<template>
  <PageWrapper dense contentFullHeight :class="`${prefixCls}`">
    <div class="w-full h-full space-y-5px">
      <a-card v-if="useSearchState" class="w-full rg-antd-cart" hoverable>
        <BasicForm @register="formRegisterFn" />
      </a-card>
      <BasicTable @register="registerTableFn">
        <template #tableTitle>
          <span class="flex space-x-3">
            <span class="font-bold">项目列表</span>
            <TableAction
              :divider="false"
              :actions="[
                {
                  tooltip: {
                    title: '新建项目',
                    placement: 'top',
                  },
                  type: 'primary',
                  size: 'small',
                  shape: 'circle',
                  icon: 'bx:comment-add',
                  onClick: addBtnClickFn.bind(null),
                },
              ]"
            />
          </span>
        </template>
        <template #toolbar>
          <GzShowSearchFormBtn
            :prop-show-state="useSearchState"
            :prop-toggle-show-state="useSearchBtnEventFn"
          />
        </template>
        <template #colAction="{ record }">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: tableHandleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: tableHandleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </BasicTable>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, SorterResult, TableAction, useTable } from '/@/components/Table';
  import {
    getProjsColumnsCfg,
    getSearchFormCfg,
  } from '/@/views/rg/sys-settings/projs-list/inner/projs.data';
  import { arrSortFn } from '/@/utils/arrayUtils';
  import GzShowSearchFormBtn from '/@/components/GzShowSearchFormBtn';
  import { log } from '/@/utils/log';
  import { useProjsStoreWithOut } from '/@/store/modules/projectsStore';

  export default defineComponent({
    name: 'SysProjsListMg',
    components: {
      PageWrapper,
      BasicTable,
      GzShowSearchFormBtn,
      BasicForm,
      TableAction,
    },
    setup() {
      //样式表当前页面根元素
      const { prefixCls } = useDesign('sys-projs-mg');
      //#region form =================================

      const [formRegisterFn] = useForm({
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
        resetButtonOptions: {
          size: 'small',
        },
        submitButtonOptions: {
          size: 'small',
        },
      });
      //#endregion ----------------------------------
      //#region table data =================================
      const useSearchState = ref<boolean>(false);
      let tableDatas: any[] = [];
      let isSorting = false;
      //#endregion -----------------------------------------
      //#region table =================================
      const getProjectsListApi = () => {
        return new Promise<any[]>((resolve, reject) => {
          if (true) {
            if (isSorting) {
              isSorting = false;
              resolve(tableDatas);
            } else {
              const list = useProjsStoreWithOut().getAllProjs;
              resolve(list);
            }
          } else {
            reject(new Error(''));
          }
        });
      };
      const tableSortFn = (sortInfo: SorterResult) => {
        log('tableSortFn', sortInfo);
        isSorting = true;
        const list = tableMethods.getDataSource().slice();
        const sortList = arrSortFn(list, sortInfo.field, sortInfo.order);
        tableDatas = sortList;
      };
      const useSearchBtnEventFn = () => {
        useSearchState.value = !useSearchState.value;
        tableMethods.redoHeight();
      };
      const addBtnClickFn = () => {};

      const tableHandleEdit = (record: any) => {
        log('tableHandleEdit', record);
      };
      const tableHandleDelete = (record: any) => {
        log('tableHandleDelete', record);
      };
      const [registerTableFn, tableMethods] = useTable({
        title: '用户列表',
        api: getProjectsListApi,
        showTableSetting: true,
        bordered: true,
        columns: getProjsColumnsCfg,
        canResize: true,
        pagination: false,
        showIndexColumn: false,
        sortFn: tableSortFn,
        actionColumn: {
          width: '160px',
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          slots: { customRender: 'colAction' },
        },
      });
      //#endregion ----------------------------------
      return {
        prefixCls,
        useSearchState,
        formRegisterFn,
        registerTableFn,
        useSearchBtnEventFn,
        addBtnClickFn,
        tableHandleEdit,
        tableHandleDelete,
      };
    },
  });
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-sys-users-mg';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
  }
</style>
