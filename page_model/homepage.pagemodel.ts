import {Builder, Browser, By, Key, until} from 'selenium-webdriver';

const FIRST_LINK_SELECTOR = "ul li:nth-of-type(1) a";

var abtestinglink = By.css(FIRST_LINK_SELECTOR)


export {
    abtestinglink
}