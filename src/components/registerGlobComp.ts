import type { App } from 'vue';
// import { Button } from './Button';
// import {
//   // Need
//   Button as AntButton,
//   Input,
//   Layout,
// } from 'ant-design-vue';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

// const compList = [AntButton.Group];
import BinDatav from 'bin-datav';
import 'bin-datav/lib/styles/index.css';

export function registerGlobComp(app: App) {
  app.use(Antd);
  app.use(BinDatav);
  // compList.forEach((comp) => {
  //   app.component(comp.name || comp.displayName, comp);
  // });
  //
  // app.use(Input).use(Button).use(Layout);
}
