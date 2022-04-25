<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, Ref } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { EChartsOption } from 'echarts';

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  const data = [
    {
      name: 'Apples',
      value: 70,
    },
    {
      name: 'Strawberries',
      value: 68,
    },
    {
      name: 'Bananas',
      value: 48,
    },
    {
      name: 'Oranges',
      value: 40,
    },
    {
      name: 'Pears',
      value: 32,
    },
    {
      name: 'Pineapples',
      value: 27,
    },
    {
      name: 'Grapes',
      value: 18,
    },
  ];
  const option: EChartsOption = {
    title: [
      {
        subtext: 'alignTo: "none" (default)',
        left: '16.67%',
        top: '75%',
        textAlign: 'center',
      },
      {
        subtext: 'alignTo: "labelLine"',
        left: '50%',
        top: '75%',
        textAlign: 'center',
      },
      {
        subtext: 'alignTo: "edge"',
        left: '83.33%',
        top: '75%',
        textAlign: 'center',
      },
    ],
    tooltip: {
      trigger: 'item',
      show: true,
    },
    series: [
      {
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        dimensions: Object.keys(data),
        roseType: undefined,
        data: data,
        label: {
          position: 'inside',
          alignTo: 'none',
          bleedMargin: 5,
          formatter: '{b}: {d}',
          rotate: true,
        },
        tooltip: {
          // formatter: 'aabbcc',
        },
        left: 0,
        right: '60%',
        top: 0,
        bottom: 0,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
      {
        type: 'pie',
        radius: '25%',
        center: ['50%', '50%'],
        data: data,
        label: {
          position: 'outer',
          alignTo: 'labelLine',
          bleedMargin: 5,
        },
        left: '40%',
        right: '30%',
        top: 0,
        bottom: 0,
      },
      {
        type: 'pie',
        radius: '25%',
        center: ['50%', '50%'],
        data: data,
        label: {
          position: 'outer',
          alignTo: 'edge',
          margin: 20,
        },
        left: '70%',
        right: 0,
        top: 0,
        bottom: 0,
      },
    ],
  };

  onMounted(() => {
    setOptions(option);
  });
</script>
<script lang="ts">
  export default {
    name: 'PieCharts',
  };
</script>
