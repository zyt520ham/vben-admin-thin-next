import taIns from '/@/utils/lib/thinkdata';

import { ITaEventName } from 'thinkingdata-node';

export function useTATA() {
  const doEventFn = (vEventName: ITaEventName, vProperties: Nullable<Record<string, any>>) => {
    if (vProperties) {
      const eventValue: Record<string, any> = {
        ...vProperties,
        ...taIns.getSuperProperties(),
      };
      taIns.track(vEventName, eventValue);
    } else {
      taIns.track(vEventName);
    }

    //web端，采用实时上报
    // taIns.flush();
  };
  const doSetSuperProperties = (vSuperProperties: Record<string, any>) => {
    taIns.setSuperProperties(vSuperProperties);
  };
  const doClearSuperProperties = () => {
    taIns.clearSuperProperties();
  };
  const doEventLogin = (vAccountId: string) => {
    taIns.login(vAccountId);
  };
  const doEventLogout = () => {
    taIns.logout();
  };
  return { doEventFn, doEventLogin, doEventLogout, doSetSuperProperties, doClearSuperProperties };
}
