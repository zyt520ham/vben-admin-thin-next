import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { RoleInfo } from '/@/api/sys/model/userModel';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface UserInfo {
  userId: string | number;
  username: string;
  realName: string;
  avatar: string;
  desc?: string;
  homePath?: string;
  roles: RoleInfo[];
}

export interface IUserInfo {
  user_id: number;
  account: string;
  nickname: string;
  password: string;
  phone: string;
  status: number;
  avatar: string;
  last_visit_ip: string;
  last_visit_at: number;
  last_pass_at: number;
  created_at: number;
  updated_at: number;
  user_binds: {
    '1': string;
    '2': string;
    '3': string;
  };
  user_meta: any;
  projects: string[];
  default_project: string;
  project_roles: string[];

  homePath?: string; //用户进入的首页
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
//  项目对象
export interface IProjectInfo {
  project_id: string;
  project_name: string;
  game_name: string;
  created_at: number;
  updated_at: number;
  order_num: number;
  state: number;
}
//  服务端RoleItem
export interface IRoleInfo {
  description: string;
  /** 角色id */
  role: string;
  order_num: number;
}
interface IProjRoles {
  projectId: string;
  projRoleList: IRoleInfo[];
  projRoleMap: { [key: string]: IRoleInfo };
}
