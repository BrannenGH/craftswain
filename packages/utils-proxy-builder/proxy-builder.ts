/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
type ProxyApply<T> = (target: T, thisArg: any, argArray: any[]) => any;
type ProxyConstruct<T> = (
  target: T,
  argArray: any[],
  newTarget: Function
) => object;
type ProxyDefineProperty<T> = (
  target: T,
  property: string | symbol,
  attributes: PropertyDescriptor
) => boolean;
type ProxyDeleteProperty<T> = (target: T, p: string | symbol) => boolean;
type ProxyGet<T> = (target: T, p: string | symbol, receiver: any) => any;
type ProxyGetOwnPropertyDescriptor<T> = (
  target: T,
  p: string | symbol
) => PropertyDescriptor | undefined;
type ProxyGetPrototypeOf<T> = (target: T) => object | null;
type ProxyHas<T> = (target: T, p: string | symbol) => boolean;
type ProxyIsExtensible<T> = (target: T) => boolean;
type ProxyOwnKeys<T> = (target: T) => ArrayLike<string | symbol>;
type ProxyPreventExtensions<T> = (target: T) => boolean;
type ProxySet<T> = (
  target: T,
  p: string | symbol,
  newValue: any,
  receiver: any
) => boolean;
type ProxySetPrototypeOf<T> = (target: T, v: object | null) => boolean;

export class ProxyBuilder<ParentType extends object> {
  constructor(private obj: ParentType, private noDefaults: boolean = false) {
    if (!noDefaults) {
      this.addDefaults();
    }
  }

  private fluidPush =
    <T>(arr: T[]) =>
    (ele: T) => {
      arr.push(ele);
      return this;
    };

  private applyFuncs: ProxyApply<ParentType>[] = [];
  public apply = this.fluidPush(this.applyFuncs);

  public defaultApply() {
    return this.apply((target, caller, args) => {
      // If target is not function, default apply doesn't exist
      if (typeof target !== "function") {
        throw new Error("Provided target does not have a default apply.");
      }
      // Setup a new proxy for findElement
      return (target as Function).apply(caller, args);
    });
  }

  public wrapReturn(wrap: (input: any) => any) {
    return this.apply((target, caller, args) => {
      // If target is not function, default apply doesn't exist
      if (typeof target !== "function") {
        throw new Error("Provided target does not have a default apply.");
      }
      // Setup a new proxy for findElement
      return wrap((target as Function).apply(caller, args));
    });
  }

  public wrapReturnLazy(wrap: (param: () => any) => any) {
    return this.apply((target, caller, args) => {
      // If target is not function, default apply doesn't exist
      if (typeof target !== "function") {
        throw new Error("Provided target does not have a default apply.");
      }
      // Setup a new proxy for findElement
      return wrap(() => (target as Function).apply(caller, args));
    });
  }

  private constructFuncs: ProxyConstruct<ParentType>[] = [];
  public construct = this.fluidPush(this.constructFuncs);

  private definePropertyFuncs: ProxyDefineProperty<ParentType>[] = [];
  public defineProperty = this.fluidPush(this.definePropertyFuncs);

  private deletePropertyFuncs: ProxyDeleteProperty<ParentType>[] = [];
  public deleteProperty = this.fluidPush(this.deletePropertyFuncs);

  private getFuncs: ProxyGet<ParentType>[] = [];
  public get = this.fluidPush(this.getFuncs);

  /**
   * Adds the default get resolution as a fallback.
   * @returns This
   */
  public defaultGet() {
    return this.get((target, p, receiver) => {
      return Reflect.get(target, p, receiver);
    });
  }

  /**
   * Override the default behavior when a certain property is accessed.
   * @param p The property whose behavior to override.
   * @param getFunc The function containing the behavior to execute when p is accessed.
   * @returns This
   */
  public whenGetProperty(
    p: keyof ParentType,
    getFunc: (
      target: ParentType,
      receiver: unknown,
      resolve: () => unknown
    ) => unknown
  ) {
    return this.get((baseTarget, baseProperty, baseReceiver) => {
      if (p === baseProperty) {
        return getFunc(baseTarget, baseReceiver, () =>
          Reflect.get(baseTarget, baseProperty, baseReceiver)
        );
      }
    });
  }

  private getOwnPropertyDescriptorFuncs: ProxyGetOwnPropertyDescriptor<ParentType>[] =
    [];
  public getOwnPropertyDescriptor = this.fluidPush(
    this.getOwnPropertyDescriptorFuncs
  );

  private getPrototypeOfFuncs: ProxyGetPrototypeOf<ParentType>[] = [];
  public getPrototypeOf = this.fluidPush(this.getPrototypeOfFuncs);

  private hasFuncs: ProxyHas<ParentType>[] = [];
  public has = this.fluidPush(this.hasFuncs);

  private isExtensibleFuncs: ProxyIsExtensible<ParentType>[] = [];
  public isExtensible = this.fluidPush(this.isExtensibleFuncs);

  private ownKeysFuncs: ProxyOwnKeys<ParentType>[] = [];
  public ownKeys = this.fluidPush(this.ownKeysFuncs);

  private preventExtensionsFuncs: ProxyPreventExtensions<ParentType>[] = [];
  public preventExtensions = this.fluidPush(this.preventExtensionsFuncs);

  private setFuncs: ProxySet<ParentType>[] = [];
  public set = this.fluidPush(this.setFuncs);

  private setPrototypeOfFuncs: ProxySetPrototypeOf<ParentType>[] = [];
  public setPrototypeOf = this.fluidPush(this.setPrototypeOfFuncs);

  public addDefaults() {
    return this.defaultGet();
  }

  public build(): ParentType {
    const proxyHandler: ProxyHandler<ParentType> = {};

    Object.keys(this).forEach((property) => {
      if (
        !["build", "fluidPush"].includes(property) &&
        property.includes("Funcs", property.length - 6)
      ) {
        (proxyHandler as any)[property] = (...args: any[]) => {
          ((this as any)[property + "Funcs"] as Function[])
            .reverse()
            .forEach((func: Function) => func(...args));
        };
      }
    });

    return new Proxy(this.obj, proxyHandler);
  }
}
