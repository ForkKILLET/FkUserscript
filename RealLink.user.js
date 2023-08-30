// ==UserScript==
// @name         RealLink
// @namespace    https://icelava.top/
// @version      0.1
// @description  自动跳过国内常见的链接中间页面
// @author       ForkKILLET
// @match        https://c.pc.qq.com/middlem.html*
// @match        https://c.pc.qq.com/ios.html*
// @grant        none
// ==/UserScript==

const query = new URLSearchParams(location.search)

const jump = (url) => {
    document.write(`<h1>正在前往 ${url}</h1>`)
    location.href = url
}

if (location.href.startsWith('https://c.pc.qq.com/middlem.html')) {
	jump(query.get('pfurl'))
}

else if (location.href.startsWith('https://c.pc.qq.com/ios.html')) {
	jump(query.get('url'))
}
