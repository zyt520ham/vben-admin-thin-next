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
