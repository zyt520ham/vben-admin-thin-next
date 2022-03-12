/**
 * @description: Login interface parameters
 */

export interface LoginParams {
  username: string;
  password: string;
}

export interface ILoginParams {
  /** 用户名 */
  account: string;
  /** 密码 */
  password: string;
}
/** login 返回的数据info */
export interface ILoginServerData {
  login_token: string;
  account: string;
  user_id: number;
  project: string;
}
export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

export interface IUserInfoParams {
  user_id: number;
}
/** 服务端返回的userinfo */
export interface IUserItemServerData {
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
}

/** 管理员重置user密码参数*/
export interface IReqUserPsdResetByAdmin {
  user_id: number;
  new_password: string;
}
/** 管理员ban user 参数*/
// declare interface IReqUserBanByAdmin {
//   user_id: number;
//   ban: boolean;
// }

export interface IReqUpdateUserInfo {
  nickname?: string;
  email?: string;
  phone?: string;
  sex?: number;
  avatar?: string;
}

/** 用户修改密码接口 */
export interface IReqUpdateUserPsd {
  old_password: string;
  new_password: string;
}
