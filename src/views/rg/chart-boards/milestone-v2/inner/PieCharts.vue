<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, Ref } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { EChartsOption } from 'echarts';
  import {
    getAllCost,
    getAssetRatioData,
    getIdeasRatioDate,
    getMakesRatioDate,
  } from '/@/views/rg/chart-boards/milestone-v2/inner/MileStoneRequest';
  import { message } from 'ant-design-vue';
  import { assetTableColumnsKey } from '/@/views/rg/chart-boards/milestone-v2/inner/data/asset.data';
  import { stringFormatRounder } from '/@/utils/stringUtils';

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions, getInstance } = useECharts(chartRef as Ref<HTMLDivElement>);

  const eChartsOptionObj: EChartsOption = {
    title: [
      {
        subtext: '素材花费占比(非全部)',
        left: '0',
        top: '-10',
        textAlign: 'left',
        subtextStyle: {
          fontWeight: 'bolder',
          fontSize: 16,
        },
      },
      {
        subtext: '创意人花费占比',
        left: '45%',
        top: '-10',
        textAlign: 'left',
        subtextStyle: {
          fontWeight: 'bolder',
          fontSize: 16,
        },
      },
      {
        subtext: '制作人花费占比',
        left: '75%',
        top: '-10',
        textAlign: 'left',
        subtextStyle: {
          fontWeight: 'bolder',
          fontSize: 16,
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      show: true,
    },
    series: [
      {
        type: 'pie',
        radius: '90%',
        center: ['50%', '55%'],
        // dimensions: Object.keys(data),
        roseType: undefined,
        data: [],
        label: {
          position: 'inside',
          alignTo: 'none',
          bleedMargin: 5,
          formatter: '{b}: {d}%',
          rotate: true,
        },
        tooltip: {
          formatter: (params: any) => {
            console.log(params);
            const showString = `
             <div style="color:${params.color}">
              <b >${params.name}</b>
              <div style="margin-left:4px">花费:&nbsp&nbsp${stringFormatRounder(
                params.data.cost,
                2,
                false,
              )}</div>
              <div style="margin-left:4px">总花费占比:&nbsp&nbsp${stringFormatRounder(
                params.data.cost_ratio,
                2,
                true,
              )}</div>
             </div>
            `;
            return showString;
          },
        },
        left: 0,
        right: '60%',
        top: 0,
        bottom: 0,
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
      {
        type: 'pie',
        radius: '90%',
        center: ['50%', '55%'],
        data: [],
        label: {
          position: 'inside',
          alignTo: 'none',
          bleedMargin: 5,
          formatter: '{b}: {d}%',
          rotate: true,
        },
        left: '40%',
        right: '30%',
        top: 0,
        bottom: 0,
        tooltip: {
          formatter: (params: any) => {
            console.log(params);
            const showString = `
             <div style="color:${params.color}">
              <b >${params.name}</b>
              <div style="margin-left:4px">花费:&nbsp&nbsp${stringFormatRounder(
                params.data.cost,
                2,
                false,
              )}</div>
              <div style="margin-left:4px">总花费占比:&nbsp&nbsp${stringFormatRounder(
                params.data.cost_ratio,
                2,
                true,
              )}</div>
             </div>
            `;
            return showString;
          },
        },
      },
      {
        type: 'pie',
        radius: '85%',
        center: ['50%', '55%'],
        data: [],
        label: {
          position: 'inside',
          alignTo: 'none',
          bleedMargin: 5,
          formatter: '{b}: {d}%',
          rotate: true,
        },
        left: '70%',
        right: 0,
        top: 0,
        bottom: 0,
        tooltip: {
          formatter: (params: any) => {
            console.log(params);
            const showString = `
             <div style="color:${params.color}">
              <b >${params.name}</b>
              <div style="margin-left:4px">花费:&nbsp&nbsp${stringFormatRounder(
                params.data.cost,
                2,
                false,
              )}</div>
              <div style="margin-left:4px">总花费占比:&nbsp&nbsp${stringFormatRounder(
                params.data.cost_ratio,
                2,
                true,
              )}</div>
             </div>
            `;
            return showString;
          },
        },
      },
    ],
  };

  onMounted(async () => {
    getInstance()!.showLoading();
    const searchData: any = await loadChartsDataFn();
    eChartsOptionObj.series![0].data = searchData.asset;
    eChartsOptionObj.series![1].data = searchData.idea;
    eChartsOptionObj.series![2].data = searchData.make;
    setOptions(eChartsOptionObj);
    getInstance()!.hideLoading();
  });

  const loadChartsDataFn = async () => {
    const cost = await getAllCost();
    if (cost === 0) {
      message.error('获取总花费失败,请刷新页面重试');
      return;
    }
    const p1 = getAssetRatioData(cost);
    const p2 = getIdeasRatioDate(cost);
    const p3 = getMakesRatioDate(cost);
    const promisesList: Promise<any>[] = [p1, p2, p3];
    const resList = await Promise.all(promisesList);
    if (resList && resList.length === promisesList.length) {
      console.log(resList);
      const assetList = resList[0];
      assetList.sort((a, b) => {
        return b.cost - a.cost;
      });
      const ideaList = resList[1];
      ideaList.sort((a, b) => {
        return b.cost - a.cost;
      });
      const makeList = resList[2];
      makeList.sort((a, b) => {
        return b.cost - a.cost;
      });
      const assetFormatList: { name: string; value: number; item: any }[] = [];
      const ideaFormatList: { name: string; value: number; item: any }[] = [];
      const makeFormatList: { name: string; value: number; item: any }[] = [];
      assetList.map((ele) => {
        assetFormatList.push({
          name: ele[assetTableColumnsKey.kAsset],
          value: ele[assetTableColumnsKey.KCostRatio],
          ...ele,
        });
      });
      ideaList.map((ele) => {
        ideaFormatList.push({
          name: ele[assetTableColumnsKey.kIdea],
          value: ele[assetTableColumnsKey.KCostRatio],
          ...ele,
        });
      });
      makeList.map((ele) => {
        makeFormatList.push({
          name: ele[assetTableColumnsKey.kMaker],
          value: ele[assetTableColumnsKey.KCostRatio],
          ...ele,
        });
      });
      const showData = {
        asset: assetFormatList,
        idea: ideaFormatList,
        make: makeFormatList,
      };
      return showData;
    }
    return {
      asset: [],
      idea: [],
      make: [],
    };
  };
</script>
<script lang="ts">
  export default {
    name: 'PieCharts',
  };
</script>
