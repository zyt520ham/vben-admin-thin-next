<!--
 * @Description  : 里程碑上传
 * @Author       : zhangyantao
 * @Date         :
 * @FilePath     : src/views/rg/cost-upload/mile-store-upload/v2/MileStoneUpload.vue
-->
<template>
  <div class="h-full w-full">
    <a-card class="rg-antd-cart h-full w-full">
      <a-tabs v-model:activeKey="tabActiveKey" size="small" type="card">
        <template #tabBarExtraContent>
          <Tooltip placement="top">
            <template #title>
              <span>上传配置</span>
            </template>
            <a-button
              class="mr-50px"
              type="primary"
              shape="circle"
              size="small"
              @click="uploadNormalBtnClickFn"
            >
              <template #icon>
                <Icon :icon="`tabler:book-upload`" />
              </template>
            </a-button>
          </Tooltip>
        </template>
        <a-tab-pane :key="tab1">
          <template #tab>
            <span>
              <Icon icon="eos-icons:configuration-file-outlined" />
              {{ tab1Title }}
            </span>
          </template>
          <BasicTable @register="tabs1TableRegister">
            <template #tableTitle>
              <span class="flex space-x-3">
                <span class="ml-3px font-bold">默认里程碑配置列表</span>
                <Tooltip placement="top">
                  <template #title>
                    <span>上传默认里程碑配置</span>
                  </template>
                  <a-button
                    class="mr-50px"
                    type="primary"
                    shape="circle"
                    size="small"
                    @click="uploadTabSelectBtnClickFn"
                  >
                    <template #icon>
                      <Icon :icon="`tabler:book-upload`" />
                    </template>
                  </a-button>
                </Tooltip>
              </span>
            </template>
          </BasicTable>
        </a-tab-pane>
        <a-tab-pane :key="tab2">
          <template #tab>
            <span>
              <Icon icon="icon-park:international" />
              {{ tab2Title }}
            </span>
          </template>
          <BasicTable @register="tabs2TableRegister">
            <template #tableTitle>
              <span class="flex space-x-3">
                <span class="ml-3px font-bold">分国家里程碑配置列表</span>
                <Tooltip placement="top">
                  <template #title>
                    <span>上传国家里程碑配置</span>
                  </template>
                  <a-button
                    class="mr-50px"
                    type="primary"
                    shape="circle"
                    size="small"
                    @click="uploadTabSelectBtnClickFn"
                  >
                    <template #icon>
                      <Icon :icon="`tabler:book-upload`" />
                    </template>
                  </a-button>
                </Tooltip>
              </span>
            </template>
          </BasicTable>
        </a-tab-pane>
        <a-tab-pane :key="tab3">
          <template #tab>
            <span>
              <Icon icon="carbon:application" />
              {{ tab3Title }}
            </span>
          </template>
          <BasicTable @register="tabs3TableRegister">
            <template #tableTitle>
              <span class="flex space-x-3">
                <span class="ml-3px font-bold">分应用包里程碑配置列表</span>
                <Tooltip placement="top">
                  <template #title>
                    <span>上传应用包里程碑配置</span>
                  </template>
                  <a-button
                    class="mr-50px"
                    type="primary"
                    shape="circle"
                    size="small"
                    @click="uploadTabSelectBtnClickFn"
                  >
                    <template #icon>
                      <Icon :icon="`tabler:book-upload`" />
                    </template>
                  </a-button>
                </Tooltip>
              </span>
            </template>
          </BasicTable>
        </a-tab-pane>
        <a-tab-pane :key="tab4">
          <template #tab>
            <span>
              <Icon icon="carbon:media-library" />
              {{ tab4Title }}
            </span>
          </template>
          <BasicTable @register="tabs4TableRegister">
            <template #tableTitle>
              <span class="flex space-x-3">
                <span class="ml-3px font-bold">分媒体渠道里程碑配置列表</span>
                <Tooltip placement="top">
                  <template #title>
                    <span>上传媒体渠道里程碑配置</span>
                  </template>
                  <a-button
                    class="mr-50px"
                    type="primary"
                    shape="circle"
                    size="small"
                    @click="uploadTabSelectBtnClickFn"
                  >
                    <template #icon>
                      <Icon :icon="`tabler:book-upload`" />
                    </template>
                  </a-button>
                </Tooltip>
              </span>
            </template>
          </BasicTable>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <MilestoneV2UploadDrawerComp
      @register="registerDrawerFn"
      @update_milestone_list="updateMileStoneListFn"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { getCfgForMilestoneUploadedApi } from '/@/api/sys/costApi';
  import { IReqErr } from '/#/axios';
  import { logNoTrace } from '/@/utils/log';

  import Icon from '/@/components/Icon/src/Icon.vue';
  import { message, Tooltip } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getMileStoneColumns } from '/@/views/rg/cost-upload/mile-store-upload/v2/inner/milestone.data';
  import MilestoneV2UploadDrawerComp from './inner/MilestoneV2UploadDrawerComp.vue';
  import { useDrawer } from '/@/components/Drawer';

  type tabsKeyType = 'apppackage' | 'country' | 'mediasource' | 'config';
  const tab3: tabsKeyType = 'apppackage';
  const tab2: tabsKeyType = 'country';
  const tab4: tabsKeyType = 'mediasource';
  const tab1: tabsKeyType = 'config';
  const tab1Title = '里程碑配置';
  const tab2Title = '分国家配置';
  const tab3Title = '分应用配置';
  const tab4Title = '分渠道配置';

  const tabActiveKey = ref(tab1);

  const uploadNormalBtnClickFn = () => {
    drawerMethods.openDrawer(true, {});
  };
  const uploadTabSelectBtnClickFn = () => {
    drawerMethods.openDrawer(true, { type: tabActiveKey.value });
  };
  //#region tabs1 =================================
  const getConfigListApi = () => {
    console.log('getUploadedCostListApi');
    return new Promise((resolve, reject) => {
      getCfgForMilestoneUploadedApi({ type: 'config' }).then(
        (resp) => {
          logNoTrace(resp);
          const list: any = [];
          for (const respKey in resp) {
            const item = {
              name: respKey,
              uploadTime: resp[respKey]['LastModified'] || '',
            };
            list.push(item);
            resolve(list);
          }
        },
        (err: IReqErr) => {
          logNoTrace(err);
          message.error(err.retMsg!);
          reject();
        },
      );
    });
  };
  const [tabs1TableRegister, tabs1TableMethods] = useTable({
    showTableSetting: true,
    api: getConfigListApi,
    bordered: true,
    columns: getMileStoneColumns,
    canResize: true,
    pagination: false,
    showIndexColumn: false,
  });
  //#endregion  -------------------------------------
  //#region tabs2 =================================
  const getCountryConfigListApi = () => {
    console.log('getUploadedCostListApi');
    return new Promise((resolve, reject) => {
      getCfgForMilestoneUploadedApi({ type: 'country' }).then(
        (resp) => {
          logNoTrace(resp);
          const list: any = [];
          for (const respKey in resp) {
            const item = {
              name: respKey,
              uploadTime: resp[respKey]['LastModified'] || '',
            };
            list.push(item);
            resolve(list);
          }
        },
        (err: IReqErr) => {
          logNoTrace(err);
          message.error(err.retMsg!);
          reject();
        },
      );
    });
  };
  const [tabs2TableRegister, tabs2TableMethods] = useTable({
    showTableSetting: true,
    api: getCountryConfigListApi,
    bordered: true,
    columns: getMileStoneColumns,
    canResize: true,
    pagination: false,
    showIndexColumn: false,
  });
  //#endregion  -------------------------------------
  //#region tabs3 =================================
  const getAppPackageConfigListApi = () => {
    console.log('getUploadedCostListApi');
    return new Promise((resolve, reject) => {
      getCfgForMilestoneUploadedApi({ type: 'apppackage' }).then(
        (resp) => {
          logNoTrace(resp);
          const list: any = [];
          for (const respKey in resp) {
            const item = {
              name: respKey,
              uploadTime: resp[respKey]['LastModified'] || '',
            };
            list.push(item);
            resolve(list);
          }
        },
        (err: IReqErr) => {
          logNoTrace(err);
          message.error(err.retMsg!);
          reject();
        },
      );
    });
  };
  const [tabs3TableRegister, tabs3TableMethods] = useTable({
    showTableSetting: true,
    api: getAppPackageConfigListApi,
    bordered: true,
    columns: getMileStoneColumns,
    canResize: true,
    pagination: false,
    showIndexColumn: false,
  });
  //#endregion  -------------------------------------
  //#region tabs4 =================================
  const getMediasourceConfigListApi = () => {
    console.log('getUploadedCostListApi');
    return new Promise((resolve, reject) => {
      getCfgForMilestoneUploadedApi({ type: 'mediasource' }).then(
        (resp) => {
          logNoTrace(resp);
          const list: any = [];
          for (const respKey in resp) {
            const item = {
              name: respKey,
              uploadTime: resp[respKey]['LastModified'] || '',
            };
            list.push(item);
            resolve(list);
          }
        },
        (err: IReqErr) => {
          logNoTrace(err);
          message.error(err.retMsg!);
          reject();
        },
      );
    });
  };
  const [tabs4TableRegister, tabs4TableMethods] = useTable({
    showTableSetting: true,
    api: getMediasourceConfigListApi,
    bordered: true,
    columns: getMileStoneColumns,
    canResize: true,
    pagination: false,
    showIndexColumn: false,
  });
  //#endregion  -------------------------------------
  function getTableMethod(tabsKey: tabsKeyType) {
    if (tabsKey === tab1) {
      return tabs1TableMethods;
    } else if (tabsKey === tab2) {
      return tabs2TableMethods;
    } else if (tabsKey === tab3) {
      return tabs3TableMethods;
    } else {
      return tabs4TableMethods;
    }
  }
  //#region drawer ========================================
  const [registerDrawerFn, drawerMethods] = useDrawer();
  const updateMileStoneListFn = (cfgType: tabsKeyType) => {
    console.log('updateMileStoneListFn ', cfgType);
    if (cfgType === tabActiveKey.value) {
      getTableMethod(cfgType).reload();
    }
    drawerMethods.closeDrawer();
  };
  //#endregion ---------------------------------------------
</script>
<script lang="ts">
  export default {
    name: 'MileStoneUpload',
  };
</script>

<style scoped></style>
