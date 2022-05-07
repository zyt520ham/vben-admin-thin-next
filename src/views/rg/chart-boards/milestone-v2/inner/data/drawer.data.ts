import { FormSchema } from '/@/components/Form';

import { MilestoneColumnsKeyEnum } from '/@/views/rg/chart-boards/milestone-v2/inner/data/milestone.data';

export const getSeachFilterFormCfg: FormSchema[] = [
  {
    field: MilestoneColumnsKeyEnum.kStartDay,
    label: '里程碑期次',
    component: 'Input',

    slot: 'fieldStartDay',
    defaultValue: {
      multType: 1,
      useValueType: 0,
      values: [],
    },
  },
  {
    field: MilestoneColumnsKeyEnum.kAppPackageSys,
    label: '系统平台',
    component: 'Input',

    slot: 'fieldAppPackageSys',
    defaultValue: {
      multType: 1,
      useValueType: 0,
      values: [],
    },
  },
  {
    field: MilestoneColumnsKeyEnum.kAppPackageGroup,
    label: '包分组',
    component: 'Input',

    slot: 'fieldAppPackageGroup',
    defaultValue: {
      multType: 1,
      useValueType: 0,
      values: [],
    },
  },
  {
    field: MilestoneColumnsKeyEnum.kCountryGroup,
    label: '国家分组',
    component: 'Input',

    slot: 'fieldCountryGroup',
    defaultValue: {
      multType: 1,
      useValueType: 0,
      values: [],
    },
  },
  {
    field: MilestoneColumnsKeyEnum.kMediaSourceGroup,
    label: ' 媒体分组',
    component: 'Input',

    slot: 'fieldMediaSourceGroup',
    defaultValue: {
      multType: 1,
      useValueType: 0,
      values: [],
    },
  },
];
