<!--
 * @Description  : 搜索组件使用按钮
 * @Author       : zhangyantao
 * @Date         : 2022/3/3
 * @FilePath     : src/components/GzShowSearchFormBtn/src/GzShowSearchFormBtn.vue
-->
<template>
  <a-tooltip placement="top" v-if="showSearchFormState === false" title="显示搜索">
    <a-button @click="btnEventFn" shape="circle" type="text">
      <template #icon>
        <SearchOutlined v-if="showSearchFormState === false" />
      </template>
    </a-button>
  </a-tooltip>
  <a-tooltip placement="top" v-if="showSearchFormState === true" title="隐藏搜索">
    <a-button @click="btnEventFn" shape="circle" type="text">
      <template #icon>
        <Icon icon="search-close|svg" />
      </template>
    </a-button>
  </a-tooltip>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { Icon } from '/@/components/Icon';
  export default defineComponent({
    name: 'GzShowSearchFormBtn',
    components: {
      SearchOutlined,
      Icon,
    },
    props: {
      propShowState: {
        type: Boolean,
        default: false,
      },
      propToggleShowState: {
        type: Function,
        default: null,
      },
    },
    setup(props) {
      const showSearchFormState = ref(props.propShowState);
      const btnEventFn = () => {
        showSearchFormState.value = !showSearchFormState.value;
        if (props.propToggleShowState) {
          props.propToggleShowState(showSearchFormState.value);
        }
      };
      return {
        showSearchFormState,
        btnEventFn,
      };
    },
  });
</script>

<style scoped></style>
