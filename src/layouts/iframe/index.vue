<template>
  <div v-if="showFrame">
    <template v-for="frame in framePagesList" :key="frame.path">
      <FramePage
        v-if="frame.meta.frameSrc && hasRenderFrame(frame.name)"
        v-show="showIframe(frame)"
        :frameSrc="frame.meta.frameSrc"
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
        debugger;
        return getFramePages();
      });
      // const showFrame = computed(() => {
      //   return framePagesList.value.length > 0;
      // });

      function showFrame() {
        debugger;
        return framePagesList.value.length > 0;
      }
      return { framePagesList, hasRenderFrame, showIframe, showFrame };
    },
  });
</script>
