<template>
  <div class="test">
    <span>test-----------</span>
    <span>{{ titleName }}</span>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  export default defineComponent({
    name: 'Test',
    props: {
      title: String,
    },
    setup(prop, context) {
      onMounted(() => {
        console.log(prop);
        console.log(context);
        // const { currentRoute } = useRouter();
        // console.log('route', currentRoute);
      });
      const ccRoute = useRoute();
      console.log('router -- route', ccRoute);
      const { currentRoute } = useRouter();
      console.log('router -- route', currentRoute);
      const titleName = computed(() => {
        return currentRoute.value.name;
      });
      return {
        titleName,
      };
    },
  });
</script>

<style lang="less" scoped>
  .test {
    width: 100%;
    height: 100%;
    span {
      text-align: center;
    }
  }
</style>
