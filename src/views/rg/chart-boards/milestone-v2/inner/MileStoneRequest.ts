import { getMileStoneTableSqlField } from '/@/views/rg/chart-boards/milestone-v2/inner/milestone.data';
import { IFieldItemV1, ISearchRequestParams } from '/@/api/model/biPrestModel';
import { getCfgForMilestoneUploadedApi } from '/@/api/sys/RGBIDataApi';

export function getMileStones() {
  const tableName = 'ads_application_milestones_v2';
  const tmpFields: IFieldItemV1[] = [];
  for (const key in getMileStoneTableSqlField) {
    tmpFields.push(getMileStoneTableSqlField[key]);
  }
  const params: ISearchRequestParams = {
    table: tableName,
    fields: tmpFields,
  };

  return getCfgForMilestoneUploadedApi(params);
}
