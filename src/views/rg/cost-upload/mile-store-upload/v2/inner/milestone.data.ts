import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDate } from '/@/utils/dateUtil';
import moment from 'moment';

export const getMileStoneColumns: BasicColumn[] = [
  {
    title: '文件名',
    dataIndex: 'name',
    sorter: (a: any, b: any) => {
      // return a.name - b.name;
      return a.name.localeCompare(b.names, 'kf', { sensitivity: 'variant' });
    },
  },
  {
    title: '上传日期',
    dataIndex: 'uploadTime',
    // slots: { customRender: 'colUploadDate' },
    sorter: (a, b) => {
      return a.uploadTime.localeCompare(b.uploadTime, 'kf', { sensitivity: 'variant' });
    },
    format: (text: string) => {
      return formatToDate(moment(text, 'YYYYMMDD'));
    },
  },
];

export const mileStoneV2UploadFormSchemas = (): FormSchema[] => {
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
      field: 'type',
      required: true,
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            value: 'config',
            label: '默认配置',
          },
          {
            value: 'country',
            label: '国家配置',
          },
          {
            value: 'apppackage',
            label: 'App包配置',
          },
          {
            value: 'mediasource',
            label: '媒体渠道配置',
          },
        ],
      },
      label: '里程碑文件类型',
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
