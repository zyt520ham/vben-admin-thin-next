<!--
 * @Description  : 项目角色管理页面
 * @Author       : zhangyantao
 * @Date         : 2022/2/25
 * @FilePath     : /Users/zhangyantao/wsp_web/openStudy/github-root/vben-admin-thin-next/src/views/rg/proj-setting/ProjRolesListMg.vue
-->
<template>
  <page-wrapper dense :class="`${prefixCls}`" content-class="warp-content-cls">
    <a-card v-if="showSearchFormRef" class="w-full rg-antd-cart" :bordered="true" hoverable>
      <BasicForm v-model:value="formData" @register="formRegister" @submit="handleSubmit">
        <template #slotField1="{ model, field }">
          <a-input placeholder="请输入角色名称" v-model:value="model[field]" />
        </template>
        <template #slotField2="{ model, field }">
          <a-input placeholder="请输入角色id" v-model:value="model[field]" />
        </template>
        <template #slotField3="{ model, field }">
          <a-select placeholder="请选择角色状态" v-model:value="model[field]">
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">停止 </a-select-option>
          </a-select>
        </template>
        <template #slotField4="{ model, field }">
          <a-range-picker v-model:value="model[field]"
        /></template>
      </BasicForm>
    </a-card>

    <BasicTable
      ref="projRolesMgTableComp"
      title="项目角色列表"
      :columns="columns"
      :canResize="true"
      :bordered="true"
      showTableSetting
      :pagination="false"
      :sortFn="tableSortFn"
      :api="loadRolesDataFromServerFn"
    >
      <template #toolbar>
        <a-button @click="searchBtnClick">查询</a-button>
      </template>
      <template #role="{ record }">
        <a-tag color="green">{{ record.role }}</a-tag>
        <!--          <a-tag></a-tag>-->
      </template>
    </BasicTable>
  </page-wrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, SorterResult } from '/@/components/Table';
  import { useDesign } from '/@/hooks/web/useDesign';
  import {
    getBasicColumns,
    getBasicData,
    getformSchamas,
  } from '/@/views/rg/proj-setting/roles-list/Roles.data';
  import AButton from '/@/components/Button/src/BasicButton.vue';
  // import { CollapseContainer } from '/@/components/Container';
  import PageWrapper from '/@/components/Page/src/PageWrapper.vue';
  import { BasicForm, useForm } from '/@/components/Form';

  export default defineComponent({
    name: 'ProjRolesListMg',
    components: {
      PageWrapper,
      AButton,
      BasicTable,

      BasicForm,
    },
    setup() {
      const { prefixCls } = useDesign('proj-roles-mg');
      const pagination = ref<any>(false);
      const showSearchFormRef = ref<boolean>(false);
      const projRolesMgTableComp = ref();
      const searchBtnClick = ($event) => {
        console.log('searchBtnClick', $event);
        showSearchFormRef.value = !showSearchFormRef.value;
        projRolesMgTableComp.value.redoHeight();
      };

      const [formRegister, { setProps, getFieldsValue }] = useForm({
        labelWidth: 120,
        size: 'small',
        showAdvancedButton: true,
        schemas: getformSchamas(),
        actionColOptions: {
          span: 24,
        },
      });
      const formData = ref();

      const handleSubmit = (values: any) => {
        console.log('handleSubmit', values);
        console.log(setProps);
        formData.value = getFieldsValue();
      };
      const tableDatas = ref(getBasicData());
      let isSorting = false;
      const tableSortFn = (sortInfo: SorterResult) => {
        console.log('tableSortFn', sortInfo);
        const list = projRolesMgTableComp.value.getDataSource();
        list.sort((a, b) => {
          if (sortInfo.order === 'ascend') {
            //升序
            return a[sortInfo.field] - b[sortInfo.field];
          } else {
            return b[sortInfo.field] - a[sortInfo.field];
          }
        });
        projRolesMgTableComp.value.setTableData(list);
        // setTableData(tableDatas.value);
        // return ;
      };

      const loadRolesDataFromServerFn = (...params) => {
        if (isSorting) {
          isSorting = false;
          return;
        }
        console.log('loadRolesDataFromServerFn', ...params);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(tableDatas.value);
          }, 1000);
        });
      };
      return {
        columns: getBasicColumns(),
        showSearchFormRef,
        pagination,
        prefixCls,
        searchBtnClick,
        projRolesMgTableComp,
        formRegister,
        handleSubmit,
        formData,
        tableSortFn,
        loadRolesDataFromServerFn,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-proj-roles-mg';
  @ns-prefix: ~'@{namespace}';
  .@{prefix-cls} {
    width: 100%;
    height: 100%;
    background-color: #ebeef5;
    padding: 0;
    margin: 0;

    //padding: 0px;
    //width: calc(100%);
    //height: calc(100% - 2px);
    //margin: 0 0 auto;
    //background-color: #ebeef5;
    //border-radius: 5px;
    //border: 1px solid #e8e9ed;
    & .@{ns-prefix}-page-wrapper-content.warp-content-cls {
      //margin: 0px;
      //padding: 0;
      //height: calc(100%);
      //width: 100%;
      //.test {
      //  width: 50%;
      //  height: 100%;
      //  background-color: #0a6cd5;
      //}
    }
  }
</style>
