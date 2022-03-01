<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';
  import { onMounted, useAttrs, useSlots } from 'vue';

  const slots = useSlots();
  const attrs = useAttrs();
  console.log('app', slots, attrs);
  // support Multi-language
  const { getAntdLocale } = useLocale();
  onMounted(() => {
    console.log('app-onMounted', slots, attrs);
  });
  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>
