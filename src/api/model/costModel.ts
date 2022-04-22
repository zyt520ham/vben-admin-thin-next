export interface IReqGetWxCost {
  app: string;
}

export interface IReqGetLineCost {
  app: string;
}

export interface IReqGetMilestoreCfg {
  type: 'apppackage' | 'country' | 'mediasource' | 'config';
}
