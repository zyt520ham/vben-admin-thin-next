import { defineStore } from 'pinia';
import { IProjectInfo, IRoleInfo } from '/#/store';
import { getProjsListApi } from '/@/api/sys/projectApi';
import { IProjectListReq } from '/@/api/sys/model/projectModel';
import { log } from '/@/utils/log';
interface IProjectModel {
  projectId: string;
  projectInfo: IProjectInfo;
  roleInfo: {
    rolesList: IRoleInfo[];
    rolesMap: { [key: string]: IRoleInfo };
  };
}

interface ProjectsStore {
  projectsList: IProjectModel[];
  projectsMap: { [key: string]: IProjectModel };
}

export const useLockStore = defineStore({
  id: 'app-lock',
  state: (): ProjectsStore => ({
    projectsList: [],
    projectsMap: {},
  }),
  getters: {},
  actions: {
    async getUsedProjectData() {
      return new Promise<any>(() => {
        const params: IProjectListReq = {};
        const projects = getProjsListApi(params);
        log('projs:', projects);
      });
    },
  },
});
