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
            <Button @click="searchFilterBtnFn" shape="circle" type="primary">
              <template #icon>
                <Icon icon="carbon:filter-edit" />
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
                  <PieCharts />
                </div>
              </div>
            </bv-border-box>
          </div>
          <div class="w-full h-auto flex-grow flex-shrink flex-row flex">
            <div class="w-11/20 h-full">
              <bv-border-box name="border13" :background-color="getBackColorRef">
                <div class="bv-content-wrapper">
                  <div class="bv-content">
                    <MileStoneTableView />
                  </div>
                </div>
              </bv-border-box>
            </div>
            <div class="w-9/20 h-full">
              <bv-border-box name="border13" :background-color="getBackColorRef">
                <div class="bv-content-wrapper">
                  <div class="bv-content">
                    <AssetDetailTableView />
                  </div>
                </div>
              </bv-border-box>
            </div>
          </div>
        </div>
      </template>
    </Card>
    <MilestoneFilterDrawer @register="drawerRegister" />
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
  //#region topbar  =================================
  const searchFilterBtnFn = () => {
    drawerMethods.openDrawer(true, {});
  };
  //#endregion  -------------------------------------
  //#region drawer =================================
  const [drawerRegister, drawerMethods] = useDrawer();
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
