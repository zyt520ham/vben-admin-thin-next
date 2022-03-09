import { IRoleInfo } from '/#/store';

export interface IReqGetRoles {
  page?: number;
  page_size?: number;
  project_id?: string;
}
export interface IRespRolesListData {
  list: IRoleInfo[];
  total: number;
}
