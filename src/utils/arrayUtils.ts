import { isEmpty, isNumber, isString } from '/@/utils/is';
const localSortAsc = (a: string, b: string) => {
  try {
    return a.localeCompare(b, 'kf', { sensitivity: 'variant' });
  } catch (e) {
    debugger;
    console.error(e);
    return 0;
  }
};
const localSortDesc = (a: string, b: string) => {
  return a.localeCompare(b, 'kf', { sensitivity: 'variant' });
};
const numSortAsc = (a: number, b: number) => {
  return a - b;
};
const numSortDesc = (a: number, b: number) => {
  return b - a;
};

type sortDirectionsType = 'ascend' | 'descend';
export function arrSortFn<T = any>(
  oriList: T[],
  sortValueKey: string | '',
  sortDir: sortDirectionsType,
): T[] {
  if (isEmpty(oriList)) {
    return [];
  }
  // @ts-ignore
  const sortArr: any[] = oriList.slice();
  const item = oriList[0];
  if (isString(item)) {
  } else {
    if (!sortValueKey) {
      console.error('排序数组不是字符串，没有提供valueKey');
      return oriList;
    }
    const value: any = item[sortValueKey] || '';
    if (isNumber(value)) {
      sortArr.sort((a: any, b: any) => {
        if (sortDir === 'ascend') {
          return numSortAsc(a[sortValueKey] * 1, b[sortValueKey] * 1);
        } else {
          return numSortDesc(a[sortValueKey] * 1, b[sortValueKey] * 1);
        }
      });
    } else {
      sortArr.sort((a: any, b: any) => {
        if (sortDir === 'ascend') {
          return localSortAsc(a[sortValueKey] + '' || '', b[sortValueKey] + '' || '');
        } else {
          return localSortDesc(a[sortValueKey] + '' || '', b[sortValueKey] + '' || '');
        }
      });
    }
  }
  return sortArr;
}
/**
 * 取出嵌套数组(多维)中的所有元素放到一个新数组(一维)中
 * 递归方式
 * @param {*} arr
 */
export function flattenFn(arr) {
  let result = [...arr];
  // 判断result里有没有子数组
  while (result.some((item) => Array.isArray(item))) {
    result = [].concat(...result);
  }
  return result;
}
