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

import AccountView from '../components/AccountView'

/* AccountViewPage
 *  - Renders an account view in a page.
 */
export default class AccountViewPage extends React.Component {
    constructor(props) {
        super(props)

        this.doUpdate = this.doUpdate.bind(this)
        this.doConfirmDelivery = this.doConfirmDelivery.bind(this)

        if(!props.params.id) {
            // TODO: Render 404
        }

        this.store = props.store
    }

    componentDidMount() {
        this.store.events.bind('change', this.doUpdate)
    }

    componentWillUnmount() {
        this.store.events.unbind('change', this.doUpdate)
    }

    doUpdate() {
        this.forceUpdate()
    }

    doConfirmDelivery(ev, txid) {
        ev.stopPropagation()
        /*
        const enclave = document.getElementById('zipperenclave').contentWindow
        console.log("ESCROW (" + window.ESCROW_ACCOUNT + ") -> " + window.PRIMARY_ACCOUNT)
        enclave.postMessage({
            sendAuthedTransaction: {
                       key: 1,
                        to: window.TOKEN_API.address,
                  calldata: window.TOKEN_API.transferAuthed.getData(window.ESCROW_ACCOUNT, window.PRIMARY_ACCOUNT, 2000, 1),
                careReturn: true,
            },
            callback: 'authed',
        }, "*")
        */
    }

    render() {
        this.account = this.store.account

        return <div className="page">
            <AccountView
              store={this.store}
              account={this.account}
              router={this.props.router}
              doConfirmDelivery={this.doConfirmDelivery} />
        </div>
    }
}

