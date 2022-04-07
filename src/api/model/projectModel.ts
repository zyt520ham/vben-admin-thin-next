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
  /** 拉取所有项目用户 */
  all?: 'yes';
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
/** 修改项目info */
export interface IReqUpdateProjData {
  project_id: string;
  project_name?: string;
  game_name?: string;
  order_num?: number;
  state?: number;
}
/** 修改项目状态 0-有效 1-无效*/
export interface IReqUpdateProjState {
  project_id: string;
  state?: number;
}
