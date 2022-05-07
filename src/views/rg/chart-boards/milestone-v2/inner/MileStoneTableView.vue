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
  import {
    getMileStoneColumnsCfg,
    MilestoneColumnsKeyEnum,
  } from '/@/views/rg/chart-boards/milestone-v2/inner/data/milestone.data';
  import { getMileStones } from '/@/views/rg/chart-boards/milestone-v2/inner/MileStoneRequest';
  import { stringFormatRounder } from '/@/utils/stringUtils';

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
  const handleSummaryFn = (tableData: Recordable[]): any[] => {
    const totalCost = tableData.reduce((prev, next) => {
      prev += next[MilestoneColumnsKeyEnum.kTargetCost];
      return prev;
    }, 0);
    console.log('合计达标花费', totalCost);
    return [
      {
        _row: '合计',
        // _index: '达标花费',
        [MilestoneColumnsKeyEnum.kTargetUsd]: stringFormatRounder(totalCost + '', 2),
        [MilestoneColumnsKeyEnum.kStartDay]: '达标花费合计',
        // [MilestoneColumnsKeyEnum.kEndDay]: '',
        // [MilestoneColumnsKeyEnum.kStepDay]: '',
        // [MilestoneColumnsKeyEnum.kStepEndDay]: '',
        // [MilestoneColumnsKeyEnum.kAppPackageGroup]: '',
        // [MilestoneColumnsKeyEnum.kAppPackagePf]: '',
        // [MilestoneColumnsKeyEnum.kAppPackageSys]: '',
        // [MilestoneColumnsKeyEnum.kCountryGroup]: '',
        // [MilestoneColumnsKeyEnum.kMediaSourceGroup]: '',
        // [MilestoneColumnsKeyEnum.kTargetCost]: '',
      },
    ];
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
    showSummary: true,
    resizeHeightOffset: 50,
    summaryFunc: handleSummaryFn,
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
