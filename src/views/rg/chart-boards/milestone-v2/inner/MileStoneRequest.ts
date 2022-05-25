import { IFieldItemV1, ISearchRequestParams, IWhereItem } from '/@/api/model/biPrestModel';
import { getCfgForMilestoneUploadedApi } from '/@/api/sys/RGBIDataApi';
import { assetTableColumnsKey } from '/@/views/rg/chart-boards/milestone-v2/inner/data/asset.data';
import {
  assetTableFields,
  getMileStoneTableSqlField,
} from '/@/views/rg/chart-boards/milestone-v2/inner/data/pRestTable.data';
import { useFilterModel } from '/@/views/rg/chart-boards/milestone-v2/inner/model/filterModel';

/** 获取里程碑列表 */
export function getMileStones() {
  const tableName = 'ads_application_milestones_v2';
  const tmpFields: IFieldItemV1[] = [];
  for (const key in getMileStoneTableSqlField) {
    tmpFields.push(getMileStoneTableSqlField[key]);
  }

  const wheres: IWhereItem[] = [...getGlobalWheres()];

  const params: ISearchRequestParams = {
    table: tableName,
    fields: tmpFields,
    where: wheres,
  };

  return getCfgForMilestoneUploadedApi(params);
}
export async function getAssetsList() {
  let allCostValue = 0;

  try {
    allCostValue = await getAllCost();
  } catch (e) {}

  if (allCostValue === 0) {
    return new Promise<any>((_, reject) => {
      reject(new Error('get all cost error'));
    });
  }
  const tableName = 'ads_application_milestones_v2_asset';
  const useKeyList = [
    assetTableColumnsKey.kAsset,
    assetTableColumnsKey.kCost,
    assetTableColumnsKey.kMaker,
    assetTableColumnsKey.kIdea,
    assetTableColumnsKey.KCostRatio,
  ];
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

/** 获取总花费api请求*/
function getAssetAllCostApi() {
  const useKeyList = [assetTableColumnsKey.kCost];
  const tableName = 'ads_application_milestones_v2_asset';
  const tmpFields: IFieldItemV1[] = [];
  useKeyList.map((ele) => {
    tmpFields.push(assetTableFields[ele]);
  });
  const tmpWheres: IWhereItem[] = getGlobalWheres();
  const params: ISearchRequestParams = {
    table: tableName,
    fields: tmpFields,
    where: tmpWheres,
  };
  return getCfgForMilestoneUploadedApi(params);
}
/** 获取 总花费 */
export async function getAllCost() {
  return new Promise<number>(async (resolve, reject) => {
    const allCost: any = await getAssetAllCostApi();
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
    ...getGlobalWheres(),
  ];
  const params: ISearchRequestParams = {
    table: tableName,
    fields: tmpFields,
    where: tmpWheres,
  };
  return getCfgForMilestoneUploadedApi(params);
}
/** 获取创意人花费占比*/
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
  const tmpWheres: IWhereItem[] = getGlobalWheres();
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
  const tmpWheres: IWhereItem[] = getGlobalWheres();
  const params: ISearchRequestParams = {
    table: tableName,
    fields: tmpFields,
    where: tmpWheres,
  };
  return getCfgForMilestoneUploadedApi(params);
}

function getGlobalWheres() {
  const globalWheres: IWhereItem[] = [];
  const modelIns = useFilterModel;
  if (modelIns.filterKeys.length > 0) {
    const keys = useFilterModel.filterKeys;
    keys.forEach((ele) => {
      const filterItem: {
        /** 配置单选/多选*/
        multType: 0 | 1;
        /** 选中值/过滤值*/
        useValueType: 0 | 1;
        values: (string | number)[];
      } = useFilterModel.filterMap[ele] as any;
      if (filterItem.values.length > 0) {
        const whereItem: IWhereItem = {
          fieldName: ele,
          name: ele,
          op: filterItem.useValueType === 0 ? 'in' : 'not in',
          value: filterItem.values.slice() as any,
        };
        globalWheres.push(whereItem);
      }
    });
  }
  return globalWheres;
}

//#region 获取列数据 =================================
function getColValues(field: string) {
  const tableName = 'ads_application_milestones_v2';
  const tmpFields: IFieldItemV1[] = [getMileStoneTableSqlField[field]];
  const tmpWheres: IWhereItem[] = [];
  const params: ISearchRequestParams = {
    table: tableName,
    fields: tmpFields,
    where: tmpWheres,
  };
  return getCfgForMilestoneUploadedApi(params);
}

export function getColsValues(fields: string[]) {
  return new Promise<any>(async (resolve, reject) => {
    const promisList: Promise<any>[] = [];
    fields.forEach((ele) => {
      const p = getColValues(ele);
      promisList.push(p);
    });
    let allValues: any[] = [];
    try {
      allValues = await Promise.all(promisList);
    } catch (e) {
      reject('load values err');
    }
    const valueMap: any = {};
    allValues.forEach((ele: any[], index: number) => {
      const pValueList: any[] = [];
      ele.map((eleItem) => {
        if (eleItem[fields[index]]) {
          pValueList.push(eleItem[fields[index]]);
        }
      });
      pValueList.sort((a, b) => (b || '').localeCompare(a || ''));
      valueMap[fields[index]] = pValueList;
    });
    resolve(valueMap);
  });
}

//#endregion  -------------------------------------
