import { By, WebDriver} from 'selenium-webdriver';
import { Logger } from 'winston';
import { PageModel } from '@craftswain/selenium';

export class Homepage extends PageModel {
    constructor(
        webDriver?: WebDriver,
        logger?: Logger 
    ) {
        super(webDriver, logger);
    }

    get lnkAbTesting() {
        return this.webDriver.findElement(By.css("ul li:nth-of-type(1) a"));
    }
}

