import { IWhereItem } from '/@/api/model/biPrestModel';

class MileStoneFilterModel {
  constructor() {
    this.filterMap = {};

    this.filterOptionsMap = undefined;
    window['filtermodel'] = this;
  }
  private static instance: Nullable<MileStoneFilterModel>;
  public static getInstance() {
    if (!MileStoneFilterModel.instance) {
      MileStoneFilterModel.instance = new MileStoneFilterModel();
    }
    return MileStoneFilterModel.instance;
  }
  public filterMap: { [key: string]: IWhereItem };
  public get filterKeys() {
    return Object.keys(this.filterMap);
  }

  public filterOptionsMap: any;
  public getSelectedIsEmpty() {
    if (this.filterKeys.length === 0) {
      return true;
    }
  }
}
export const useFilterModel = MileStoneFilterModel.getInstance();
