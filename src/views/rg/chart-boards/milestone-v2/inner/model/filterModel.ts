import { IWhereItem } from '/@/api/model/biPrestModel';

export class MileStoneFilterModel {
  constructor() {
    this.filterMap = {};
    this.filterKeys = [];
    this.filterOptionsMap = undefined;
  }
  private static instance: Nullable<MileStoneFilterModel>;
  public static getInstance() {
    if (!MileStoneFilterModel.instance) {
      MileStoneFilterModel.instance = new MileStoneFilterModel();
    }
    return MileStoneFilterModel.instance;
  }
  public filterMap: { [key: string]: IWhereItem };
  public filterKeys: string[];

  public filterOptionsMap: any;
  public getSelectedIsEmpty() {
    if (this.filterKeys.length === 0) {
      return true;
    }
  }
}
