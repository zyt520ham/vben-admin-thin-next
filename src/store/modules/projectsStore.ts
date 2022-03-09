import { defineStore } from 'pinia';
import { IProjectInfo, IProjRoles, IRoleInfo } from '/#/store';
import { getProjsListApi } from '/@/api/sys/projectApi';
import { IProjectListReq, IRespProjectsData } from '/@/api/sys/model/projectModel';
import { store } from '/@/store';
import { getRoleListApi } from '/@/api/sys/roleApi';
import { IReqGetRoles, IRespRolesListData } from '/@/api/sys/model/roleModel';
import { useUserStoreWithOut } from '/@/store/modules/user';
// interface IProjectModel {
//   projectId: string;
//   projectInfo: IProjectInfo;
//   roleInfo: {
//     rolesList: IRoleInfo[];
//     rolesMap: { [key: string]: IRoleInfo };
//   };
// }

interface ProjectsStore {
  projectsList: IProjectInfo[];
  projectsMap: { [key: string]: IProjectInfo };
  rolesList: IProjRoles[];
  rolesMap: { [key: string]: IProjRoles };
}

export const useProjsStore = defineStore({
  id: 'app-projects',
  state: (): ProjectsStore => ({
    projectsList: [],
    projectsMap: {},
    rolesList: [],
    rolesMap: {},
  }),
  getters: {
    getAllProjs(): IProjectInfo[] {
      return this.projectsList.slice();
    },
    getAllProjectsMap(): { [key: string]: IProjectInfo } {
      return this.projectsMap;
    },
    getCurrentProjRoles(): IRoleInfo[] {
      const projId = useUserStoreWithOut().getLoginInfo?.project || '';
      const item = this.rolesMap[projId];
      if (item) {
        return item.projRoleList.slice();
      } else {
        return [];
      }
    },
  },
  actions: {
    async checkAllProjects() {
      if (this.getAllProjs.length === 0) {
        //当前还没有拉取到projs
        await this.doSomethingConcurrent();
      } else {
      }
    },
    async doSomethingConcurrent() {
      const p1 = this.getUsedProjectData();
      const p2 = this.getProjectRoles();
      await Promise.all([p1, p2]);
    },
    async getUsedProjectData() {
      return new Promise<any>(async () => {
        const params: IProjectListReq = {};
        const promise: Promise<IRespProjectsData> = getProjsListApi(params);
        const projects = await promise;
        this.setProjects(projects.list);
        // log('projs:', projects.list);
      });
    },
    async getProjectRoles(projectId?: string) {
      const params: IReqGetRoles = {};
      if (projectId) {
        params.project_id = projectId;
      }
      const promise: Promise<IRespRolesListData> = getRoleListApi(params);
      const roleData = await promise;
      console.log(promise);
      let requestProjectId: string = useUserStoreWithOut().getLoginInfo?.project || '';
      if (projectId) {
        requestProjectId = projectId;
      }

      this.setProjsRoleData(roleData.list, requestProjectId);
      // promise.response.params.project_id
      // log('roleData:', roleData.list);
    },
    resetState(): void {
      this.projectsList = [];
      this.projectsMap = {};
      this.rolesList = [];
      this.rolesMap = {};
    },
    //#region setter =================================
    setProjects(projects: IProjectInfo[]) {
      this.projectsList = projects.slice();
      projects.map((ele: IProjectInfo) => {
        this.projectsMap[ele.project_id] = ele;
      });
    },
    setProjsRoleData(roleData: IRoleInfo[], projectId: string) {
      const projRoleItem: IProjRoles = {} as IProjRoles;
      projRoleItem.projectId = projectId;
      projRoleItem.projRoleList = roleData.slice();
      const roleMap = {};
      roleData.map((ele) => {
        roleMap[ele.role] = ele;
      });
      projRoleItem.projRoleMap = roleMap;
      this.rolesList.push(projRoleItem);
      this.rolesMap[projRoleItem.projectId] = projRoleItem;
    },
    //#endregion
  },
});

// Need to be used outside the setup
export function useProjsStoreWithOut() {
  return useProjsStore(store);
}
