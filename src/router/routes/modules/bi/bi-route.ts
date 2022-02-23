import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');

const biroute: AppRouteModule = {
  path: '/bi',
  name: 'Bi',
  component: LAYOUT,
  redirect: '/frame/doc',
  meta: {
    orderNo: 1000,
    icon: 'ion:tv-outline',
    title: 'BI页面',
  },
  children: [
    {
      path: 'campaigntest',
      name: 'Campaigntest',
      component: IFrame,
      meta: {
        frameSrc:
          'https://bi-zgirls.rivergame.net/bitablev1/index.html#/campaigntestView1?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJpZCI6MSwibmFtZSI6ImJpcHJlc3QiLCJ1c2VybmFtZSI6ImJpcHJlc3QiLCJtZXRhZGF0YSI6bnVsbH0sImV4cCI6MTY0NTYwMjIyMywianRpIjoiMSIsImlhdCI6MTY0NTU4MDYyMywiaXNzIjoiMSJ9.icQthM3JxOlmNXvsMwcyzU_NzodzV8PfnSVxyK6UR_o',
        title: 'campaigntest',
      },
    },
    {
      path: 'page2345',
      name: 'Page2345',
      component: IFrame,
      meta: {
        frameSrc: 'https://www.2345.com',
        title: 'Page2345',
      },
    },
  ],
};
export default biroute;
