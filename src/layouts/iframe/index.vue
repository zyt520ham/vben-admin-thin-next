<template>
  <div v-if="showFrame">
    <template v-for="frame in framePagesList">
      <FramePage
        :key="frame.path"
        v-if="frame.meta.frameSrc && hasRenderFrame(frame.name)"
        v-show="showIframe(frame)"
        :is-showing="showIframe(frame)"
        :frame-src="frame.meta.frameSrc"
        :route-full-path="frame.fullPath"
      />
    </template>
  </div>
  <div v-else>
    <span>没有缓存的iframe</span>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import FramePage from '/@/views/sys/iframe/index.vue';

  import { useFrameKeepAlive } from './useFrameKeepAlive';

  export default defineComponent({
    name: 'FrameLayout',
    components: { FramePage },
    setup() {
      const { getFramePages, hasRenderFrame, showIframe } = useFrameKeepAlive();
      const framePagesList = computed(() => {
        return getFramePages();
      });
      function showFrame() {
        return framePagesList.value.length > 0;
      }
      return {
        framePagesList,
        hasRenderFrame,
        showIframe,
        showFrame,
      };
    },
  });
</script>
