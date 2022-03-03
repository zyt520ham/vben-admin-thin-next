import { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import { TooltipProps } from 'ant-design-vue/es/tooltip/Tooltip';
import { RoleEnum } from '/@/enums/roleEnum';
export interface ActionItem extends ButtonProps {
  onClick?: Fn;
  label?: string;
  color?: 'success' | 'error' | 'warning';
  icon?: string;
  // 按钮类型
  popConfirm?: PopConfirm;
  disabled?: boolean;
  // 是否显示分隔线，v2.0.0+
  divider?: boolean;
  // 权限编码控制是否显示
  auth?: RoleEnum | RoleEnum[] | string | string[];
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean);
  tooltip?: string | TooltipProps;
}

export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: Fn;
  cancel?: Fn;
  icon?: string;
}
