/*
 * Copyright (C) 2016 True Holding Ltd.
 * 
 * Commercial License Usage
 * 
 * Licensees holding valid commercial Zipper licenses may use this file in
 * accordance with the terms contained in written agreement between you and
 * True Holding Ltd.
 * 
 * GNU Affero General Public License Usage
 * 
 * Alternatively, the JavaScript code in this page is free software: you can 
 * redistribute it and/or modify it under the terms of the GNU Affero General Public
 * License (GNU AGPL) as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.  The code
 * is distributed WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for
 * more details.
 * 
 * As additional permission under GNU AGPL version 3 section 7, you may
 * distribute non-source (e.g., minimized or compacted) forms of that code
 * without the copy of the GNU GPL normally required by section 4, provided
 * you include this license notice and a URL through which recipients can
 * access the Corresponding Source.
 * 
 * As a special exception to the AGPL, any HTML file which merely makes
 * function calls to this code, and for that purpose includes it by reference
 * shall be deemed a separate work for copyright law purposes.  In addition,
 * the copyright holders of this code give you permission to combine this
 * code with free software libraries that are released under the GNU LGPL.
 * You may copy and distribute such a system following the terms of the GNU
 * AGPL for this code and the LGPL for the libraries.  If you modify this
 * code, you may extend this exception to your version of the code, but you
 * are not obligated to do so.  If you do not wish to do so, delete this
 * exception statement from your version.
 *  
 * This license applies to this entire compilation.
*/
import React from 'react'

export default class ZipperVault extends React.Component {
    constructor(props) {
        super(props)

        this._counter = 0

        this.receivers = {}

        this.postMessage = this.postMessage.bind(this)
        this.onMessage = this.onMessage.bind(this)

        window.addEventListener('message', this.onMessage)
    }

    postMessage(message, origin) {
        //   We override callback property when it's a function, and call the
        // provided function when the RPC call returns a result.
        if(message.callback && typeof message.callback === 'function') {
            let id = "callback-" + this._counter++

            this.receivers[id] = message.callback

            message.callback = id
        }

        this.iframe.contentWindow.postMessage(message, origin || '*')
    }

    onMessage(event) {
        if(event.source !== this.iframe.contentWindow) return

        if(event.data.ready) {
            console.log("Enclave reports ready, sending init message.")
            this.postMessage({init: {useOrigin: true}, callback: 'initialized'})

        } else if(event.data.callback === 'initialized') {
            console.log("Enclave reports initialized.")
            this.props.onInitialized && this.props.onInitialized(this)

        } else {
            this.props.onMessage && this.props.onMessage(event.data)

            if(event.data.callback && this.receivers[event.data.callback]) {
                let receiver = this.receivers[event.data.callback]
                delete this.receivers[event.data.callback]
                receiver(event.data)
            }
        }
    }

    render() {
        return <iframe
                 ref={ref => this.iframe = ref}
                 src="https://enclave.zipperglobal.com/enclave.html"
                 style={{display: 'none'}} />
    }
}

