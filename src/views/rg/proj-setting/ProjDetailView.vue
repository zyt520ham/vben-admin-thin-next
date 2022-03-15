<!--
 * @Description  : 项目详情管理页面
 * @Author       : zhangyantao
 * @Date         : 2022/2/25
 * @FilePath     : src/views/rg/proj-setting/ProjDetailView.vue
-->
<template>
  <PageWrapper dense contentFullHeight :class="`${prefixCls}`">
    <a-card class="w-full max-h-full rg-antd-cart overflow-auto" :bordered="true" hoverable>
      <div class="title-normal-view" :class="{ 'hide-class': editNameState }">
        <span class="title">项目测试</span>
        <a-button size="small" shape="circle" @click="startEditBtnEventFn">
          <template #icon>
            <EditOutlined />
          </template>
        </a-button>
      </div>
      <div class="edit-view" :class="{ 'hide-class': !editNameState }">
        <a-input class="edit" v-model:value="inputNameString" size="small" />
        <a-button class="actionbtn" size="small" shape="circle" @click="cancalEditInputEventFn">
          <template #icon>
            <CloseOutlined />
          </template>
        </a-button>
        <a-button class="actionbtn" size="small" shape="circle" @click="enterEditInputEventFn">
          <template #icon>
            <CheckOutlined />
          </template>
        </a-button>
      </div>
      <div class="info">
        <div class="info-item">
          <span class="label">项目ID</span>
          <span class="value">111111111111111111111111111</span>
        </div>
        <div class="info-item">
          <span class="label">项目名称</span>
          <span class="value">测试项目</span>
        </div>
        <div class="info-item">
          <span class="label">创建时间</span>
          <span class="value">2020/1/1</span>
        </div>
        <div class="info-item">
          <span class="label">项目状态</span>
          <span class="value">正常</span>
        </div>
      </div>
    </a-card>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'ProjDetailView',
    components: {
      PageWrapper,
      EditOutlined,
      CloseOutlined,
      CheckOutlined,
    },
    setup() {
      const { prefixCls } = useDesign('proj-details');
      const editNameState = ref(false);
      const startEditBtnEventFn = () => {
        editNameState.value = !editNameState.value;
      };
      const inputNameString = ref('');
      const cancalEditInputEventFn = () => {
        editNameState.value = false;
      };
      const enterEditInputEventFn = () => {
        editNameState.value = false;
      };
      return {
        prefixCls,
        editNameState,
        startEditBtnEventFn,
        inputNameString,
        cancalEditInputEventFn,
        enterEditInputEventFn,
      };
    },
  });
</script>
<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-proj-details';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
    .hide-class {
      display: none;
    }
    span.title {
      padding-right: 10px;
    }
    .edit-view {
      > .edit {
        width: 300px;
        padding-right: 10px;
      }
      .actionbtn {
        margin-left: 5px;
        //padding: 0;
        //width: 25px;
        //height: 25px;
      }
    }
    .info {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      margin-top: 14px;
      &-item {
        width: 50%;
        color: #202d3f;
        font-size: 14px;
        line-height: 36px;
        span.label {
          display: flex;
          align-items: center;
          float: left;
          width: 100px;
          height: 36px;
          margin-right: 10px;
          overflow: hidden;
          color: #67729d;
          line-height: 16px;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        span.value {
          display: block;
          padding-right: 5%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
