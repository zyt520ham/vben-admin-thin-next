import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDate } from '/@/utils/dateUtil';
import moment from 'moment';
import { wxCostTableColumnsEnum } from '/@/views/rg/cost-upload/wx-cost-upload/inner/wxcost.data';

export const lineUploadDatesList = [
  '00010101',
  '20210514',
  '20210515',
  '20210516',
  '20210517',
  '20210518',
  '20210519',
  '20210520',
  '20210521',
  '20210522',
  '20210523',
  '20210524',
  '20210525',
  '20210526',
  '20210527',
  '20210528',
  '20210529',
  '20210530',
  '20210531',
  '20210601',
  '20210602',
  '20210603',
  '20210604',
  '20210605',
  '20210606',
  '20210607',
  '20210608',
  '20210609',
  '20210610',
  '20210611',
  '20210612',
  '20211105',
  '20211106',
  '20211107',
  '20211108',
  '20211109',
  '20211110',
  '20211111',
  '20211112',
  '20211113',
  '20211114',
  '20211115',
  '20211116',
  '20211117',
  '20211118',
  '20211119',
  '20211120',
  '20211121',
  '20211122',
  '20211123',
  '20211124',
];

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
