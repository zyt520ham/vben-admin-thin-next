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
        <template #colCreateTime="{ record, column }">
          <span>{{ tableRowFormatFn(record, column) }}</span>
        </template>
        <template #colAction="{ record }">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: tableHandleEdit.bind(null, record),
                tooltip: '编辑',
              },
              {
                icon: 'icon-park-outline:lock',
                color: 'error',
                ifShow: record.state === 0,
                tooltip: '锁定项目',
                popConfirm: {
                  title: '是否锁定项目',
                  confirm: tableHandleLockFn.bind(null, record),
                },
              },
              {
                icon: 'mdi:lock-open-variant-outline',
                // color: 'error',
                ifShow: record.state !== 0,
                tooltip: '解锁项目',
                popConfirm: {
                  title: '是否解锁项目',
                  confirm: tableHandleUnlockFn.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </BasicTable>
    </div>
    <EditProjDrawerComp
      @register="editProjDrawerRegister"
      @update_Proj_list="editDrawUpdateProjListFn"
    />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicColumn,
    BasicTable,
    SorterResult,
    TableAction,
    useTable,
  } from '/@/components/Table';
  import {
    editProjFormColEnum,
    getProjsColumnsCfg,
    getSearchFormCfg,
  } from '/@/views/rg/sys-settings/projs-list/inner/projs.data';
  import { arrSortFn } from '/@/utils/arrayUtils';
  import GzShowSearchFormBtn from '/@/components/GzShowSearchFormBtn';
  import { log, logNoTrace } from '/@/utils/log';
  import { useProjsStoreWithOut } from '/@/store/modules/projectsStore';
  import { formatToDate } from '/@/utils/dateUtil';
  import EditProjDrawerComp from '/@/views/rg/sys-settings/projs-list/inner/EditProjDrawerComp.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { IReqUpdateProjState } from '/@/api/model/projectModel';
  import { updateProjStateApi } from '/@/api/sys/projectApi';
  import { IReqErr } from '/#/axios';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'SysProjsListMg',
    components: {
      PageWrapper,
      BasicTable,
      GzShowSearchFormBtn,
      BasicForm,
      TableAction,
      EditProjDrawerComp,
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
              let list = useProjsStoreWithOut().getAllProjs;

              resolve(list);
            }
          } else {
            reject(new Error(''));
          }
        });
      };
      const tableSortFn = (sortInfo: SorterResult) => {
        log('tableSortFn', sortInfo);
        const list = tableMethods.getRawDataSource().slice();
        const sortList = arrSortFn(list, sortInfo.field, sortInfo.order);
        tableMethods.setTableData(sortList);
        // tableDatas = sortList;
      };
      const useSearchBtnEventFn = () => {
        useSearchState.value = !useSearchState.value;
        tableMethods.redoHeight();
      };
      const addBtnClickFn = () => {};

      const tableHandleEdit = (record: any) => {
        log('tableHandleEdit', record);
        editDrawerMethods.openDrawer(true, record);
      };

      const tableHandleLockFn = (record: any) => {
        const updateRecord: IReqUpdateProjState = {
          [editProjFormColEnum.kProjId]: record[editProjFormColEnum.kProjId],
          [editProjFormColEnum.kProjStatus]: 1,
        };
        updateProjStateApi(updateRecord).then(
          (resp) => {
            logNoTrace('', resp);
            record[editProjFormColEnum.kProjStatus] = 1;
            useProjsStoreWithOut().doSomethingConcurrent();
          },
          (err: IReqErr) => {
            message.error(err.retMsg!);
          },
        );
        log('tableHandleLockFn', record);
      };
      const tableHandleUnlockFn = (record: any) => {
        log('tableHandleUnlockFn', record);
        const updateRecord: IReqUpdateProjState = {
          [editProjFormColEnum.kProjId]: record[editProjFormColEnum.kProjId],
          [editProjFormColEnum.kProjStatus]: 0,
        };
        updateProjStateApi(updateRecord).then(
          (resp) => {
            logNoTrace('', resp);
            record[editProjFormColEnum.kProjStatus] = 0;
            useProjsStoreWithOut().doSomethingConcurrent();
          },
          (err: IReqErr) => {
            message.error(err.retMsg!);
          },
        );
      };
      const tableRowFormatFn = (record: any, column: BasicColumn) => {
        if (column.dataIndex === 'created_at') {
          return formatToDate(record[column.dataIndex] * 1000);
        }
        return record[column.dataIndex || ''];
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

      //#region drawer ========================================
      const [editProjDrawerRegister, editDrawerMethods] = useDrawer();
      const editDrawUpdateProjListFn = () => {
        tableMethods.reload();
      };
      //#endregion ---------------------------------------------
      return {
        prefixCls,
        useSearchState,
        formRegisterFn,
        registerTableFn,
        useSearchBtnEventFn,
        addBtnClickFn,
        tableHandleEdit,
        tableRowFormatFn,
        tableHandleLockFn,
        tableHandleUnlockFn,
        editProjDrawerRegister,
        editDrawUpdateProjListFn,
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
