<template>
  <div> <BasicTable @register="tableRegister" /> </div>
</template>

<script lang="ts" setup>
  import { BasicTable, useTable } from '/@/components/Table';
  import { getAssetsColumnsCfg } from '/@/views/rg/chart-boards/milestone-v2/inner/asset.data';

  const loadAssetDatasApi = () => {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  };
  const [tableRegister] = useTable({
    title: '里程碑详情',
    api: loadAssetDatasApi,
    showTableSetting: true,
    tableSetting: {
      redo: false,
      size: true,
      setting: true,
      fullScreen: true,
    },
    bordered: true,
    columns: getAssetsColumnsCfg,
    canResize: true,
    pagination: false,
    showIndexColumn: false,
  });
</script>
<script lang="ts">
  export default {
    name: 'AssetDetailTableView',
  };
</script>

<style scoped></style>
