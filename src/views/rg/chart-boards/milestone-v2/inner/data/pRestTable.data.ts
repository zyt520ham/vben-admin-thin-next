import { IFieldItemV1 } from '/@/api/model/biPrestModel';
import { assetTableColumnsKey } from '/@/views/rg/chart-boards/milestone-v2/inner/data/asset.data';

import RGTableDefs from '/@/constants/RGTableDefs';

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
