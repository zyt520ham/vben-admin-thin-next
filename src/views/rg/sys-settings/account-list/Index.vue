<template>
  <PageWrapper :class="`${prefixCls}`" dense content-class="flex space-x-5px p-5px">
    <div class="w-1/3 lg:w-1/5 xl:w-1/6 h-full">
      <a-card class="w-full rg-antd-cart" :bordered="true" hoverable>
        <span>123123</span>
      </a-card>
    </div>
    <div class="w-2/3 lg:w-4/5 xl:w-5/6 h-full space-y-5px">
      <a-card v-if="useSearchState" class="w-full rg-antd-cart">
        <a-input />
        <br />
        <a-input />
        <BasicForm />
      </a-card>
      <BasicTable @register="registerTableFn">
        <template #toolbar>
          <GzShowSearchFormBtn
            :prop-show-state="useSearchState"
            :prop-toggle-show-state="useSearchBtnEventFn"
          />
        </template>
      </BasicTable>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, SorterResult, useTable } from '/@/components/Table';
  import { BasicForm } from '/@/components/Form';
  import {
    getAccountColumnsCfg,
    testDataList,
  } from '/@/views/rg/sys-settings/account-list/account.data';
  import GzShowSearchFormBtn from '/@/components/GzShowSearchFormBtn';

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
      //是否使用search 组件
      const useSearchState = ref(false);
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
      let tableDatas: any[] = [];
      let isSorting = false;
      const tableSortFn = (sortInfo: SorterResult) => {
        console.log('tableSortFn', sortInfo);
        isSorting = true;
        const list = tableMethods.getDataSource().slice();
        list.sort((a, b) => {
          if (sortInfo.order === 'ascend') {
            //升序
            return a[sortInfo.field] - b[sortInfo.field];
          } else {
            return b[sortInfo.field] - a[sortInfo.field];
          }
        });
        tableDatas = list;
      };
      const [registerTableFn, tableMethods] = useTable({
        title: '用户列表',
        api: loadUserFromServerApi,
        rowKey: 'userId',
        showTableSetting: true,
        bordered: true,
        columns: getAccountColumnsCfg,
        canResize: true,
        pagination: false,
        sortFn: tableSortFn,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'colAction' },
        },
      });

      const useSearchBtnEventFn = (settingState: boolean) => {
        useSearchState.value = settingState;
        tableMethods.redoHeight();
      };
      return { prefixCls, useSearchState, useSearchBtnEventFn, registerTableFn };
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
