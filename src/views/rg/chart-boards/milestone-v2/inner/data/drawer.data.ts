import { FormSchema } from '/@/components/Form';

import { MilestoneColumnsKeyEnum } from '/@/views/rg/chart-boards/milestone-v2/inner/data/milestone.data';

export const getSeachFilterFormCfg: FormSchema[] = [
  {
    field: MilestoneColumnsKeyEnum.kAppPackageSys,
    label: '系统平台',
    component: 'Input',
    required: true,
    slot: 'fieldAppPackageSys',
    defaultValue: {
      multType: 1,
      useValueType: 0,
      values: [],
    },
  },
];
