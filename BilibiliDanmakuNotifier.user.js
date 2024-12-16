// ==UserScript==
// @name         弹幕播报
// @namespace    https://github.com/ForkKILLET
// @version      2024-12-15
// @description  -
// @author       ForkKILLET
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

function log(fmt, ...args) {
    console.log(`[BiliBiliDanmakuNotifier] ${fmt}`, ...args)
}

function error(fmt, ...args) {
    console.error(`[BiliBiliDanmakuNotifier] ${fmt}`, ...args)
}

const INTERVAL = 500

const $ = s => document.querySelector(s)

const waitFor$ = s => new Promise(res => {
	const tid = setInterval(() => {
		const node = $(s)
		if (node) {
			clearInterval(tid)
			res(node)
		}
	}, INTERVAL)
})

const requestNotificationPermission = async () => {
    const result = await Notification.requestPermission()
    return result === 'granted'
}

const eq = x => y => x === y

const call = x => f => f(x)

const remove = (xs, pr) => {
    const index = xs.findIndex(pr)
    if (index >= 0) xs.splice(index, 1)
}

const createRef = (initValue) => {
    let _value = initValue
    const listeners = []

    return {
        get value() {
            return _value
        },
        set value(newValue) {
            _value = newValue
            listeners.forEach(call(newValue))
        },
        watch(listener) {
            listeners.push(listener)
            return () => remove(listeners, eq(listener))
        }
    }
}

const createVm = ({ node, render, ref, on }) => {
	const disposers = []
    const update = value => {
        node.innerHTML = render(value)
    }
    update()
    const unwatch = ref.watch(update)
	disposers.push(unwatch)
	Object.entries(on).forEach(([ event, listener ]) => {
		const fn = ev => listener(ev, ref)
		node.addEventListener(event, fn)
		disposers.push(() => node.removeEventListener(event, fn))
	})
    return () => disposers.forEach(call())
}

async function start() {
    log('starting...')

    if (! await requestNotificationPermission()) {
        return error('failed to request notification permission.')
    }

    const $danmaku = $('#chat-history-list')
    if (! $danmaku) {
        return error('danmaku element not found.')
    }

    const $root = document.createElement('bdn-root')
    $root.innerHTML = `
        <style>
            //
        </style>
        <button class="toggle-notification"></button>
    `

	log('waiting for mount point...')
    const $mountPoint = await waitFor$('.bottom-actions')

    $mountPoint.appendChild($root)
    const $btnToggleNotification = $root.querySelector('button.toggle-notification')

    const active = createRef(false)

    createVm({
		node: $btnToggleNotification,
		render: active => active ? 'ON' : 'OFF',
		ref: active,
		on: {
			click: (_, ref) => {
				ref.value = ! ref.value
			}
		}
	})

    const observer = new MutationObserver(mutations => {
        if (! active.value) return
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (! node.innerText) return
                new Notification('新弹幕', { body: node.innerText })
            })
        })
    })

    observer.observe($danmaku, { childList: true, subtree: true })
}

start()

