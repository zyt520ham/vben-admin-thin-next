//同步加载脚本
import { ITaInstance } from '/#/thinkdata';
import { isDevMode } from '/@/utils/env';

// const modules = import.meta.globEager('./thinkingdata.esm.min.js');
// const td = modules['./thinkingdata.esm.min.js'];
import td from './thinkingdata.esm.min.js';
console.log('thinkingdata', td);
//数数私服
const shushuServerUrl = 'https://tatracker-us.rivergame.net';
//数数项目id
let shushuBIAppId = 'b41f8ed156a74064ba248ca83ebd5d38';
if (!isDevMode()) {
  shushuBIAppId = '45d3c9c8be704dc7bac74132c1420d80';
}
td.init({
  appId: shushuBIAppId,
  serverUrl: `${shushuServerUrl}/sync_js`,
});
const tdIns: ITaInstance = td as any;
export default tdIns;
