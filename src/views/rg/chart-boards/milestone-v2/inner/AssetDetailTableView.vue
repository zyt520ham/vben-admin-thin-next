<template>
  <div> <BasicTable @register="tableRegister" /> </div>
</template>

<script lang="ts" setup>
  import { BasicTable, useTable } from '/@/components/Table';
  import { getAssetsColumnsCfg } from '/@/views/rg/chart-boards/milestone-v2/inner/data/asset.data';
  import { getAssetsList } from '/@/views/rg/chart-boards/milestone-v2/inner/MileStoneRequest';

  const loadAssetDatasApi = () => {
    return new Promise((resolve, reject) => {
      getAssetsList()
        .then((resp) => {
          console.log(resp);
          resolve(resp);
        })
        .catch((err: Error) => {
          reject(null);
        });
    });
  };
  const [tableRegister] = useTable({
    title: '素材详情表',
    inset: false,
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
