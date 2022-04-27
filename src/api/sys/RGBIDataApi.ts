// import { RequestOptions } from '/#/axios';
// import { doBaseApiRequest } from '/@/utils/http/NetworkEngine';
// import { ApiEnum } from '/@/api/ApiPath';
import { IPRestParams, ISearchRequestParams, IWhereItem } from '/@/api/model/biPrestModel';
import { webpRestHttp } from '/@/utils/http/axios';

/**
 * @description: 获取里程碑V2版本上传的配置单列表
 */
export const getCfgForMilestoneUploadedApi = (
  params: ISearchRequestParams,
  // options?: RequestOptions = {},
) => {
  const webPRestParams = parseSearchParams(params);
  return doGetRequest('us_data/public/' + params.table, webPRestParams);
  // return doBaseApiRequest<any>('/tripartite/biprest', params, options);
};

function parseSearchParams(params: ISearchRequestParams) {
  const fieldsStringList: string[] = [];
  const groupByList: string[] = [];
  params.fields.map((ele) => {
    if (ele.function === 'unuse') {
      if (ele.noCaseEndCustomFunc) {
        fieldsStringList.push(`${ele.noCaseEndCustomFunc} as "${ele.showName}"`);
      } else if (ele.customFunc) {
        fieldsStringList.push(`case ${ele.customFunc} end as "${ele.showName}"`);
      } else if (ele.useAliasFunc) {
        fieldsStringList.push(`${ele.useAliasFunc}`);
      } else {
        fieldsStringList.push(`${ele.sqlName} as ${ele.showName || ele.sqlName}`);
        groupByList.push(`${ele.sqlName}`);
      }
    } else {
      fieldsStringList.push(`${ele.function}(${ele.sqlName}) as ${ele.showName || ele.sqlName}`);
    }
    return ele;
  });
  let selectString = '';
  if (fieldsStringList.length > 0) {
    selectString = fieldsStringList.join(',');
  }
  let groupByString = '';
  if (params.groupby && params.groupby.length > 0) {
    groupByString = params.groupby.join(',');
  } else {
    groupByString = groupByList.join(',');
  }

  const tempParams: IPRestParams = {
    _select: selectString,
  };
  if (groupByString) {
    tempParams._groupby = groupByString;
  }
  tempParams._page = params.page || 1;
  tempParams._page_size = params.pageSize || 1000;
  const tWhereParamsList: { [key: string]: string | number }[] = normalWheres2PRestWheres(
    params.where || [],
  );
  const whereQuerys = pRestWhereParams2whereQuerys(tWhereParamsList);
  if (whereQuerys) {
    tempParams.whereQuerys = whereQuerys;
  }
  if (params.orderby && params.orderby.length > 0) {
    let orderMark = '';
    if (params.orderby[0].type === 'desc') {
      orderMark = '-';
    }
    tempParams._order = `${orderMark}${params.orderby[0].name}`;
  }
  return tempParams;
}

function normalWheres2PRestWheres(
  normalWheres: IWhereItem[],
): { [key: string]: string | number }[] {
  const tWhereParamsList: { [key: string]: string | number }[] = [];
  if (normalWheres && normalWheres.length > 0) {
    normalWheres.map((ele) => {
      const tempMap = {};
      if (ele.name) {
        let operator = '';
        if (ele.op === '=') {
          operator = '$eq';
        } else if (ele.op === '>') {
          operator = '$gt';
        } else if (ele.op === '<') {
          operator = '$lt';
        } else if (ele.op === '>=') {
          operator = '$gte';
        } else if (ele.op === '<=') {
          operator = '$lte';
        } else if (ele.op === 'in') {
          operator = '$in';
        } else if (ele.op === 'not in') {
          operator = '$nin';
        } else if (ele.op === 'ilike') {
          operator = '$ilike';
        } else if (ele.op === 'nlike') {
          operator = '$nlike';
        } else if (ele.op === 'nilike') {
          operator = '$nilike';
        }
        if (Array.isArray(ele.value)) {
          let arrValue = ele.value.join(',');
          arrValue = encodeURI(arrValue);
          tempMap[ele.name] = `${operator}.${arrValue}`;
        } else {
          tempMap[ele.name] = `${operator}.${encodeURI(ele.value)}`;
        }
        // tempMap[ele.name] = `${operator}.${ele.value}`
        tWhereParamsList.push(tempMap);
      }
      return ele;
    });
  }
  return tWhereParamsList;
}

function pRestWhereParams2whereQuerys(whereParams: { [key: string]: string | number }[]): string {
  let queryStr = '';
  if (whereParams && whereParams.length > 0) {
    whereParams.forEach((ele) => {
      //
      for (const eleKey in ele) {
        //
        if (eleKey) {
          if (queryStr !== '') {
            queryStr = queryStr + '&';
          }
          queryStr = queryStr + eleKey + '=' + ele[eleKey];
        }
      }
    });
  }
  return queryStr;
}

export function getPRestToken() {
  return new Promise<string>((resolve, reject) => {
    const url = 'https://biapi.rivergame.net/token/getSelfToken?password=dfzwjyq';
    webpRestHttp
      .get({
        url: url,
      })
      .then((res) => {
        const resData: any = res;

        if (resData && resData.code === 1) {
          resolve && resolve(resData.data);
        } else {
          reject && reject(null);
        }
      })
      .catch((err: Error) => {
        console.error('getPRestToken err:', err);
        reject && reject(null);
      });
  });
}

export async function doGetRequest(tablePath: string, params: IPRestParams) {
  const token = await getPRestToken();
  if (!token) {
    console.error('getPRestToken 失败');
  }
  let queryString = '';
  for (const key in params) {
    if (key && key !== 'whereQuerys') {
      if (queryString !== '') {
        queryString = queryString + '&';
      }
      queryString = queryString + key + '=' + params[key];
    }
  }
  if (params.whereQuerys) {
    queryString = queryString + `&${params.whereQuerys}`;
  }
  const getUrl = `https://biprest-us.rivergame.net/${tablePath}?${queryString}`;
  return new Promise<any>((resolve, reject) => {
    webpRestHttp
      .get({
        url: getUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        console.log('【Url】:', getUrl, resp);
        resolve(resp);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
}
