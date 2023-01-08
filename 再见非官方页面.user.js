// ==UserScript==
// @name         再见「非官方页面」
// @namespace    https://icelava.top/
// @version      0.1
// @description  当前网页非官方页面？就要访问！
// @author       ForkKILLET
// @match        https://c.pc.qq.com/middlem.html*
// @grant        none
// ==/UserScript==

location.href = new URLSearchParams(location.search).get('pfurl')
