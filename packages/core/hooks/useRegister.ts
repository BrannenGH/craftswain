import CraftswainEnvironment from "../index";

export const useRegister = <T>(
  registerHandle: () => { [key: string]: Promise<T> }
) => {
  Object.assign(CraftswainEnvironment.testObjects, registerHandle());
};
