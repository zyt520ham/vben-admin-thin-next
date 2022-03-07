<template>
  <div
    class="list-item"
    :class="{ 'use-contentlabel': compItemData.content }"
    @click="itemClickEventFn"
  >
    <div class="left-item" :class="{ 'item-checked': compItemData.checked }">
      <CheckOutlined />
    </div>
    <div class="center-content">
      <a-tooltip destroyTooltipOnHide placement="topLeft" :mouseEnterDelay="0.3">
        <template #title>
          <span>{{ compItemData.title }}</span>
        </template>
        <span class="title">{{ compItemData.title }}</span>
      </a-tooltip>
      <template v-if="compItemData.content">
        <a-tooltip destroyTooltipOnHide placement="top" :mouseEnterDelay="0.3">
          <template #title>
            <span>{{ compItemData.content }}</span>
          </template>
          <span class="content">{{ compItemData.content }}</span>
        </a-tooltip>
      </template>
    </div>
    <div class="right-item" :class="{ 'item-checked': compItemData.checked }">
      <MinusCircleOutlined v-if="compItemData.checked" />
      <PlusCircleOutlined v-else />
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { CheckOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'GZSelectItem',
    components: { CheckOutlined, PlusCircleOutlined, MinusCircleOutlined },
    props: {
      itemData: {
        type: Object as PropType<{ title: string; content: string; checked: boolean }>,
        default: undefined,
        required: true,
      },
    },
    emits: ['update:itemData'],
    setup(props, { emit }) {
      const compItemData = computed(() => {
        return props.itemData;
      });
      const itemClickEventFn = () => {
        const obj = Object.assign({}, props.itemData);
        obj.checked = !obj.checked;
        emit('update:itemData', obj);
      };

      return { compItemData, itemClickEventFn };
    },
  });
</script>

<style scoped lang="less">
  .list-item {
    display: flex;
    align-items: center;
    //height: 28px;
    height: 100%;
    padding: 0;
    margin: 0 auto;
    width: calc(100%);
    cursor: pointer;
    border-bottom: 1px solid lightgray;
    &:not(.use-contentlabel) {
      height: 28px;
    }
    &.use-contentlabel {
      height: 45px;
    }
    &:hover {
      background-color: #f0f2f5;
      pointer-events: auto;
      cursor: pointer;
      .right-item {
        opacity: 1;
      }
    }
    .center-content {
      overflow-x: hidden;
      height: 100%;
      display: flex;
      flex-shrink: 1;
      flex-grow: 1;
      flex-direction: column;
      box-sizing: border-box;
      span.title {
        display: inline-block;
        padding-left: 2px;
        padding-right: 10px;
        width: calc(100% - 25px);
        height: 25px;
        line-height: 28px;
        //overflow-x: "clip";
        overflow: clip;
        color: #42546d;
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      span.content {
        display: inline-block;
        padding-left: 2px;
        width: calc(100% - 5px);
        overflow: clip;
        overflow-clip: true;
        color: #43556c;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .right-item,
    .left-item {
      padding: 0 5px;
      flex: 0 0 16px;
      text-align: center;
      font-size: 12px;
      color: #2f66ff;
      opacity: 0;
      box-sizing: border-box;
    }
    .left-item {
      &.item-checked {
        opacity: 1;
      }
    }
  }
</style>
