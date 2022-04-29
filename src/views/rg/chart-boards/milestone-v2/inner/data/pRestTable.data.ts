import { IFieldItemV1 } from '/@/api/model/biPrestModel';
import { assetTableColumnsKey } from '/@/views/rg/chart-boards/milestone-v2/inner/data/asset.data';

import RGTableDefs from '/@/constants/RGTableDefs';
import { MilestoneColumnsKeyEnum } from '/@/views/rg/chart-boards/milestone-v2/inner/data/milestone.data';

export const assetTableFields: { [key: string]: IFieldItemV1 } = {
  [assetTableColumnsKey.kAsset]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2Asset.tableColumnsEnum.kAsset,
    showName: assetTableColumnsKey.kAsset,
    function: 'unuse',
  },
  [assetTableColumnsKey.kIdea]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2Asset.tableColumnsEnum.kIdea,
    showName: assetTableColumnsKey.kIdea,
    function: 'unuse',
  },
  [assetTableColumnsKey.kMaker]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2Asset.tableColumnsEnum.kMaker,
    showName: assetTableColumnsKey.kMaker,
    function: 'unuse',
  },
  [assetTableColumnsKey.kCost]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2Asset.tableColumnsEnum.kCost,
    showName: assetTableColumnsKey.kCost,
    function: 'sum',
  },
  [assetTableColumnsKey.KCostRatio]: {
    sqlName: assetTableColumnsKey.KCostRatio,
    showName: assetTableColumnsKey.KCostRatio,
    function: 'unuse',
    customFunc: `
      when ( sum(${RGTableDefs.AdsApplicationMilestonesV2Asset.tableColumnsEnum.kCost}) )
      then ( sum(${RGTableDefs.AdsApplicationMilestonesV2Asset.tableColumnsEnum.kCost}) / sum(${RGTableDefs.AdsApplicationMilestonesV2Asset.tableColumnsEnum.kCost}) )
      else 0
    `,
    customFuncFormat: (allCost: number) => {
      return `when ( ${allCost} > 0 )
      then ( sum(${RGTableDefs.AdsApplicationMilestonesV2Asset.tableColumnsEnum.kCost}) /  ${allCost} )
      else 0`;
    },
  },
};

export const getMileStoneTableSqlField: { [key: string]: IFieldItemV1 } = {
  [MilestoneColumnsKeyEnum.kStartDay]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2.tableColumnsEnum.kStartDay,
    showName: MilestoneColumnsKeyEnum.kStartDay,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kEndDay]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2.tableColumnsEnum.kEndDay,
    showName: MilestoneColumnsKeyEnum.kEndDay,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kStepDay]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2.tableColumnsEnum.kStepDay,
    showName: MilestoneColumnsKeyEnum.kStepDay,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kStepEndDay]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2.tableColumnsEnum.kStepEndDay,
    showName: MilestoneColumnsKeyEnum.kStepEndDay,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kCountryGroup]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2.tableColumnsEnum.kCountryGroup,
    showName: MilestoneColumnsKeyEnum.kCountryGroup,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kAppPackageGroup]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2.tableColumnsEnum.kAppPackageGroup,
    showName: MilestoneColumnsKeyEnum.kAppPackageGroup,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kAppPackageSys]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2.tableColumnsEnum.kAppPackageSys,
    showName: MilestoneColumnsKeyEnum.kAppPackageSys,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kAppPackagePf]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2.tableColumnsEnum.kAppPackagePf,
    showName: MilestoneColumnsKeyEnum.kAppPackagePf,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kMediaSourceGroup]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2.tableColumnsEnum.kMediaSourceGroup,
    showName: MilestoneColumnsKeyEnum.kMediaSourceGroup,
    function: 'unuse',
  },
  [MilestoneColumnsKeyEnum.kTargetUsd]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2.tableColumnsEnum.kTargetUsd,
    showName: MilestoneColumnsKeyEnum.kTargetUsd,
    function: 'sum',
  },
  [MilestoneColumnsKeyEnum.kTargetCost]: {
    sqlName: RGTableDefs.AdsApplicationMilestonesV2.tableColumnsEnum.kTargetCost,
    showName: MilestoneColumnsKeyEnum.kTargetCost,
    function: 'sum',
  },
};
