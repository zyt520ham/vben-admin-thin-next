import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { formatToDate } from '/@/utils/dateUtil';
import moment from 'moment';

export const getformSchemas = (): FormSchema[] => {
  return [
    {
      field: wxCostTableColumnsEnum.kUploadDate,
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
      },
      label: '上传日期',
      // slot: 'slotField1',
      colProps: {
        span: 8,
      },
    },
  ];
};
export enum wxCostTableColumnsEnum {
  kUploadDate = 'upload_date',
  kWxAccount = 'wx_account',
}
export const getWxCostColumnsCfg: BasicColumn[] = [
  {
    title: '上传日期',
    dataIndex: wxCostTableColumnsEnum.kUploadDate,
    width: '150px',
    slots: { customRender: 'colProjectsId' },
    sorter: true,
    format: (text: string) => {
      return formatToDate(moment(text, 'YYYYMMDD'));
    },
  },
  {
    title: '已上传的WX账户id',
    dataIndex: wxCostTableColumnsEnum.kWxAccount,
    // width: '150px',
    sorter: false,
    slots: { customRender: 'colWxAccount' },
  },
];

export const wxAccountNameMaps = {
  '19160499': '口袋奇兵小游戏',
  '19247225': '口袋奇兵公众号',
  '20136111': '口袋奇兵Topwar',
  '23054122': '口袋奇兵TOPWAR',
  '19161124': '精品游戏榜',
};
const getAccountListOptions = () => {
  const resultList: { label: string; value: string }[] = [];
  const keyList = Object.keys(wxAccountNameMaps);
  keyList.map((key) => {
    resultList.push({
      value: key,
      label: `${wxAccountNameMaps[key]}[${key}]`,
    });
  });

  return resultList;
};
export const wxUploadFormSchemas = (): FormSchema[] => {
  return [
    {
      field: 'file_type',
      required: true,
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            value: 'csv',
            label: 'CSV格式文件',
          },
        ],
      },
      label: '上传文件类型',
      // slot: 'slotFileType',
    },
    {
      field: 'upload_date',
      required: true,
      component: 'DatePicker',
      label: '上传日期',
      componentProps: {
        format: 'YYYY-MM-DD',
      },
    },
    {
      field: 'wx_account',
      required: true,
      component: 'Select',
      label: 'wx账号',
      componentProps: {
        options: getAccountListOptions(),
      },
      // slot: 'slotField3',
    },
    {
      field: 'choose_file',
      required: true,
      component: 'Upload',
      label: '选择文件',
      slot: 'slotChooseFile',
      // colSlot: 'slotFormItemChooseFile',
    },
  ];
};
