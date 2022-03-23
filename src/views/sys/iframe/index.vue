<template>
  <div :class="prefixCls" :style="getWrapStyle">
    <Spin :spinning="loading" size="large" :style="getWrapStyle">
      <iframe
        :src="iframeUrlString"
        :class="`${prefixCls}__main`"
        ref="frameRef"
        @load="hideLoading"
      ></iframe>
    </Spin>
  </div>
</template>
<script lang="ts" setup>
  import type { CSSProperties } from 'vue';
  import { ref, unref, computed, onMounted, watch } from 'vue';
  import { Spin } from 'ant-design-vue';
  import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
  import { propTypes } from '/@/utils/propTypes';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLayoutHeight } from '/@/layouts/default/content/useContentViewHeight';
  import { error, log } from '/@/utils/log';
  import { getTokenExchangedUrlApi } from '/@/api/sys/urlTokenApi';
  import { IReqErr } from '/#/axios';
  import { useMultipleTabWithOutStore } from '/@/store/modules/multipleTab';

  const props = defineProps({
    frameSrc: propTypes.string.def(''),
    routeFullPath: propTypes.string.def(''),
    isShowing: propTypes.bool.def(false),
  });
  const iframeUrlString = ref<string>('');
  const loading = ref(true);
  const topRef = ref(50);
  const heightRef = ref(window.innerHeight);
  const frameRef = ref<HTMLIFrameElement>();
  const { headerHeightRef } = useLayoutHeight();

  const { prefixCls } = useDesign('iframe-page');
  useWindowSizeFn(calcHeight, 150, { immediate: true });
  const routeCachePathList = computed(() => {
    return useMultipleTabWithOutStore().getCachedPathList;
  });
  watch(
    () => routeCachePathList.value,
    (nV: string[]) => {
      if (props.isShowing && !nV.includes(props.routeFullPath)) {
        console.log('routeCachePathList changed', nV, props.routeFullPath);
        iframeUrlString.value = '';
        loading.value = true;
        let patt = /###(\w+)###/;
        debugger;
        if (patt.test(props.frameSrc)) {
          getTokenExchangedUrlApi({ url: props.frameSrc }).then(
            (resp) => {
              iframeUrlString.value = resp;
            },
            (err: IReqErr) => {
              error(err.retMsg!);
            },
          );
        } else {
          console.log('当前url 无需转换token');
          loading.value = true;
          iframeUrlString.value = '';
          iframeUrlString.value = props.frameSrc;
          setTimeout(() => {
            loading.value = false;
          }, 100);
        }
      }
    },
  );
  onMounted(() => {
    log('iframe index mounted');

    let patt = /###(\w+)###/;

    if (patt.test(props.frameSrc)) {
      getTokenExchangedUrlApi({ url: props.frameSrc }).then(
        (resp) => {
          iframeUrlString.value = resp;
        },
        (err: IReqErr) => {
          error(err.retMsg!);
        },
      );
    } else {
      iframeUrlString.value = props.frameSrc;
    }
  });
  const getWrapStyle = computed((): CSSProperties => {
    return {
      height: `${unref(heightRef)}px`,
    };
  });

  function calcHeight() {
    const iframe = unref(frameRef);
    if (!iframe) {
      return;
    }
    const top = headerHeightRef.value;
    topRef.value = top;
    heightRef.value = window.innerHeight - top;
    const clientHeight = document.documentElement.clientHeight - top;
    iframe.style.height = `${clientHeight}px`;
  }

  function hideLoading() {
    loading.value = false;
    calcHeight();
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-iframe-page';

  .@{prefix-cls} {
    .ant-spin-nested-loading {
      position: relative;
      height: 100%;

      .ant-spin-container {
        width: 100%;
        height: 100%;
        padding: 10px;
      }
    }

    &__mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &__main {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: @component-background;
      border: 0;
      box-sizing: border-box;
    }
  }
</style>
