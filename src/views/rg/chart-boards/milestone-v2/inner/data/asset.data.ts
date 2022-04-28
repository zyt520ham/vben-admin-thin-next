import { BasicColumn } from '/@/components/Table';
import { stringFormatRounder } from '/@/utils/stringUtils';

export enum assetTableColumnsKey {
  kStartTime = 'startday',
  kAppPackage = 'app_package_group',
  /** 素材 {STRING} */
  kAsset = 'asset',
  /** 创意 {STRING} */
  kIdea = 'idea',
  /** 制作 {STRING} */
  kMaker = 'maker',
  /** 花费 {DOUBLE} */
  kCost = 'cost',
  KCostRatio = 'cost_ratio',
}
export const getAssetsColumnsCfg: BasicColumn[] = [
  {
    title: '素材',
    dataIndex: assetTableColumnsKey.kAsset,
    width: '300px',
    // slots: { customRender: 'colUserId' },
    format: (text) => {
      return text;
    },
    sorter: (a, b) => {
      return a[assetTableColumnsKey.kAsset].localeCompare(b[assetTableColumnsKey.kAsset]);
    },
  },
  {
    title: '创意',
    dataIndex: assetTableColumnsKey.kIdea,
    width: '70px',
    sorter: (a, b) => {
      return a[assetTableColumnsKey.kIdea].localeCompare(b[assetTableColumnsKey.kIdea]);
    },
  },
  {
    title: '制作',
    dataIndex: assetTableColumnsKey.kMaker,
    width: '70px',
    sorter: (a, b) => {
      return a[assetTableColumnsKey.kMaker].localeCompare(b[assetTableColumnsKey.kMaker]);
    },
  },
  {
    title: '花费',
    dataIndex: assetTableColumnsKey.kCost,
    align: 'right',
    width: '120px',
    sorter: (a, b) => {
      return b[assetTableColumnsKey.kCost] - a[assetTableColumnsKey.kCost];
    },
    format: (text) => {
      return stringFormatRounder(text, 2);
    },
  },
  {
    title: '花费占比',
    dataIndex: assetTableColumnsKey.KCostRatio,
    align: 'right',
    width: '120px',
    sorter: (a, b) => {
      return b[assetTableColumnsKey.kCost] - a[assetTableColumnsKey.kCost];
    },
    format: (text) => {
      return stringFormatRounder(text, 2, true);
    },
  },
];
