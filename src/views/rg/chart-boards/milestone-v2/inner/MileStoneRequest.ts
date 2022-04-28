import { getMileStoneTableSqlField } from '/@/views/rg/chart-boards/milestone-v2/inner/data/milestone.data';
import { IFieldItemV1, ISearchRequestParams, IWhereItem } from '/@/api/model/biPrestModel';
import { getCfgForMilestoneUploadedApi } from '/@/api/sys/RGBIDataApi';
import { assetTableColumnsKey } from '/@/views/rg/chart-boards/milestone-v2/inner/data/asset.data';
import { assetTableFields } from '/@/views/rg/chart-boards/milestone-v2/inner/data/pRestTable.data';

export function getMileStones() {
  const tableName = 'ads_application_milestones_v2';
  const tmpFields: IFieldItemV1[] = [];
  for (const key in getMileStoneTableSqlField) {
    tmpFields.push(getMileStoneTableSqlField[key]);
  }
  const params: ISearchRequestParams = {
    table: tableName,
    fields: tmpFields,
  };

  return getCfgForMilestoneUploadedApi(params);
}

export function getAssetAllCost() {
  const useKeyList = [assetTableColumnsKey.kCost];
  const tableName = 'ads_application_milestones_v2_asset';
  const tmpFields: IFieldItemV1[] = [];
  useKeyList.map((ele) => {
    tmpFields.push(assetTableFields[ele]);
  });
  const tmpWheres: IWhereItem[] = [];
  const params: ISearchRequestParams = {
    table: tableName,
    fields: tmpFields,
    where: tmpWheres,
  };
  return getCfgForMilestoneUploadedApi(params);
}

export async function getAllCost() {
  return new Promise<number>(async (resolve, reject) => {
    const allCost: any = await getAssetAllCost();
    const allCostValue: number = allCost[0].cost || 0;
    if (allCostValue > 0) {
      resolve(allCostValue);
    } else {
      reject(new Error('get all cost error'));
    }
  });
}

/** 获取 素材花费占比*/
export async function getAssetRatioData(vAllCost = 0) {
  let allCostValue = 0;
  if (vAllCost > 0) {
    allCostValue = vAllCost;
  } else {
    try {
      allCostValue = await getAllCost();
    } catch (e) {}
  }

  if (allCostValue === 0) {
    return new Promise<any>((_, reject) => {
      reject(new Error('get all cost error'));
    });
  }
  const useKeyList = [
    assetTableColumnsKey.kAsset,
    assetTableColumnsKey.kCost,
    assetTableColumnsKey.KCostRatio,
  ];
  const tableName = 'ads_application_milestones_v2_asset';
  const tmpFields: IFieldItemV1[] = [];
  useKeyList.map((ele) => {
    tmpFields.push(assetTableFields[ele]);
    if (ele === assetTableColumnsKey.KCostRatio) {
      const field = assetTableFields[ele];
      if (field.customFuncFormat) {
        field.customFunc = field.customFuncFormat(allCostValue);
      }
    }
  });
  const tmpWheres: IWhereItem[] = [
    {
      name: assetTableColumnsKey.kCost,
      op: '>=',
      value: allCostValue * 0.003 + '',
    },
  ];
  const params: ISearchRequestParams = {
    table: tableName,
    fields: tmpFields,
    where: tmpWheres,
  };
  return getCfgForMilestoneUploadedApi(params);
}

export async function getIdeasRatioDate(vAllCost = 0) {
  let allCostValue = 0;
  if (vAllCost > 0) {
    allCostValue = vAllCost;
  } else {
    try {
      allCostValue = await getAllCost();
    } catch (e) {}
  }

  if (allCostValue === 0) {
    return new Promise<any>((_, reject) => {
      reject(new Error('get all cost error'));
    });
  }
  const useKeyList = [
    assetTableColumnsKey.kIdea,
    assetTableColumnsKey.kCost,
    assetTableColumnsKey.KCostRatio,
  ];
  const tableName = 'ads_application_milestones_v2_asset';
  const tmpFields: IFieldItemV1[] = [];
  useKeyList.map((ele) => {
    tmpFields.push(assetTableFields[ele]);
    if (ele === assetTableColumnsKey.KCostRatio) {
      const field = assetTableFields[ele];
      if (field.customFuncFormat) {
        field.customFunc = field.customFuncFormat(allCostValue);
      }
    }
  });
  const tmpWheres: IWhereItem[] = [];
  const params: ISearchRequestParams = {
    table: tableName,
    fields: tmpFields,
    where: tmpWheres,
  };
  return getCfgForMilestoneUploadedApi(params);
}
/** 制作人花费占比*/
export async function getMakesRatioDate(vAllCost = 0) {
  let allCostValue = 0;
  if (vAllCost > 0) {
    allCostValue = vAllCost;
  } else {
    try {
      allCostValue = await getAllCost();
    } catch (e) {}
  }

  if (allCostValue === 0) {
    return new Promise<any>((_, reject) => {
      reject(new Error('get all cost error'));
    });
  }
  const useKeyList = [
    assetTableColumnsKey.kMaker,
    assetTableColumnsKey.kCost,
    assetTableColumnsKey.KCostRatio,
  ];
  const tableName = 'ads_application_milestones_v2_asset';
  const tmpFields: IFieldItemV1[] = [];
  useKeyList.map((ele) => {
    tmpFields.push(assetTableFields[ele]);
    if (ele === assetTableColumnsKey.KCostRatio) {
      const field = assetTableFields[ele];
      if (field.customFuncFormat) {
        field.customFunc = field.customFuncFormat(allCostValue);
      }
    }
  });
  const tmpWheres: IWhereItem[] = [];
  const params: ISearchRequestParams = {
    table: tableName,
    fields: tmpFields,
    where: tmpWheres,
  };
  return getCfgForMilestoneUploadedApi(params);
}
