import { FormSchema } from '/@/components/Form';

export const userInfoEditSchema: FormSchema[] = [
  {
    field: 'nickName',
    label: '昵称',
    component: 'Input',
    required: true,
  },
  {
    field: 'phoneNumber',
    label: '手机号',
    component: 'Input',
    componentProps: {
      placeholder: '新密码',
    },
    rules: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '请输入正确的手机号码',
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    rules: [
      {
        type: 'email',
        message: "'请输入正确的邮箱地址",
        trigger: ['blur', 'change'],
      },
    ],
  },
  {
    field: 'sex',
    label: '性别',
    component: 'InputPassword',
  },
];
