import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDate } from '/@/utils/dateUtil';
import moment from 'moment';
import { wxCostTableColumnsEnum } from '/@/views/rg/cost-upload/wx-cost-upload/inner/wxcost.data';

export enum LineCostTableColumnsEnum {
  kUploadDate = 'upload_date',
}
export const getLineCostColumnsCfg: BasicColumn[] = [
  {
    title: '花费上传日期',
    dataIndex: LineCostTableColumnsEnum.kUploadDate,
    slots: { customRender: 'colUploadDate' },
    sorter: true,
    format: (text: string) => {
      return formatToDate(moment(text, 'YYYYMMDD'));
    },
  },
];

export const getLineCostSearchFormSchemas = (): FormSchema[] => {
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

export const lineUploadFormSchemas = (): FormSchema[] => {
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
      field: 'update_date',
      required: true,
      component: 'DatePicker',
      label: '上传日期',
      componentProps: {
        format: 'YYYY-MM-DD',
      },
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
