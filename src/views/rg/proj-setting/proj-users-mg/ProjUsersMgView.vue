<!--
 * @Description  : 项目人员列表管理页面
 * @Author       : zhangyantao
 * @Date         : 2022/2/25
 * @FilePath     : src/views/rg/proj-setting/ProjUsersMgView.vue
-->
<template>
  <PageWrapper dense :class="`${prefixCls}`" contentFullHeight>
    <div class="w-full h-full flex space-x-5px p-5px">
      <div class="w-1/3 lg:w-1/5 xl:w-1/6 h-full">
        <a-card class="w-full max-h-full rg-antd-cart overflow-auto" :bordered="true" hoverable>
          <RolesTreeComp
            @select="projsTreeSelectFn"
            :prop-replace-fields="{ key: 'role', title: 'description' }"
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
              <span class="font-bold">成员列表</span>
              <TableAction
                :divider="false"
                :actions="[
                  {
                    tooltip: {
                      title: '添加成员',
                      placement: 'top',
                    },
                    type: 'primary',
                    size: 'small',
                    shape: 'circle',
                    icon: 'akar-icons:person-add',
                    onClick: tableToolsAddUsersEventFn.bind(null),
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
          <template #colRoles="{ record, column }">
            <template v-for="role in tableRowFormatFn(record, column)" :key="role">
              <a-tag color="green">{{ role }}</a-tag>
            </template>
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
                  icon: 'codicon:key',
                  tooltip: '重置密码',
                },
                {
                  icon: 'carbon:user-role',
                  // color: 'error',
                  tooltip: '分配角色',
                },

                {
                  icon: 'pepicons:leave',
                  color: 'error',
                  tooltip: '项目移出',
                  popConfirm: {
                    title: `是否移出用户【${record.nickname}】`,
                    // confirm: tableRowHandleDeleteFn.bind(null, record),
                  },
                },
              ]"
            />
          </template>
        </BasicTable>
      </div>
    </div>

    <BasicModal
      v-bind="$attrs"
      @register="registerAddUsersModal"
      title="添加用户"
      width="700px"
      :useWrapper="false"
      @ok="addUsersModalOkBtnEventFn"
      @cancel="addUsersModalCancalBtnEventFn"
    >
      <template #default>
        <div class="w-full h-500px">
          <ProjectUsersAddComp ref="projUsersAddComp" />
        </div>
      </template>
    </BasicModal>
  </PageWrapper>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import {
    getUsersSearchFormCfg,
    getUsersTableColumnsCfg,
  } from '/@/views/rg/proj-setting/proj-users-mg/inner/projUsers.data';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicColumn,
    BasicTable,
    SorterResult,
    TableAction,
    useTable,
  } from '/@/components/Table';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PageWrapper } from '/@/components/Page';
  import RolesTreeComp from './inner/RolesTreeComp.vue';
  import GzShowSearchFormBtn from '/@/components/GzShowSearchFormBtn';
  import { arrSortFn } from '/@/utils/arrayUtils';
  import { BasicModal, useModal } from '/@/components/Modal';
  import ProjectUsersAddComp from './inner/ProjectUsersAddComp.vue';
  import { log } from '/@/utils/log';
  import { getProjUsersApi } from '/@/api/sys/projectApi';
  import { IReqProjIncludeUsers } from '/@/api/sys/model/projectModel';
  import { IReqErr } from '/#/axios';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { useProjsStoreWithOut } from '/@/store/modules/projectsStore';
  import { IRoleInfo, IUserInfo } from '/#/store';

  export default defineComponent({
    name: 'ProjUsersMgView',
    components: {
      PageWrapper,
      BasicTable,
      BasicForm,
      RolesTreeComp,
      GzShowSearchFormBtn,
      TableAction,
      ProjectUsersAddComp,
      BasicModal,
    },
    setup() {
      const { prefixCls } = useDesign('proj-users-mg');
      //#region tree =================================
      const projsTreeData = computed<IRoleInfo[]>(() => useProjsStoreWithOut().getCurrentProjRoles);
      const selectedItemKey = ref('');
      //树形选择回调
      const projsTreeSelectFn = (selectedKey) => {
        log(selectedKey);
        selectedItemKey.value = selectedKey;
        const filterList = tableDatas.filter((ele: IUserInfo) => {
          if (!selectedItemKey.value) {
            return true;
          } else {
            if (ele.project_roles.includes(selectedItemKey.value)) {
              return true;
            }
            return false;
          }
        });
        tableMethods.setTableData(filterList);
      };

      //#endregion
      //#region form =================================
      const resetFormEventFn = () =>
        new Promise<void>((resolve) => {
          tableMethods.setTableData(tableDatas.slice());
          resolve();
        });

      const searchFormEventFn = () => {
        return new Promise<void>((resolve) => {
          console.log('searchFormEventFn');
          const formData = formMethods.getFieldsValue();
          const searchItem: any = {};
          for (const formDataKey in formData) {
            if (formData[formDataKey]) {
              searchItem[formDataKey] = formData[formDataKey];
            }
          }
          const allSearchKeys = Object.keys(searchItem);
          debugger;
          const filterList = tableDatas.filter((ele) => {
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
            // allSearchKeys.forEach((key, index) => {
            //   log('foreach:', ele.account, key, index);
            //   if (index === 0) {
            //     if (ele[key].indexOf(formData[key]) >= 0) {
            //       oldSearchResult = true;
            //     } else {
            //       oldSearchResult = false;
            //     }
            //   } else {
            //     if (ele[key].indexOf(formData[key]) >= 0) {
            //       oldSearchResult = oldSearchResult && true;
            //     } else {
            //       oldSearchResult = oldSearchResult && false;
            //     }
            //   }
            // });
            if (oldSearchResult) {
              debugger;
            }
            return oldSearchResult;
          });
          tableMethods.setTableData(filterList);
          resolve();
        });
      };
      const [formRegister, formMethods] = useForm({
        labelWidth: '80px',
        size: 'small',
        showAdvancedButton: true,
        schemas: getUsersSearchFormCfg,
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
      //#region table data =================================
      let tableDatas: IUserInfo[] = [];
      let isSorting = false;
      //获取当前项目角色map
      const getProjRolesMapComputed = computed(() => {
        return useProjsStoreWithOut().getCurrentProjRoleMap;
      });
      //#endregion -----------------------------------------
      //#region table =================================
      const useSearchState = ref<boolean>(false);
      const useSearchBtnEventFn = (settingState: boolean) => {
        useSearchState.value = settingState;
        tableMethods.redoHeight();
      };
      const tableToolsAddUsersEventFn = () => {
        console.log('tableToolsAddUsersEventFn');
        addUsersModalMethods.openModal();
      };
      //拉取人员信息列表
      const loadUserFromServerApi = () => {
        return new Promise<any[]>((resolve, reject) => {
          if (isSorting) {
            isSorting = false;
            resolve(tableDatas);
          } else {
            const params: IReqProjIncludeUsers = {
              page: 1,
              page_size: 1000,
              project_id: useUserStoreWithOut().getLoginInfo?.project || '',
            };
            getProjUsersApi(params).then(
              (resp) => {
                const list = resp.list.filter((ele) => {
                  if (!selectedItemKey.value) {
                    return true;
                  }
                  if (ele.project_roles.includes(selectedItemKey.value)) {
                    return true;
                  } else {
                    return false;
                  }
                });
                tableDatas = resp.list.slice();
                resolve(list.slice());
              },
              (err: IReqErr) => {
                console.error('err', err);
                reject(err);
              },
            );
          }
        });
      };
      //table fn 排序
      const tableSortFn = (sortInfo: SorterResult) => {
        console.log('tableSortFn', sortInfo);
        isSorting = true;
        const list: any[] = tableMethods.getDataSource().slice();
        const sortList = arrSortFn(list, sortInfo.field, sortInfo.order);
        tableDatas = sortList;
      };
      const tableRowFormatFn = (record: any, column: BasicColumn) => {
        if (column.dataIndex === 'project_roles') {
          const keyList: string[] = record[column.dataIndex];
          const valueList: string[] = [];
          keyList.map((ele: string) => {
            const value = getProjRolesMapComputed.value[ele];
            if (value) {
              valueList.push(value.description);
            }
          });
          return valueList;
        }
        return record[column.dataIndex!];
      };

      const [registerTableFn, tableMethods] = useTable({
        title: '用户列表',
        api: loadUserFromServerApi,
        showTableSetting: true,
        bordered: true,
        columns: getUsersTableColumnsCfg,
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
      //#endregion

      //#region modal =================================
      const projUsersAddComp = ref<any>(null);
      const addUsersModalOkBtnEventFn = () => {
        log('addUsersModalOkBtnEventFn');
        const list = projUsersAddComp.value.projUsersAddCompGetSelectedUserList();
        console.log(list);
        addUsersModalMethods.closeModal();
      };

      const addUsersModalCancalBtnEventFn = () => {
        log('addUsersModalCancalBtnEventFn');
      };
      const [registerAddUsersModal, addUsersModalMethods] = useModal();
      // addUsersModalMethods.setModalProps({
      //   centered: true,
      //   useWrapper: true,
      // });
      //#endregion
      return {
        prefixCls,
        projsTreeData,
        projsTreeSelectFn,
        useSearchState,
        formRegister,
        registerTableFn,
        useSearchBtnEventFn,
        registerAddUsersModal,
        tableToolsAddUsersEventFn,
        addUsersModalOkBtnEventFn,
        addUsersModalCancalBtnEventFn,
        projUsersAddComp,
        getProjRolesMapComputed,
        tableRowFormatFn,
      };
    },
  });
</script>

<style scoped></style>
