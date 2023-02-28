import {Builder, Browser, By, Key, until, WebElement, WebDriver} from 'selenium-webdriver';
import Winston, { Logger } from 'winston';

const FIRST_LINK_SELECTOR = "ul li:nth-of-type(1) a";
var abtestinglink = By.css(FIRST_LINK_SELECTOR);

// Jest injected
declare const global: any;

export class Homepage {
    private webDriver: WebDriver;
    private logger: Logger;

    constructor(
        webDriver: WebDriver = global.webDriver,
        logger: Logger = global.logger
    ) {
        this.webDriver = webDriver;
        this.logger = logger;
    }

    get lnkAbTesting() {
        this.logger.log("info", `Getting ${FIRST_LINK_SELECTOR}`)
        return this.webDriver.findElement(By.css(FIRST_LINK_SELECTOR));
    }
}

