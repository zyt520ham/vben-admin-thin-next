import { BasicColumn, FormSchema } from '/@/components/Table';

export const getProjsColumnsCfg: BasicColumn[] = [
  {
    title: '项目id',
    dataIndex: 'project_id',
    width: '150px',
    slots: { customRender: 'colProjectsId' },
    sorter: true,
  },
  {
    title: '项目名称',
    dataIndex: 'project_name',
    width: '150px',
    sorter: true,
    slots: { customRender: 'colProjectName' },
  },
  {
    title: '项目顺序',
    dataIndex: 'order_num',
    width: '120px',
    sorter: true,
    slots: {
      customRender: 'colOrderNum',
    },
  },
  {
    title: '项目状态',
    dataIndex: 'state',
    width: '120px',
    sorter: true,
    slots: {
      customRender: 'colState',
    },
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    width: '120px',
    sorter: true,
    slots: {
      customRender: 'colCreateTime',
    },
  },
];
export const projectsList = [
  {
    project_id: 'proj_ceshi2',
    project_name: '测试20',
    game_name: '测试20',
    order_num: 0,
    state: 0,
    created_at: 1642688356,
    updated_at: 1642746432,
  },
  {
    project_id: 'proj_ceshi1',
    project_name: '测试1',
    game_name: '测试123',
    order_num: 5,
    state: 1,
    created_at: 1642679835,
    updated_at: 1642688377,
  },
  {
    project_id: 'proj_z5',
    project_name: 'Zgrils5',
    game_name: 'Zgrils5',
    order_num: 0,
    state: 0,
    created_at: 1640662331,
    updated_at: 1640662331,
    roleObj: {
      roleList: [
        {
          role: 'operater',
          name: '运营',
        },
        {
          role: 'marketer',
          name: '市场',
        },
        {
          role: 'videorediter',
          name: '视频制作',
        },
        {
          role: 'topmanager',
          name: '超级管理员',
        },
        {
          role: 'root_role',
          name: 'ADMIN',
        },
      ],
      roleMap: {
        operater: {
          role: 'operater',
          name: '运营',
        },
        marketer: {
          role: 'marketer',
          name: '市场',
        },
        videorediter: {
          role: 'videorediter',
          name: '视频制作',
        },
        topmanager: {
          role: 'topmanager',
          name: '超级管理员',
        },
        root_role: {
          role: 'root_role',
          name: 'ADMIN',
        },
      },
    },
  },
  {
    project_id: 'proj_topwar',
    project_name: 'Topwar',
    game_name: 'Topwar',
    order_num: 0,
    state: 0,
    created_at: 1640662117,
    updated_at: 1640662117,
  },
  {
    project_id: 'base',
    project_name: '初始项目',
    game_name: '初始项目',
    order_num: 0,
    state: 0,
    created_at: 1632827287,
    updated_at: 1632827287,
  },
];
export const getSearchFormCfg: FormSchema[] = [
  {
    field: 'project_id',
    label: '项目Id',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'project_name',
    label: '项目名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '项目状态',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'order_num',
    label: '项目顺序',
    component: 'InputNumber',
    colProps: { span: 8 },
  },
  {
    field: 'created_at',
    label: '创建时间',
    component: 'DatePicker',
    colProps: { span: 8 },
  },
];

export const getEditProjFormCfg: FormSchema[] = [
  {
    field: 'project_id',
    label: '项目Id',
    dynamicDisabled: true,
    component: 'Input',
    // colProps: { span: 8 },
  },
  {
    field: 'project_name',
    label: '项目名称',
    component: 'Input',
    // colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '项目状态',
    dynamicDisabled: true,
    component: 'Input',
    // colProps: { span: 8 },
  },
  {
    field: 'order_num',
    label: '项目顺序',
    component: 'InputNumber',
    // colProps: { span: 8 },
  },
];

export enum editProjFormColEnum {
  kProjId = 'project_id',
  kProjName = 'project_name',
  kProjOrder = 'order_num',
  kProjStatus = 'state',
}
