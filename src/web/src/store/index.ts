import * as EVER from "./ever";

const appStore: any = {};
export const registerStore = () => {
  appStore.ever = EVER;
};

export default appStore;
