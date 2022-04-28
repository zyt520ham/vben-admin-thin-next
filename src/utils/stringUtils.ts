import MD5 from '/@/utils/lib/Md5.lib';
const _md5 = new MD5();
export function stringFormatRounder(targetString: any, decimalCount = 0, usePercent = false) {
  const multiplierNumber = usePercent ? 100 : 1;
  const fractionDigits = decimalCount;
  const stringValue = targetString * multiplierNumber;
  const string = `${stringValue.toFixed(fractionDigits)}${usePercent ? '%' : ''}`;
  return string;
}

export function md5(targetStr: string): string {
  return _md5.hex_md5(targetStr);
}
