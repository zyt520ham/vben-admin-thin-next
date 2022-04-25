<template>
  <div class="w-full h-full">
    <Card class="w-full h-full" title="里程碑V2-看板" size="small" :bodyStyle="cardBodyStyle">
      <template #extra>
        <Button>个性化筛选</Button>
        <Button>个性化筛选</Button>
        <Button>个性化筛选</Button>
        <Button>个性化筛选</Button>
      </template>
      <template #default>
        <div class="w-full h-full flex flex-col">
          <div class="pie-view w-full lg:w-992px xl:w-992px 2xl:w-992px my-0 mx-0-auto">
            <PieCharts />
          </div>
          <div class="">222</div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { Button, Card } from 'ant-design-vue';
  import { ref } from 'vue';
  import PieCharts from './inner/PieCharts.vue';

  const cardBodyStyle = ref({
    height: 'calc( 100% - 10px - 49px )',
    // width: 'calc(100% - 10px)',
    padding: '5px',
  });
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
</style>
