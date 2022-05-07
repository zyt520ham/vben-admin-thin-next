<template>
  <div>
    <BasicTable @register="registerTableFn">
      <!--      <template #tableTitle>-->
      <!--        <span class="flex space-x-3">-->
      <!--          <span class="font-bold">里程碑V2版本</span>-->
      <!--        </span>-->
      <!--      </template>-->
      <template #toolbar>
        <!--        <GzShowSearchFormBtn-->
        <!--          :prop-show-state="useSearchState"-->
        <!--          :prop-toggle-show-state="useSearchBtnEventFn"-->
        <!--        />-->
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
</template>

<script lang="ts" setup>
  import { BasicTable, useTable } from '/@/components/Table';
  import { getMileStoneColumnsCfg } from '/@/views/rg/chart-boards/milestone-v2/inner/data/milestone.data';
  import { getMileStones } from '/@/views/rg/chart-boards/milestone-v2/inner/MileStoneRequest';

  const loadMileStoneDatasApi = () => {
    return new Promise((resolve, reject) => {
      getMileStones()
        .then((resp) => {
          resolve(resp);
        })
        .catch((err: Error) => {
          console.error('getMileStones err', err);
        });
    });
  };
  const [registerTableFn, tableMethods] = useTable({
    title: '里程碑V2版本',
    inset: false,
    api: loadMileStoneDatasApi,
    showTableSetting: true,
    tableSetting: {
      redo: false,
      size: true,
      setting: true,
      fullScreen: true,
    },
    bordered: true,
    columns: getMileStoneColumnsCfg,
    canResize: true,
    pagination: false,
    showIndexColumn: false,
  });
  const reloadTableData = () => {
    tableMethods.reload();
  };
  defineExpose({
    reloadTableData,
  });
</script>
<script lang="ts">
  export default {
    name: 'MileStoneTableView',
  };
</script>

<style scoped></style>
