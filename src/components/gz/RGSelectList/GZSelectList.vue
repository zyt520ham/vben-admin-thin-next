<template>
  <div class="w-full h-full">
    <VScroll class="h-full" :items="itemListData" :itemHeight="itemHeightState" :bench="20">
      <template #default="{ item }">
        <GZSelectItem :itemData="item" @update:itemData="changedItemDataFn" />
      </template>
    </VScroll>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue';
  import { log } from '/@/utils/log';
  import { buildShortUUID } from '/@/utils/uuid';
  import { VScroll } from '/@/components/VirtualScroll';
  import GZSelectItem from './GZSelectItem.vue';
  export interface ISelectItem {
    id: string;
    title: string;
    content?: string;
    checked: boolean;
    oriObj: object | string;
  }
  export default defineComponent({
    name: 'GZSelectList',
    components: {
      // PageWrapper,
      VScroll,
      GZSelectItem,
    },
    props: {
      prop_chooseList: {
        required: true,
        type: Array as PropType<any[]>,
        default: () => {
          return [];
        },
      },
      prop_replaceFields: {
        required: false,
        type: Object as PropType<{ title: string; content: string }>,
        default: () => {
          return {
            title: 'title',
            content: 'content',
          };
        },
      },
    },
    emits: ['selectedItemsFn'],
    setup(props, { emit }) {
      const itemListData = ref([]);
      const itemsMapData = ref<{ [key: string]: ISelectItem }>({});
      const chooseIdList = ref<string[]>([]);
      watch(
        () => props.prop_chooseList,
        (nVal, oldVal) => {
          log('watch:prop_chooseList', nVal, oldVal);
          const list: any = [];
          if (nVal) {
            for (let i = 0; i < nVal?.length; i++) {
              const oriItem: any = nVal[i];
              const item: ISelectItem = {
                id: buildShortUUID('item' + i),
                title: oriItem[props.prop_replaceFields.title],
                // content: 'content' + i,
                checked: false,
                oriObj: oriItem,
              };
              if (Object.keys(oriItem).includes(props.prop_replaceFields.content)) {
                item.content = oriItem[props.prop_replaceFields.content] || '';
              }
              list.push(item);
              itemsMapData.value[item.id] = item;
            }
            itemListData.value = list;
          }
        },
        {
          immediate: true,
        },
      );
      const itemHeightState = computed(() => {
        if (itemListData.value.length > 0) {
          if (Object.keys(itemListData.value[0]).includes('content')) {
            return '45px';
          } else {
            return '28px';
          }
        }
        return '45px';
      });
      const changedItemDataFn = (itemData: any) => {
        log('changedItemDataFn', itemData);
        if (itemData) {
          itemsMapData.value[itemData.id].checked = itemData.checked;
          if (itemsMapData.value[itemData.id].checked) {
            chooseIdList.value.push(itemData.id);
          } else {
            const searchIndex = chooseIdList.value.findIndex((value: string) => {
              if (value === itemData.id) {
                return true;
              }
              return false;
            });
            if (searchIndex >= 0) {
              chooseIdList.value.splice(searchIndex, 1);
            }
          }

          const items = chooseIdList.value.map((id: string) => {
            return itemsMapData.value[id].oriObj;
          });
          emit('selectedItemsFn', items);
        }
      };
      return { itemListData, itemsMapData, changedItemDataFn, itemHeightState };
    },
  });
</script>

<style scoped></style>
