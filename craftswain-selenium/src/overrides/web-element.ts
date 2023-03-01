import { Logger } from 'winston';
import { Locator, WebDriver, WebElement } from 'selenium-webdriver';

export const webElementOverrides: (logger?: Logger) => ProxyHandler<WebElement> = (logger?: Logger) => ({
  get(target, p, reciever) {
    if (p === 'isDisplayed' || (p as symbol)?.description === 'isDisplayed') {
        logger?.log("info", `Checking 'isDisplayed'`);

        return Reflect.get(target, p, reciever);
    }

    logger?.log("debug", `Executing ${(p as symbol)?.description ?? String(p)}`);
    
    return Reflect.get(target, p, reciever);
  }
});