import { isEmpty, isNumber, isString } from '/@/utils/is';
const localSortAsc = (a: string, b: string) => {
  return a.localeCompare(b, 'kf', { sensitivity: 'variant' });
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
          return localSortAsc(a[sortValueKey] || '', b[sortValueKey] || '');
        } else {
          return localSortDesc(a[sortValueKey] || '', b[sortValueKey] || '');
        }
      });
    }
  }
  return sortArr;
}
