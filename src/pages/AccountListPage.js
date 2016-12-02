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

import FlatButton from 'material-ui/FlatButton'

import AccountList from '../components/AccountList'
import QRCodeDialog from '../components/QRCodeDialog'

/* AccountUpdatePage
 *  - Renders an account list from a top level identity / wallet.
 */
export default class AccountListPage extends React.Component {
    constructor(props) {
        super(props)

        this.onStoreChanged    = this.onStoreChanged.bind(this)
        this.onCreateRequest   = this.onCreateRequest.bind(this)
        this.onAccountSelected = this.onAccountSelected.bind(this)
        this.onTransferRequest = this.onTransferRequest.bind(this)
        this.onReceiveRequest  = this.onReceiveRequest.bind(this)

        this.store = props.store

        const state = {
            accounts: this.store.accounts,
        }

        this.state = state
    }

    componentDidMount() {
        this.store.events.bind('change', this.onStoreChanged)
    }

    componentWillUnmount() {
        this.store.events.unbind('change', this.onStoreChanged)
    }

    onStoreChanged() {
        this.forceUpdate()
    }

    onCreateRequest(ev) {
        ev.stopPropagation()
        this.props.router.push('/accounts/create')
    }

    onAccountSelected(ev, account) {
        ev.stopPropagation()
        console.log(account)
        this.props.router.push('/accounts/' + account.address)
    }

    onTransferRequest(ev, account) {
        ev.stopPropagation()
        this.props.router.push('/transactions/create?from=' + account.address)
    }

    onReceiveRequest(ev, account) {
        console.log("*** " + account.address)
        ev.stopPropagation()
        this.qrcode.setData("lct:" + account.address)
        this.qrcode.doOpen()
    }

    render() {
        const footerButtonStyle = {
            width: '100%',
            marginTop: 0,
            color: '#6f6f6f',
        }

        return <div className="page">
            <QRCodeDialog ref={ref => this.qrcode = ref} />

            <AccountList
              model={this.state.accounts}
              onCreateRequest={this.onCreateRequest}
              onAccountSelected={this.onAccountSelected}
              onTransferRequest={this.onTransferRequest}
              onReceiveRequest={this.onReceiveRequest} />

            {false ? <FlatButton
              label="Add Account"
              style={footerButtonStyle}
              onTouchTap={this.onCreateRequest} /> : '' }

        </div>
    }
}

