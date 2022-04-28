export interface IReqGetTableDatas extends Record<string, string | number | undefined> {
  table_name: string;
  /** 缓存过期时间 不传为0*/
  cache_expired?: number;
  _select: string;
  _groupby: string;
  _page: string;
  _page_size: string;
  _order: string;
  app?: string;
  zone?: string;
}

/** where 条件item*/
export interface IWhereItem {
  name: string;
  op: '=' | '>' | '<' | '>=' | '<=' | 'in' | 'not in' | 'ilike' | 'nlike' | 'nilike';
  value: string | string[];
  fieldName?: string;
}
export interface IHavingItem {
  name: string;
  op: '=' | '>' | '<' | '>=' | '<=' | 'in' | 'not in';
  value: string | string[];
}

/** 排序定义item */
export interface IOrderByItem {
  name: string;
  type: 'desc' | 'asc';
}
/** mysql 请求参数 */
export interface ISearchRequestParams {
  /** 数据表名称 */
  table: string;
  /** 查询条件集 */
  where?: IWhereItem[];
  /** 聚合字段查询条件集 */
  having?: IHavingItem[];
  /** 数据字段集 */
  fields: IFieldItemV1[];
  /** 数据分组集 */
  groupby?: string[];
  /** 排序字段及方式 */
  orderby?: IOrderByItem[];
  /** 是否使用新的数据表 1=使用新表 */
  adb?: number | undefined;
  limit?: number;
  page?: number;
  pageSize?: number;
}
/** pRest数据库 webpi参数 */
export interface IPRestParams extends Record<string, string | number | undefined> {
  // @ts-ignore
  _select?: string | undefined;
  // @ts-ignore
  _order?: string | undefined;

  // @ts-ignore
  _groupby?: string | undefined;
  // @ts-ignore
  _page?: number | undefined;
  // @ts-ignore
  _page_size?: number | undefined;
  /*where条件query拼接串*/
  // @ts-ignore
  whereQuerys?: string | undefined;
  // where条件。。
  [key: string]: string;
}
/** 字段定义V1版本*/
export interface IFieldItemV1 {
  sqlName: string;
  showName: string;
  function: 'sum' | 'avg' | 'max' | 'min' | 'median' | 'stddev' | 'variance' | 'unuse';
  /** 自定义字段value 值 */
  customFunc?: string;
  /** 自定义字段扩展，可由外部实现传参*/
  customFuncFormat?: (...args: any[]) => string;
  /** 无需嵌套 case end的自定义方法*/
  noCaseEndCustomFunc?: string;
  /** 使用别名替换的方式
   * TIME2MINITE:cols:callName
   * TIME@HOUR
   */
  useAliasFunc?: string;
}
