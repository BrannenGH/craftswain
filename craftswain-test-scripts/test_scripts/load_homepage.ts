/**
 * @jest-environment craftswain-selenium
 */
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { Homepage } from 'craftswain-selenium';
import { WebDriver } from 'selenium-webdriver';

test("Open browser and go to webpage", async () => {
    const homepage = new Homepage();
    expect(await homepage.lnkAbTesting.isDisplayed()).toBe(true);
});