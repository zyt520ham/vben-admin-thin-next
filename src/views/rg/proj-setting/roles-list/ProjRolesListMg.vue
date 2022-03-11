<!--
 * @Description  : 项目角色管理页面
 * @Author       : zhangyantao
 * @Date         : 2022/2/25
 * @FilePath     : src/views/rg/proj-setting/ProjRolesListMg.vue
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
      :actionColumn="actionColumn"
    >
      <template #tableTitle>
        <span class="flex space-x-3">
          <span class="font-bold">项目角色列表</span>
          <TableAction
            :divider="false"
            :actions="[
              {
                tooltip: {
                  title: '新增角色',
                  placement: 'top',
                },
                type: 'primary',
                // color: 'success',
                shape: 'circle',
                icon: 'clarity:note-edit-line',
                onClick: addBtnClickFn.bind(null),
              },
            ]"
          />
        </span>
      </template>
      <template #toolbar>
        <a-tooltip placement="top" v-if="showSearchFormRef === false" title="显示搜索">
          <a-button @click="searchBtnClick" shape="circle" type="text">
            <template #icon>
              <SearchOutlined v-if="showSearchFormRef === false" />
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip placement="top" v-if="showSearchFormRef === true" title="隐藏搜索">
          <a-button @click="searchBtnClick" shape="circle" type="text">
            <template #icon>
              <Icon icon="search-close|svg" />
            </template>
          </a-button>
        </a-tooltip>
      </template>
      <template #role="{ record }">
        <a-tag color="green">{{ record.role }}</a-tag>
      </template>
      <template #colAction="{ record, column }">
        <TableAction :actions="createActionsFn(record, column)" />
      </template>
    </BasicTable>
    <RoleEditDrawer @register="registerDrawerFn" @success="handleSuccessDrawerFn" />
  </page-wrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import {
    ActionItem,
    BasicColumn,
    BasicTable,
    EditRecordRow,
    SorterResult,
    TableAction,
  } from '/@/components/Table';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getBasicColumns, getformSchamas } from '/@/views/rg/proj-setting/roles-list/Roles.data';
  import PageWrapper from '/@/components/Page/src/PageWrapper.vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import RoleEditDrawer from '/@/views/rg/proj-setting/roles-list/RoleEditDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { Icon } from '/@/components/Icon';
  import { useProjsStoreWithOut } from '/@/store/modules/projectsStore';
  import { IReqDelRole } from '/@/api/sys/model/roleModel';
  import { delRoleInfoApi } from '/@/api/sys/roleApi';
  import { log } from '/@/utils/log';
  import { IReqErr } from '/#/axios';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'ProjRolesListMg',
    components: {
      PageWrapper,
      BasicTable,
      TableAction,
      BasicForm,
      RoleEditDrawer,
      Icon,
      SearchOutlined,
    },
    setup() {
      const { prefixCls } = useDesign('proj-roles-mg');
      const pagination = ref<any>(false);
      const showSearchFormRef = ref<boolean>(false);
      const projRolesMgTableComp = ref<any>();
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

      const [registerDrawerFn, { openDrawer }] = useDrawer();

      const formData = ref();

      const handleSubmit = (values: any) => {
        console.log('handleSubmit', values);
        console.log(setProps);
        formData.value = getFieldsValue();
      };

      const tableDatas = ref([]);
      let isSorting = false;
      const actionColumn: BasicColumn = {
        width: '120px',
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'colAction' },
      };
      //编辑列key标记
      const currentEditKeyRef = ref('');
      const tableSortFn = (sortInfo: SorterResult) => {
        console.log('tableSortFn', sortInfo);
        isSorting = true;
        const list = projRolesMgTableComp.value.getDataSource();
        list.sort((a, b) => {
          if (sortInfo.order === 'ascend') {
            //升序
            return a[sortInfo.field] - b[sortInfo.field];
          } else {
            return b[sortInfo.field] - a[sortInfo.field];
          }
        });
        tableDatas.value = list;
      };

      const loadRolesDataFromServerFn = (...params) => {
        console.log('loadRolesDataFromServerFn', ...params);
        return new Promise(async (resolve) => {
          if (isSorting) {
            isSorting = false;
            resolve(tableDatas.value);
            return;
          } else {
            // debugger;
            let list: any[] = useProjsStoreWithOut().getCurrentProjRoles;
            if (!list || list.length === 0) {
              list = (await useProjsStoreWithOut().reGetCurrentProjectRoles()) as any;
              log('loadRolesDataFromServerFn', list);
            }
            resolve(list);
          }
        });
      };
      // <a-icon type="edit" />
      const addBtnClickFn = () => {
        console.log('addBtnClickFn');
        openDrawer(true, {
          record: {},
          isUpdateRole: false,
        });
      };
      function createActionsFn(record: EditRecordRow): ActionItem[] {
        return [
          {
            // label: '编辑',
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
            onClick: handleEdit.bind(null, record),
          },
          {
            // label: '删除',
            icon: 'ant-design:delete-outlined',
            tooltip: '删除',
            color: 'error',
            popConfirm: {
              title: `是否删除角色【${record.description}】`,
              confirm: handleDelete.bind(null, record),
            },
          },
        ];
      }
      function handleEdit(record: EditRecordRow) {
        log('handleEdit', record);
        openDrawer(true, {
          record,
          isUpdateRole: true,
        });
      }
      function handleDelete(record: EditRecordRow) {
        log('handleDelete', record);
        const params: IReqDelRole = {
          role: record.role,
        };
        delRoleInfoApi(params).then(
          (resp) => {
            log('delRoleInfoApi', resp);
            message.success('角色已经删除');
            projRolesMgTableComp.value.deleteTableDataRecord(record.key);
            useProjsStoreWithOut().reGetCurrentProjectRoles();
          },
          (err: IReqErr) => {
            message.error(err.retMsg!);
          },
        );
      }

      const handleSuccessDrawerFn = () => {
        console.log('handleSuccessDrawer');
        projRolesMgTableComp.value.reload();
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
        actionColumn,
        tableSortFn,
        loadRolesDataFromServerFn,
        createActionsFn,
        registerDrawerFn,
        handleSuccessDrawerFn,
        addBtnClickFn,
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
