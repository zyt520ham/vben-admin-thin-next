import { BasicColumn } from '/@/components/Table';
import { stringFormatRounder } from '/@/utils/stringUtils';

export enum MilestoneColumnsKeyEnum {
  kStartDay = 'startday',
  kEndDay = 'endday',
  kStepDay = 'stepday',
  kStepEndDay = 'stependday',
  kAppPackageGroup = 'app_package_group',
  kAppPackagePf = 'app_package_pf',
  kAppPackageSys = 'app_package_sys',
  kCountryGroup = 'country_group',
  kMediaSourceGroup = 'mediasource_group',
  kTargetCost = 'target_cost',
  kTargetUsd = 'target_usd',
}

export interface ITableDataItem {
  // @ts-ignore
  [key in MilestoneColumnsKeyEnum]: string;
}

export const getMileStoneColumnsCfg: BasicColumn[] = [
  {
    title: '里程碑起始',
    dataIndex: MilestoneColumnsKeyEnum.kStartDay,
    width: '100px',
    fixed: 'left',
    // slots: { customRender: 'colUserId' },
    sorter: (a, b) => {
      return a[MilestoneColumnsKeyEnum.kStartDay].localeCompare(
        b[MilestoneColumnsKeyEnum.kStartDay],
      );
    },
  },
  {
    title: '阶段开始',
    dataIndex: MilestoneColumnsKeyEnum.kStepDay,
    width: '90px',
    sorter: (a, b) => {
      return a[MilestoneColumnsKeyEnum.kStepDay].localeCompare(b[MilestoneColumnsKeyEnum.kStepDay]);
    },
  },
  {
    title: '阶段结束',
    dataIndex: MilestoneColumnsKeyEnum.kStepEndDay,
    width: '90px',
    sorter: (a, b) => {
      return a[MilestoneColumnsKeyEnum.kStepEndDay].localeCompare(
        b[MilestoneColumnsKeyEnum.kStepEndDay],
      );
    },
  },
  {
    title: '包分组',
    dataIndex: MilestoneColumnsKeyEnum.kAppPackageGroup,
    width: '90px',
    ifShow: true,
    sorter: (a, b) => {
      return a[MilestoneColumnsKeyEnum.kAppPackageGroup].localeCompare(
        b[MilestoneColumnsKeyEnum.kAppPackageGroup],
      );
    },
  },
  {
    title: '目标美元',
    dataIndex: MilestoneColumnsKeyEnum.kTargetUsd,
    width: '100px',
    align: 'right',
    format: (text) => {
      return stringFormatRounder(text, 2);
    },
    sorter: (a, b) => {
      return (
        a[MilestoneColumnsKeyEnum.kTargetCost] * 1 - b[MilestoneColumnsKeyEnum.kTargetCost] * 1
      );
    },
  },
  {
    title: '系统',
    dataIndex: MilestoneColumnsKeyEnum.kAppPackagePf,
    width: '70px',
    defaultHidden: false,
  },
  {
    title: '国家分组',
    dataIndex: MilestoneColumnsKeyEnum.kCountryGroup,
    width: '70px',
    defaultHidden: false,
  },
  {
    title: '媒体分组',
    dataIndex: MilestoneColumnsKeyEnum.kMediaSourceGroup,
    width: '70px',
    defaultHidden: true,
  },
  {
    title: '达标花费',
    dataIndex: MilestoneColumnsKeyEnum.kTargetCost,
    width: '100px',
    format: (text: string) => {
      return stringFormatRounder(text, 2);
    },
  },
];
export const getTestTableData: ITableDataItem[] = [
  {
    [MilestoneColumnsKeyEnum.kStartDay]: '20210501',
    [MilestoneColumnsKeyEnum.kEndDay]: '',
    [MilestoneColumnsKeyEnum.kStepDay]: '20210501',
    [MilestoneColumnsKeyEnum.kStepEndDay]: '20210526',
    [MilestoneColumnsKeyEnum.kAppPackageGroup]: 'CN',
    [MilestoneColumnsKeyEnum.kAppPackagePf]: 'Other',
    [MilestoneColumnsKeyEnum.kAppPackageSys]: 'IOS',
    [MilestoneColumnsKeyEnum.kCountryGroup]: 'Other',
    [MilestoneColumnsKeyEnum.kMediaSourceGroup]: 'Other',
    [MilestoneColumnsKeyEnum.kTargetCost]: 3076923.08,
    [MilestoneColumnsKeyEnum.kTargetUsd]: '0',
  },
  {
    [MilestoneColumnsKeyEnum.kStartDay]: '20210501',
    [MilestoneColumnsKeyEnum.kEndDay]: '',
    [MilestoneColumnsKeyEnum.kStepDay]: '20210501',
    [MilestoneColumnsKeyEnum.kStepEndDay]: '20210526',
    [MilestoneColumnsKeyEnum.kAppPackageGroup]: 'CN',
    [MilestoneColumnsKeyEnum.kAppPackagePf]: 'Other',
    [MilestoneColumnsKeyEnum.kAppPackageSys]: 'AOS',
    [MilestoneColumnsKeyEnum.kCountryGroup]: 'Other',
    [MilestoneColumnsKeyEnum.kMediaSourceGroup]: 'Other',
    [MilestoneColumnsKeyEnum.kTargetCost]: 3076923.08,
    [MilestoneColumnsKeyEnum.kTargetUsd]: 8000,
  },
];
