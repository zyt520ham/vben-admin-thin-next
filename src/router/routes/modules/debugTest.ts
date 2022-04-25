import { AppRouteRecordRaw } from '/@/router/types';
import { isDevMode } from '/@/utils/env';

export const TestRoute: AppRouteRecordRaw = {
  path: '/test1',
  name: 'Test1',
  component: () => import('/@/views/test/Test1.vue'),
  meta: {
    title: '测试组件',
    hideMenu: false,
  },
};
//测试milestoneRoute路由
export const MilestoneRoute: AppRouteRecordRaw = {
  path: '/milestone',
  name: 'Milestone',
  component: () => import('/@/views/rg/chart-boards/milestone-v2/MilestoneV2Boarder.vue'),
  meta: {
    title: '测试组件',
    hideMenu: false,
  },
};
const useList: any[] = [];
if (isDevMode()) {
  useList.push(...[TestRoute, MilestoneRoute]);
}
export const debugTestRoutes = useList;
