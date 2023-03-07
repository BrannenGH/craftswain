/**
 * @jest-environment @craftswain/core
 */
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { Homepage } from '../page_models/homepage';


declare const global: any;

test("Open browser and go to webpage", async () => {
    const homepage = new Homepage();
    
    expect(await (await homepage.lnkAbTesting).isDisplayed()).toBe(true);
});