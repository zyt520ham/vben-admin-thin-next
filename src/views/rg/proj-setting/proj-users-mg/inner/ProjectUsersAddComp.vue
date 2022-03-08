<template>
  <div class="flex flex-nowrap w-full h-full overflow-hidden">
    <div class="w-1/3 h-full">
      <GZSelectList
        ref="addUsersCheckComp"
        :prop_choose-list="optionsUsersData"
        :prop_replaceFields="{
          title: 'nickname',
          content: 'account',
        }"
        @selectedIdsFn="selectedIdsEventFn"
      />
    </div>
    <div class="w-2/3 h-full bg-green-300 flex flex-col flex-nowrap">
      <h3 class="flex-none text-center m-0 px-0 py-5px">已选择成员</h3>
      <div class="flex-shrink flex-grow overflow-y-hidden">
        <div class="x-full h-full">
          <BasicTable class="h-full" @register="registerTable">
            <template #colUserId="{ record, column }">
              <a-tag>{{ record[column.dataIndex] }}</a-tag>
            </template>
            <template #colAction="{ record }">
              <TableAction
                :actions="[
                  {
                    icon: 'ant-design:delete-outlined',
                    tooltip: '删除选中用户',
                    onclick: tableOnDeleteActionEventFn.bind(null, record),
                  },
                ]"
              />
            </template>
          </BasicTable>
        </div>
      </div>
    </div>
    <!--    <BasicTable @register="registerTable" />-->
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import GZSelectList from '/@/components/gz/RGSelectList/GZSelectList.vue';
  import { BasicTable, SorterResult, TableAction, useTable } from '/@/components/Table';
  import { getAddUserTableColumnsCfg, testAddsUsersList } from './projUsers.data';
  import { log } from '/@/utils/log';
  import { arrSortFn } from '/@/utils/arrayUtils';

  export default defineComponent({
    name: 'ProjectUsersAddComp',
    components: {
      GZSelectList,
      BasicTable,
      TableAction,
    },
    setup() {
      const addUsersCheckComp = ref(null);
      const optionsUsersData = ref<any[]>([]);
      const checkedUsersList = ref<any[]>([]);
      for (let i = 0; i < 30; i++) {
        optionsUsersData.value.push({
          user_id: i + '',
          account: i + '',
          nickname: '' + i,
        });
      }
      const selectedItemsEventFn = (checkedList: any[]) => {
        log('selectedItemsEventFn', checkedList);
        checkedUsersList.value = checkedList.slice();
        tableMethods.redoHeight();
        tableMethods.setTableData(checkedUsersList.value);
      };
      const selectedIdsEventFn = (idsList: string[]) => {
        log('selectedIdsEventFn', idsList);
        const checkedList = (addUsersCheckComp.value as any).checkCompGetModelList(idsList);
        log('selectedIdsEventFn', checkedList);
        const usersList = checkedList.map((ele) => {
          return {
            ...ele.oriObj,
            selectedId: ele.id,
          };
        });
        checkedUsersList.value = usersList;
        tableMethods.setTableData(checkedUsersList.value);
      };
      onMounted(() => {
        //TODO::加载数据源改造
        optionsUsersData.value = testAddsUsersList;
      });
      watch(
        optionsUsersData.value,
        () => {
          setTimeout(() => {
            tableMethods.redoHeight();
          }, 10);
        },
        { immediate: true, deep: true },
      );
      const tableOnDeleteActionEventFn = (record) => {
        log('tableOnDeleteActionEventFn', record);
        if (record) {
          (addUsersCheckComp.value as any).selectCompUncheckedById(record.selectedId);
        }
      };
      const tableSortFn = (sortInfo: SorterResult) => {
        console.log('tableSortFn', sortInfo);
        // isSorting = true;
        const list = tableMethods.getDataSource();
        const sortList = arrSortFn(list, sortInfo.field, sortInfo.order);
        tableMethods.setTableData(sortList);
        // tableDatas = sortList;
      };
      const [registerTable, tableMethods] = useTable({
        title: '添加的用户列表',
        // api: null,
        dataSource: checkedUsersList.value,
        showTableSetting: true,
        tableSetting: {
          redo: false,
          size: true,
          setting: true,
          fullScreen: false,
        },
        bordered: true,
        columns: getAddUserTableColumnsCfg,
        canResize: true,
        pagination: false,
        showIndexColumn: true,
        sortFn: tableSortFn,
        actionColumn: {
          width: '50px',
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          slots: { customRender: 'colAction' },
        },
      });
      return {
        addUsersCheckComp,
        optionsUsersData,
        registerTable,
        checkedUsersList,
        selectedItemsEventFn,
        tableOnDeleteActionEventFn,
        selectedIdsEventFn,
      };
    },
  });
</script>

<style scoped></style>
