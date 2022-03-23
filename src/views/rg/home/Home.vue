<template>
  <div :class="prefixCls">
    <h3>BI数据中台</h3>
    <p>
      <span
        >BI数据中台为公司自行设计研发项目，目前处于初期设计迭代阶段，有需求或者疑问，可以直接与BI的小伙伴联系</span
      >
    </p>
  </div></template
>

<script lang="ts">
  export default {
    name: 'Home',
  };
</script>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  const { prefixCls } = useDesign('home');
  onMounted(() => {
    console.log('home onMounted');
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-home';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
    text-align: center;
    h3 {
      padding-top: 100px;
      padding-bottom: 100px;
    }
  }
</style>
