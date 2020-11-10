/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function withLog() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const targetMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const logData = {
        method: propertyKey,
        args,
      };
      console.log(JSON.stringify(logData));
      return targetMethod.apply(this, args);
    };
  };
}
