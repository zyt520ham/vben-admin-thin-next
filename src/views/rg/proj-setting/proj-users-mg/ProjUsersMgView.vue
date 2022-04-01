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
          <template #colCreated_at="{ record, column }">
            <span>{{ tableRowFormatFn(record, column) }}</span>
          </template>
          <template #colUpdated_at="{ record, column }">
            <span>{{ tableRowFormatFn(record, column) }}</span>
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
                  onClick: tableActionResetPsdFn.bind(null, record),
                },
                {
                  icon: 'carbon:user-role',
                  // color: 'error',
                  tooltip: '分配角色',
                  onClick: tableActionSettingRoleFn.bind(null, record),
                },

                {
                  icon: 'pepicons:leave',
                  color: 'error',
                  tooltip: '项目移出',
                  popConfirm: {
                    title: `是否移出用户【${record.nickname}】`,
                    confirm: tableActionLeaveProjsFn.bind(null, record),
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
      destroyOnClose
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
    <RoleSettingDrawer @register="registerDrawerFn" @success="roleSettingSuccessFn" />
    <UserResetPsdModal @register="registerResetPsdModalFn" />
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
  import { log, logNoTrace } from '/@/utils/log';
  import {
    addUsersFromProjApi,
    deleteUserFromProjApi,
    getProjUsersV1Api,
  } from '/@/api/sys/projectApi';
  import { IReqGetProjUser } from '/@/api/model/projectModel';
  import { IReqErr } from '/#/axios';
  import { useProjsStoreWithOut } from '/@/store/modules/projectsStore';
  import { IRoleInfo, IUserInfo } from '/#/store';
  import RoleSettingDrawer from './inner/RoleSettingDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import UserResetPsdModal from './inner/UserResetPsdModal.vue';
  import { formatToDate } from '/@/utils/dateUtil';
  import { message } from 'ant-design-vue';
  import { useUserStoreWithOut } from '/@/store/modules/user';

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
      RoleSettingDrawer,
      UserResetPsdModal,
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
        doRoleFilterTableListFn();
      };

      //#endregion
      //#region form =================================
      const resetFormEventFn = () =>
        new Promise<void>((resolve) => {
          let rowDataList = tableMethods.getRawDataSource();
          if (selectedItemKey.value) {
            rowDataList = rowDataList.filter((ele: IUserInfo) => {
              return ele.project_roles.includes(selectedItemKey.value);
            });
          }
          tableMethods.setTableData(rowDataList.slice());
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

          let rowDataList = tableMethods.getRawDataSource();
          if (selectedItemKey.value) {
            rowDataList = rowDataList.filter((ele: IUserInfo) => {
              return ele.project_roles.includes(selectedItemKey.value);
            });
          }
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
      const edittingInfo = ref<IUserInfo>({} as any);
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
        logNoTrace('loadUserFromServerApi');
        return new Promise<any[]>((resolve, reject) => {
          const params: IReqGetProjUser = { page: 1, page_size: 1000 };
          getProjUsersV1Api(params).then(
            (resp) => {
              setTimeout(() => {
                if (selectedItemKey.value) {
                  // debugger;
                  // 需要执行一次filter
                  doRoleFilterTableListFn();
                }
              }, 10);
              resolve(resp.list.slice());
            },
            (err: IReqErr) => {
              console.error('err', err);
              reject(err);
            },
          );
          // }
        });
      };
      /** 角色过滤 */
      const doRoleFilterTableListFn = () => {
        const tableList = tableMethods.getRawDataSource();
        const filterList = tableList.filter((ele) => {
          if (!selectedItemKey.value) {
            return true;
          }
          if (ele.project_roles.includes(selectedItemKey.value)) {
            return true;
          } else {
            return false;
          }
        });
        tableMethods.setTableData(filterList);
      };
      //table fn 排序
      const tableSortFn = (sortInfo: SorterResult) => {
        logNoTrace('tableSortFn', sortInfo);

        // rawDataSource = tableMethods.getRawDataSource().slice();
        //这里存在筛选的问题，不能直接要raw的数据
        const list: any[] = tableMethods.getDataSource().slice();
        const sortList = arrSortFn(list, sortInfo.field, sortInfo.order);
        tableMethods.setTableData(sortList);
      };
      const tableRowFormatFn = (record: any, column: BasicColumn) => {
        if (column.dataIndex === 'project_roles') {
          const keyList: string[] = record[column.dataIndex];
          const valueList: string[] = [];
          try {
            keyList.map((ele: string) => {
              const value = getProjRolesMapComputed.value[ele];
              if (value) {
                valueList.push(value.description);
              }
            });
            return valueList;
          } catch (e) {
            debugger;
          }
        } else if (column.dataIndex === 'updated_at' || column.dataIndex === 'created_at') {
          return formatToDate(record[column.dataIndex] * 1000);
        }
        return record[column.dataIndex!];
      };
      const tableActionResetPsdFn = (record) => {
        log('tableActionResetPsdFn', record);

        resetPsdModelMethods.openModal(true, record);
      };
      const tableActionSettingRoleFn = (record) => {
        edittingInfo.value = record as any;
        openDrawer(true, record);
      };
      const tableActionLeaveProjsFn = (record) => {
        log('tableActionleaveProjsFn', record);
        deleteUserFromProjApi({
          user_id: record.user_id,
        }).then(
          (resp) => {
            log(resp);
            tableMethods.deleteTableDataRecord(record.key);
          },
          (err: IReqErr) => {
            message.error(err.retMsg!);
          },
        );
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
        const list: IUserInfo[] = projUsersAddComp.value.projUsersAddCompGetSelectedUserList();
        console.log(list);
        const userIdList: string[] = [];
        list.map((ele) => {
          userIdList.push(ele.user_id + '');
        });
        addUsersModalMethods.setModalProps({
          loading: true,
        });
        addUsersFromProjApi({
          user_id: userIdList.join('##'),
          project_id: useUserStoreWithOut().getChooseProjectId!,
        }).then(
          (resp) => {
            console.log(resp);
            tableMethods.reload();
            addUsersModalMethods.setModalProps({
              loading: false,
            });
            addUsersModalMethods.closeModal();
          },
          (err: IReqErr) => {
            message.error(err.retMsg!);
          },
        );
      };

      const addUsersModalCancalBtnEventFn = () => {
        log('addUsersModalCancalBtnEventFn');
      };
      const [registerAddUsersModal, addUsersModalMethods] = useModal();
      const [registerDrawerFn, { openDrawer }] = useDrawer();
      // addUsersModalMethods.setModalProps({
      //   centered: true,
      //   useWrapper: true,
      // });
      const roleSettingSuccessFn = (editRecord) => {
        edittingInfo.value.project_roles = editRecord.value.project_roles;
      };

      const [registerResetPsdModalFn, resetPsdModelMethods] = useModal();
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
        registerDrawerFn,
        tableActionLeaveProjsFn,
        tableActionSettingRoleFn,
        tableActionResetPsdFn,
        edittingInfo,
        roleSettingSuccessFn,
        registerResetPsdModalFn,
      };
    },
  });
</script>

<style scoped></style>
