import { WebDriver } from 'selenium-webdriver';
import { Logger } from 'winston';

// Jest injected
declare const global: {webDriver: Promise<WebDriver>, logger: Promise<Logger>};

export class PageModel {
    protected webDriver: Promise<WebDriver>;
    protected logger: Promise<Logger>;

    constructor(
        webDriver = global.webDriver,
        logger = global.logger
    ) {
        this.webDriver = webDriver;
        this.logger = logger;
    }
}