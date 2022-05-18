//同步加载脚本
import { ITaInstance } from '/#/thinkdata';

const modules = import.meta.globEager('./thinkingdata.esm.min.js');
const td = modules['./thinkingdata.esm.min.js'];
// import td from './thinkingdata.esm.min.js';
console.log('thinkingdata', td);
const shushuServerUrl = 'https://tatracker-us.rivergame.net/sync_js';
//TODO:: 配置正式服 appid
const shushuBIAppId = 'b41f8ed156a74064ba248ca83ebd5d38';
td.default.init({
  appId: shushuBIAppId,
  serverUrl: shushuServerUrl,
});
const tdIns: ITaInstance = td.default as any;
export default tdIns;
