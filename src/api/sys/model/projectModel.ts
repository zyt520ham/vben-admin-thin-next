import { IUserInfo } from '/#/store';

export interface IProjectListReq {
  page?: number;
  page_size?: number;
}

export interface IProjectDataItem {
  project_id: string;
  project_name: string;
  game_name: string;
  created_at: number;
  updated_at: number;
  order_num: number;
  state: number;
}

export interface IRespProjectsData {
  list: IProjectDataItem[];
  total: number;
}
export interface IReqProjIncludeUsers {
  page: number;
  page_size: number;
  project_id: string;
}
export interface IRespProjsIncludeUsers {
  total: number;
  list: IUserInfo[];
}

//获取项目用户（当前，非当前）
export interface IReqGetProjUser {
  page: number;
  page_size: number;
  user_type?: string;
  /** 用户名搜索关键字 */
  account?: string;
  /** 状态 { number }（0-正常，1-禁用) */
  status?: number;
  /** 获取非当前项目用户 */
  not_auth_project?: 'yes';
}
export interface IRespProjUsers {
  total: number;
  list: IUserInfo[];
}

export interface IReqProjDelUser {
  user_id: string;
  cancel?: 'yes';
}
/**
 * user_id {string}  用户id，多个用户##隔开
 * */
export interface IReqProjAddUsers {
  user_id: string;
  project_id: string;
}
