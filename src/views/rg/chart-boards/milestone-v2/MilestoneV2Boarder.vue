<template>
  <div class="w-full h-full">
    <Card
      class="w-full h-full rg-antd-cart"
      title="里程碑V2-看板"
      size="small"
      :bodyStyle="cardBodyStyle"
    >
      <template #extra>
        <Space :size="5">
          <Button>个性化筛选1</Button>
          <Button>个性化筛选</Button>
          <Button>个性化筛选</Button>
          <Tooltip placement="top">
            <template #title>
              <span>条件筛选配置</span>
            </template>
            <Button size="small" @click="searchFilterBtnFn" shape="circle" type="primary">
              <template #icon>
                <Icon icon="carbon:filter-edit" />
              </template>
            </Button>
          </Tooltip>
          <Tooltip placement="top">
            <template #title>
              <span>刷新数据</span>
            </template>
            <Button size="small" @click="refreshBtnFn" shape="circle" type="primary">
              <template #icon>
                <Icon icon="icons8:refresh" />
              </template>
            </Button>
          </Tooltip>
        </Space>
      </template>
      <template #default>
        <div class="w-full h-full flex flex-col">
          <div class="pie-view w-full my-0 mx-0-auto max-h-400px min-h-250px">
            <bv-border-box name="border13" :background-color="getBackColorRef">
              <div class="bv-content-wrapper">
                <div class="bv-content">
                  <PieCharts ref="pieChartRef" />
                </div>
              </div>
            </bv-border-box>
          </div>
          <div class="w-full h-auto flex-grow flex-shrink flex-row flex">
            <div class="w-11/20 h-full">
              <bv-border-box name="border13" :background-color="getBackColorRef">
                <div class="bv-content-wrapper">
                  <div class="bv-content">
                    <MileStoneTableView ref="milestoneTableRef" />
                  </div>
                </div>
              </bv-border-box>
            </div>
            <div class="w-9/20 h-full">
              <bv-border-box name="border13" :background-color="getBackColorRef">
                <div class="bv-content-wrapper">
                  <div class="bv-content">
                    <AssetDetailTableView ref="assetDetailTableRef" />
                  </div>
                </div>
              </bv-border-box>
            </div>
          </div>
        </div>
      </template>
    </Card>
    <MilestoneFilterDrawer @register="drawerRegister" @reloadData="drawReloadEvent" />
  </div>
</template>

<script lang="ts" setup>
  import { Button, Card, Tooltip, Space } from 'ant-design-vue';

  import { onMounted, ref } from 'vue';
  import PieCharts from './inner/PieCharts.vue';
  import MileStoneTableView from './inner/MileStoneTableView.vue';
  import AssetDetailTableView from './inner/AssetDetailTableView.vue';

  import MilestoneFilterDrawer from '/@/views/rg/chart-boards/milestone-v2/inner/MilestoneFilterDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import Icon from '/@/components/Icon/src/Icon.vue';

  const cardBodyStyle = ref({
    // height: 'calc( 100% - 10px - 49px )',
    // // // width: 'calc(100% - 10px)',
    padding: '0px',
    'background-color': 'whitesmoke',
  });

  const getBackColorRef = ref('white');

  onMounted(() => {});

  const pieChartRef = ref<any>(null);
  const milestoneTableRef = ref<any>(null);
  const assetDetailTableRef = ref<any>(null);
  //#region topbar  =================================
  const searchFilterBtnFn = () => {
    drawerMethods.openDrawer(true, {});
  };
  const refreshBtnFn = () => {
    milestoneTableRef.value.reloadTableData();
  };
  //#endregion  -------------------------------------
  //#region drawer =================================
  const [drawerRegister, drawerMethods] = useDrawer();
  const drawReloadEvent = () => {
    refreshBtnFn();
  };
  //#endregion  -------------------------------------
</script>
<script lang="ts">
  export default {
    name: 'MilestoneV2Boarder',
  };
</script>

<style scoped>
  .pie-view {
    aspect-ratio: 5/2;
    box-sizing: border-box;
    //background: lime;
  }
  .table-view {
    background-color: yellow;
  }

  .bv-content-wrapper {
    padding: 15px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .bv-content {
    width: 100%;
    height: 100%;

    //background-color: white;
  }
</style>
