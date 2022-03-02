import { BasicColumn, FormSchema } from '/@/components/Table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '角色名称',
      dataIndex: 'description',
      fixed: 'left',
      width: '120px',
      // slots: { customRender: 'id' },
    },
    {
      title: '权限字符',
      dataIndex: 'role',
      width: '120px',
      slots: { customRender: 'role' },
    },
    {
      title: '显示顺序',
      dataIndex: 'order_num',
      // sorter: (a, b) => {
      //   return a.order_num - b.order_num;
      // },
      sorter: true,
      width: '120px',
    },
    {
      title: '角色状态',
      dataIndex: 'useStatus',
      width: '120px',
      sorter: true,
    },
    {
      title: '创建时间',
      width: '120px',
      sorter: true,
      dataIndex: 'cTime',
    },
    {
      title: '修改时间',
      width: '120px',
      sorter: true,
      dataIndex: 'uTime',
    },
  ];
}

export function getBasicData() {
  const data: any = (() => {
    const arr: any = [
      {
        description: 'ADMIN',
        order_num: 0,
        role: 'root_role',
      },
      {
        description: '超级管理员',
        order_num: 2,
        role: 'topmanager',
      },
      {
        description: '运营',
        order_num: 3,
        role: 'operater',
      },
      {
        description: '市场',
        order_num: 4,
        role: 'marketer',
      },
      {
        description: '视频制作',
        order_num: 5,
        role: 'videorediter',
      },
    ];
    // for (let index = 0; index < 40; index++) {
    //   arr.push({
    //     id: `${index}`,
    //     name: 'John Brown',
    //     age: `1${index}`,
    //     no: `${index + 10}`,
    //     address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
    //     beginTime: new Date().toLocaleString(),
    //     endTime: new Date().toLocaleString(),
    //   });
    // }
    return arr;
  })();
  return data;
}
export const getformSchamas = (): FormSchema[] => {
  return [
    {
      field: 'roleName',
      component: 'Input',
      label: '角色名称',
      slot: 'slotField1',
      colProps: {
        span: 8,
      },
    },
    {
      field: 'roleId',
      component: 'Input',
      label: '权限字符',
      colProps: {
        span: 8,
      },
      slot: 'slotField2',
    },
    {
      field: 'useStatus',
      component: 'DatePicker',
      label: '状态',
      colProps: {
        span: 8,
      },
      slot: 'slotField3',
    },
    {
      field: 'cTime',
      component: 'Select',
      label: '创建时间',
      colProps: {
        span: 8,
      },
      slot: 'slotField4',
    },
  ];
};
