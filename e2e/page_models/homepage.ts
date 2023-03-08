import { By, WebDriver } from "selenium-webdriver";
import { Logger } from "winston";
import { PageModel } from "@craftswain/selenium";

export class Homepage extends PageModel {
  constructor(webDriver?: Promise<WebDriver>, logger?: Promise<Logger>) {
    super(webDriver, logger);
  }

  get lnkAbTesting() {
    return (async () => {
      return (await this.webDriver).findElement(
        By.css("ul li:nth-of-type(1) a")
      );
    })();
  }
}
