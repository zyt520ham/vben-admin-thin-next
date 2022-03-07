<template>
  <div class="w-screen h-screen">
    <div class="w-150px h-550px mr-auto ml-auto">
      <GZSelectList :prop_choose-list="data" @selectedItemsFn="checkedListFn" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';

  import { log } from '/@/utils/log';
  import GZSelectList from '/@/components/gz/RGSelectList/GZSelectList.vue';

  export default defineComponent({
    name: 'Test1',
    components: {
      GZSelectList,
    },
    setup() {
      onMounted(() => {
        const list: any = [];
        for (let i = 1; i < 50; i++) {
          const item = {
            title: 'title' + i,
            content: 'content' + i,
          };
          list.push(item);
        }
        data.value = list;
      });
      const data = ref([]);
      const checkedListFn = (checkedList: any[]) => {
        log('checkedListFn', checkedList);
      };
      return { data, checkedListFn };
    },
  });
</script>

<style lang="less" scoped></style>
