import taIns from '/@/utils/lib/thinkdata';

import { useUserStoreWithOut } from '/@/store/modules/user';
import { ITaEvent, ITaEventName } from 'thinkingdata-node';

export function useTATA() {
  const doEventFn = (vEventName: ITaEventName, vProperties: Nullable<Record<string, any>>) => {
    const eventData: ITaEvent = {
      accountId: useUserStoreWithOut().getUserId + '',
      event: vEventName,
    };
    if (vProperties) {
      eventData.properties = vProperties;
      taIns.track(vEventName, vProperties);
    } else {
      taIns.track(vEventName);
    }

    //web端，采用实时上报
    // taIns.flush();
  };
  const doEventLogin = (vAccountId: string) => {
    taIns.login(vAccountId);
  };
  const doEventLogout = () => {
    taIns.logout();
  };
  return { doEventFn, doEventLogin, doEventLogout };
}
