import { Logger } from 'winston';
import { Locator, WebDriver } from 'selenium-webdriver';
import { webElementOverrides } from './web-element';

export const webDriverOverrides: (logger?: Logger) => ProxyHandler<WebDriver> = (logger?: Logger) => ({
  get(target, p, reciever) {
    // If find element executed on target
    if (p === 'findElement') {
      // Setup a new proxy for findElement
      return new Proxy(
        Reflect.get(target, p, reciever), 
        {
          apply: (target, caller, args) => {

            return target
              .apply(caller, args as [locator: Locator])
              .then((element) => new Proxy(element, webElementOverrides(logger)));
          }
        });
    }
     
    return Reflect.get(target, p, reciever);
  }
});

