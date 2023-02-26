/**
 * @jest-environment ./selenium-environment
 */

import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { Builder, Browser, By, Key, until, WebDriver } from 'selenium-webdriver';
import { IWebDriver } from 'selenium-webdriver/lib/webdriver';
import { abtestinglink } from '../page_model/homepage.pagemodel';

declare const webdriver: IWebDriver;

test("Open browser and go to webpage", async () => {
    await webdriver.findElement(abtestinglink);
});