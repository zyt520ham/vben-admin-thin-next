<template>
  <PageWrapper dense :class="`${prefixCls}`" contentFullHeight>
    <div class="w-full h-full flex space-x-5px p-5px">
      <div class="w-1/3 lg:w-1/5 xl:w-1/6 h-full">
        <a-card class="w-full max-h-full rg-antd-cart overflow-auto" :bordered="true" hoverable>
          <ProjectsTreeComp
            @select="projsTreeSelectFn"
            :prop-replace-fields="{ key: 'project_id', title: 'project_name' }"
            :prop-tree-data="projsTreeData"
          />
        </a-card>
      </div>
      <div class="w-2/3 lg:w-4/5 xl:w-5/6 h-full space-y-5px">
        <a-card v-if="useSearchState" class="w-full rg-antd-cart" hoverable>
          <BasicForm @register="formRegister" />
        </a-card>
        <BasicTable @register="registerTableFn">
          <template #tableTitle>
            <span class="flex space-x-3">
              <span class="font-bold">用户列表</span>
              <TableAction
                :divider="false"
                :actions="[
                  {
                    tooltip: {
                      title: '新增用户',
                      placement: 'top',
                    },
                    type: 'primary',
                    size: 'small',
                    shape: 'circle',
                    icon: 'ant-design:user-add-outlined',
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
          <template #colAction="{ record }">
            <TableAction
              :actions="[
                {
                  icon: 'clarity:note-edit-line',
                  tooltip: '编辑用户资料',
                  ifShow: () => {
                    return true;
                  },
                },
                {
                  icon: 'codicon:key',
                  tooltip: '重置密码',
                },
                {
                  icon: 'la:user-lock',
                  // color: 'error',
                  tooltip: '锁定当前用户',
                  popConfirm: {
                    title: `是否锁定用户【${record.nickname}】`,
                    confirm: tableRowHandleDeleteFn.bind(null, record),
                  },
                  ifShow: () => {
                    if (record.status === 0) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                },
                {
                  icon: 'clarity:unlock-line',
                  // color: 'error',
                  tooltip: '解锁当前用户',
                  popConfirm: {
                    title: `是否解锁用户【${record.nickname}】`,
                    confirm: tableRowHandleDeleteFn.bind(null, record),
                  },
                  ifShow: () => {
                    if (record.status !== 0) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                },

                {
                  icon: 'ant-design:delete-outlined',
                  color: 'error',
                  tooltip: '删除当前用户',
                  popConfirm: {
                    title: `是否删除用户【${record.nickname}】`,
                    confirm: tableRowHandleDeleteFn.bind(null, record),
                  },
                },
              ]"
            />
          </template>
        </BasicTable>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    BasicColumn,
    BasicTable,
    SorterResult,
    TableAction,
    useTable,
  } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    getAccountColumnsCfg,
    getProjsList,
    getSearchFormCfg,
    testDataList,
  } from '/@/views/rg/sys-settings/account-list/inner/account.data';
  import GzShowSearchFormBtn from '/@/components/GzShowSearchFormBtn';
  import { arrSortFn } from '/@/utils/arrayUtils';
  import { log } from '/@/utils/log';
  import ProjectsTreeComp from '/@/views/rg/sys-settings/account-list/inner/ProjectsTreeComp.vue';

  export default defineComponent({
    name: 'SysUsersListMg',
    components: {
      PageWrapper,
      BasicTable,
      BasicForm,
      GzShowSearchFormBtn,
      TableAction,
      ProjectsTreeComp,
    },
    setup() {
      //样式表当前页面根元素
      const { prefixCls } = useDesign('sys-users-mg');
      //#region life circle =================================
      // onMounted(() => {
      //   tableMethods.redoHeight();
      // });
      //#endregion ----------------------------------------
      //#region table data =================================
      let tableDatas: any[] = [];
      let isSorting = false;
      //#endregion -----------------------------------------
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
      //添加人员按钮实现
      const addBtnClickFn = () => {
        log('addBtnClickFn');
      };
      const tableRowHandleDeleteFn = (record) => {
        log('tableRowHandleDelete', record);
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
          width: '160px',
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          slots: { customRender: 'colAction' },
        },
      });
      //#region form data =================================

      //#endregion -----------------------------------------
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
        resetButtonOptions: {
          size: 'small',
        },
        submitButtonOptions: {
          size: 'small',
        },
      });
      console.log(formMethods);
      // formMethods.resetFields();
      //#endregion --------------------------------
      //#region searchBtn =================================
      //是否使用search 组件
      const useSearchState = ref(false);
      //search btn event回调
      const useSearchBtnEventFn = (settingState: boolean) => {
        useSearchState.value = settingState;
        tableMethods.redoHeight();
      };
      //#endregion --------------------------------------
      //#region projsTreeData =================================
      const projsTreeData = ref(getProjsList);
      const projsTreeSelectFn = (selectedKey: string) => {
        log('projsTreeSelectFn', selectedKey);
      };
      //#endregion

      return {
        prefixCls,
        useSearchState,
        useSearchBtnEventFn,
        registerTableFn,
        formRegister,
        tableColumnValueFormatFn,
        addBtnClickFn,
        tableRowHandleDeleteFn,
        projsTreeData,
        projsTreeSelectFn,
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
