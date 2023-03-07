/**
 * @jest-environment craftswain-selenium
 */
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { Homepage } from 'craftswain-test-framework';

declare const global: any;

test("Open browser and go to webpage", async () => {
    const homepage = new Homepage();
    
    expect(await homepage.lnkAbTesting.isDisplayed()).toBe(true);
});