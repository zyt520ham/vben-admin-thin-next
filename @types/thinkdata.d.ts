import { ITaEventName } from 'thinkingdata-node';

export {};
export interface ITaEvent {
  // accountId: optional 账号 ID
  accountId: string;
  // distinctId: optional 访客 ID，账号 ID 和访客 ID 不能同时为空
  distinctId?: string;
  //  event: required {string} 事件名称
  event: ITaEventName;
  // time: optional {Date} 事件时间
  time?: number;
  //ip: optional 事件发生的 IP 地址
  ip?: string;
  // properties: optional {object} 事件属性
  properties: InstanceType<typeof Object>;
  //callback {function} 回调, 参数为 Error 对象. 出错时会调用该回调
  callback?: (err: Error) => void;
}
export interface ITaInstance {
  login: (vAccountId: string) => void;
  logout: () => void;
  /**
   * 上报事件. 在上传事件数据（名称、属性）的时候，需要同时在参数对象中指明该事件关联的用户 ID.
   * 默认情况下，事件属性会经过本地检查，不符合预定设置的格式的数据将不会发起上报。在某些情况下，用户希望跳过本地检查，
   * 则需要传入 skipLocalCheck 参数，并将其值设为 true.
   * @param {string} eventName 事件相关参数
   * @param {ITaEvent} properties 跳过本地属性检查
   */
  track: (eventName: string, properties?: InstanceType<typeof Object>) => void;
}
