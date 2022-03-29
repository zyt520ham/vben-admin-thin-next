<template>
  <PageWrapper :class="`${prefixCls}`" contentFullHeight dense>
    <div class="w-full h-full flex space-x-5px p-5x">
      <div class=""></div>
      <div></div>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'LineCostUpload',
  };
</script>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  const { prefixCls } = useDesign('upload-cost-line');
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-upload-cost-line';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
  }
</style>
