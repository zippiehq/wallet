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
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory} from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'

import App from './App'

import AccountListPage from './pages/AccountListPage'
import AccountViewPage from './pages/AccountViewPage'
import AccountCreatePage from './pages/AccountCreatePage'
import AccountUpdatePage from './pages/AccountUpdatePage'

import TransactionListPage from './pages/TransactionListPage'
import TransactionViewPage from './pages/TransactionViewPage'
import TransactionCreatePage from './pages/TransactionCreatePage'
import TransactionSubmitPage from './pages/TransactionSubmitPage'

import ContactListPage from './pages/ContactListPage'
import ContactViewPage from './pages/ContactViewPage'
import ContactCreatePage from './pages/ContactCreatePage'
import ContactUpdatePage from './pages/ContactUpdatePage'

const history = hashHistory

//const E400 = () => <h1>400 - Bad Request</h1>
//const E401 = () => <h1>401 - Unauthorized</h1>
//const E402 = () => <h1>402 - Payment Required</h1>
//const E403 = () => <h1>403 - Forbidden</h1>
const E404 = () => <h1>404 - Resource Not Found</h1>
//const E405 = () => <h1>405 - Method Not Allowed</h1>
//const E406 = () => <h1>406 - Not Acceptable</h1>


import Vault from 'zipper-vault'
import EtherVault from 'zipper-vault/ethereum'

import Web3 from 'web3'

const remoteAddr = "https://enclave.zipperglobal.com/eth"
const remote = new Web3(new Web3.providers.HttpProvider(remoteAddr))


const TOKEN_FORWARDER_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"result","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"ok","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"caller","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFromAuthed","outputs":[{"name":"ok","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"ok","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"result","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"result","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"ok","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"caller","type":"address"},{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approveAuthed","outputs":[{"name":"ok","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"caller","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferAuthed","outputs":[{"name":"ok","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]
window.TOKEN_API = remote.eth.contract(TOKEN_FORWARDER_ABI).at("0x6af638c7819a1f19a1b6865a9ec9853485ffd301")


//TODO: If first time, maybe have all routes go through login, with flag clearing.
document.title = "Zipper"
injectTapEventPlugin()

const AppRoutes = () =>
   <Router history={history}>
        <Route component={App}>
            <Route path="/" component={AccountListPage} title="My Wallet" back={false} />

            <Route path="/accounts" components={AccountListPage} title="My Wallet" back={false} />
            <Route path="/accounts/create" components={AccountCreatePage} title="New Account" back={true} />
            <Route path="/accounts(/:id)" components={AccountViewPage} title="Account" back={true} />
            <Route path="/accounts(/:id)/edit" components={AccountUpdatePage} title="Edit Account" back={true} />

            <Route path="/transactions" components={TransactionListPage} title="History" back={true} />
            <Route path="/transactions/create" components={TransactionCreatePage} title="Send Money" back={true} />
            <Route path="/transactions/submit" components={TransactionSubmitPage} title="Send Money" back={true} />
            <Route path="/transactions(/:id)" components={TransactionViewPage} title="History" back={true} />

            <Route path="/contacts" components={ContactListPage} title="My Contacts" back={true} />
            <Route path="/contacts/create" components={ContactCreatePage} title="New Contact" back={true} />
            <Route path="/contacts(/:id)" components={ContactViewPage} title="Contact" back={true} />
            <Route path="/contacts(/:id)/edit" components={ContactUpdatePage} title="Edit Contact" back={true} />

            <Route path="*" component={E404} back={true} />
        </Route>
    </Router>


console.log("Initializing vault...")
Vault.init({useOrigin: true})
.then(function() {
    window.Vault = Vault
    window.EtherVault = EtherVault
})
.then(_ => {
    console.log("Retrieving account keys.")
    return EtherVault.ethAddress(Vault, 'auto', 'm/0')
        .then(key => {
            window.PRIMARY_ADDRESS = key
        })
})
.then(_ => {
    console.log("Application initialized, displaying content.")
    ReactDOM.render(
        <AppRoutes />,
        document.getElementById('root')
    )
})
.catch(error => console.log(error))

