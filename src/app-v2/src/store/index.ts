import { counter } from "./counter";

const appStore: any = {};
export const registerStore = () => {
  appStore.counter = counter();
};

export default appStore;
