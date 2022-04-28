import { BasicColumn } from '/@/components/Table';
import { IFieldItemV1 } from '/@/api/model/biPrestModel';

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
    title: '里程碑开始日期',
    dataIndex: MilestoneColumnsKeyEnum.kStartDay,
    width: '70px',
    // slots: { customRender: 'colUserId' },
    format: (text) => {
      return text;
    },
    sorter: (a, b) => {
      return a[MilestoneColumnsKeyEnum.kStartDay].localeCompare(
        b[MilestoneColumnsKeyEnum.kStartDay],
      );
    },
  },
  {
    title: '阶段开始日期',
    dataIndex: MilestoneColumnsKeyEnum.kStepDay,
    width: '70px',
    sorter: (a, b) => {
      return a[MilestoneColumnsKeyEnum.kStepDay].localeCompare(b[MilestoneColumnsKeyEnum.kStepDay]);
    },
  },
  {
    title: '阶段结束日期',
    dataIndex: MilestoneColumnsKeyEnum.kStepEndDay,
    width: '70px',
    sorter: (a, b) => {
      return a[MilestoneColumnsKeyEnum.kStepEndDay].localeCompare(
        b[MilestoneColumnsKeyEnum.kStepEndDay],
      );
    },
  },
  {
    title: '包分组',
    dataIndex: MilestoneColumnsKeyEnum.kAppPackageGroup,
    width: '70px',
    sorter: (a, b) => {
      return a[MilestoneColumnsKeyEnum.kAppPackageGroup].localeCompare(
        b[MilestoneColumnsKeyEnum.kAppPackageGroup],
      );
    },
  },
  {
    title: '目标美元',
    dataIndex: MilestoneColumnsKeyEnum.kTargetCost,
    width: '70px',
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
  },
  {
    title: '国家分组',
    dataIndex: MilestoneColumnsKeyEnum.kCountryGroup,
    width: '70px',
  },
  {
    title: '媒体分组',
    dataIndex: MilestoneColumnsKeyEnum.kMediaSourceGroup,
    width: '70px',
  },
  {
    title: '达标花费',
    dataIndex: MilestoneColumnsKeyEnum.kTargetUsd,
    width: '70px',
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

export const getMileStoneTableSqlField: { [key: string]: IFieldItemV1 } = {
  [MilestoneColumnsKeyEnum.kStartDay]: {
    sqlName: MilestoneColumnsKeyEnum.kStartDay,
    showName: MilestoneColumnsKeyEnum.kStartDay,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kEndDay]: {
    sqlName: MilestoneColumnsKeyEnum.kEndDay,
    showName: MilestoneColumnsKeyEnum.kEndDay,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kStepDay]: {
    sqlName: MilestoneColumnsKeyEnum.kStepDay,
    showName: MilestoneColumnsKeyEnum.kStepDay,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kStepEndDay]: {
    sqlName: MilestoneColumnsKeyEnum.kStepEndDay,
    showName: MilestoneColumnsKeyEnum.kStepEndDay,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kAppPackageGroup]: {
    sqlName: MilestoneColumnsKeyEnum.kAppPackageGroup,
    showName: MilestoneColumnsKeyEnum.kAppPackageGroup,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kTargetUsd]: {
    sqlName: MilestoneColumnsKeyEnum.kTargetUsd,
    showName: MilestoneColumnsKeyEnum.kTargetUsd,
    function: 'sum',
  },
  [MilestoneColumnsKeyEnum.kTargetCost]: {
    sqlName: MilestoneColumnsKeyEnum.kTargetCost,
    showName: MilestoneColumnsKeyEnum.kTargetCost,
    function: 'sum',
  },
};
