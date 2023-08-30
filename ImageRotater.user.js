// ==UserScript==
// @name         Image Rotater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow to rotate the image by arrow keys when that image is the only element of the web page.
// @author       ForkKILLET
// @match        https://*/*
// @grant        none
// ==/UserScript==

const firstChildren = document.body.children[0]

let deg = 0

const setRotateStyle = () => {
    firstChildren.style.transform = `rotate(${deg}deg)`
}

if (document.body.childElementCount === 1 && firstChildren.tagName === 'IMG') {
    const infoElement = document.createElement('div')
    infoElement.innerHTML = '<p style="text-align: center; font-size: 2em;">←/→ to rotate</p>'
    document.body.appendChild(infoElement)

    window.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            deg -= 90
            setRotateStyle()
        }
        else if (event.key === 'ArrowRight') {
            deg += 90
            setRotateStyle()
        }
    })
}
