import { WebDriver } from 'selenium-webdriver';
import { Logger } from 'winston';

// Jest injected
declare const global: {webDriver: WebDriver, logger: Logger};

export class PageModel {
    protected webDriver: WebDriver;
    protected logger: Logger;

    constructor(
        webDriver: WebDriver = global.webDriver,
        logger: Logger = global.logger
    ) {
        this.webDriver = webDriver;
        this.logger = logger;
    }
}