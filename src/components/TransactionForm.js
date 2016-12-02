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

import Contact from '../models/Contact'

import {AccountListItem} from '../components/AccountList'

import FormCard from '../components/FormCard'
import RecipientSelectionCard from '../components/RecipientSelectionCard'

import Avatar from 'material-ui/Avatar'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import {ListItem} from 'material-ui/List'
import TextField from 'material-ui/TextField'

import ActionDone from 'material-ui/svg-icons/action/done'
import AccountBox from 'material-ui/svg-icons/action/account-box'

import QRCodeIcon from '../components/QRCodeIcon'
import QRScanDialog from '../components/QRScanDialog'

export default class TransactionForm extends React.Component {
    constructor(props) {
        super(props)

        this.store = props.store

        this.doCodeScan = this.doCodeScan.bind(this)
        this.doSelectContact = this.doSelectContact.bind(this)

        this.onScanResults = this.onScanResults.bind(this)

        this.onValueChanged = this.onValueChanged.bind(this)

        this.state = {
            selectors: [
                {
                    key: 'scan-qr-plugin',
                    icon: <QRCodeIcon size="24" />,
                    title: "Scan QR Code",
                    action: this.doCodeScan,
                }, {
                    key: 'select-contact-plugin',
                    icon: <AccountBox size="24" />,
                    title: "From Address book",
                    action: this.doSelectContact,
                },
            ],

            account: props.from,
            recipient: props.to,
            value: undefined,
        }
    }

    doCodeScan(ev) {
        ev.stopPropagation()
        this.qrscanner.doOpen()
    }

    doSelectContact(ev) { //FIXME
        ev.stopPropagation()
        let dest = '/transactions/create?'
        if(this.from) dest += 'from=' + this.state.account.address
        this.props.router.replace('/contacts?mode=select&dest=' + dest)
    }

    onScanResults(data) {
        console.log(data)

        if (data.startsWith("zip:")) {
            let tag = "zip:"
            let account = data.slice(tag.length)
            let recipient = this.store.findContactById(account)
            if (!recipient) {
                recipient = {
                    accountNumber: account,
                    firstName: 'Unknown',
                    lastName: '',
                }
            }
            console.log(recipient)
            this.setState({recipient})
        } else {
            alert("Unrecognised format - DATA: " + data)
        }

        this.qrscanner.doClose()
    }

    onValueChanged(ev) {
        this.setState({value: ev.target.value})
    }

    render() {
        return <div className="form" style={{padding: '0.2em'}}>
            <QRScanDialog
              ref={ref => {this.qrscanner = ref}}
              onScanResults={this.onScanResults} />

            <FormCard title="Your Account">
                <AccountListItem
                  standalone={false}
                  item={this.state.account} />
            </FormCard>

            <RecipientSelectionCard
              title="Step 1: Select Recipient"
              selectors={this.state.selectors}
              recipient={this.state.recipient} />

            <FormCard title="Step 2: Enter Account">
                <ListItem
                  style={{padding: '0.8em 0 0 0'}}
                  leftAvatar={
                    <Avatar style={{borderRadius: '5%'}}
                      src={"images/icons/"  + this.state.account.icon} />
                  }>
                    <TextField
                      value={this.state.value}
                      hintText={Number(0).toFixed(2).toLocaleString().replace(',', ' ')}
                      style={{
                        width: '5em',
                        margin: '-0.5em 0 0 0',
                        padding: 0,
                        fontSize: '2em',
                        fontWeight: 300,
                      }}
                      onChange={this.onValueChanged} />
                </ListItem>
            </FormCard>

            <FloatingActionButton
              style={{float: 'right', margin: '-2em 1.5em 0 0'}}
              onTouchTap={() => {this.props.onSubmit(this.state.account.address, this.state.recipient.accountNumber, Number(this.state.value) * 100)}}>
                <ActionDone />
            </FloatingActionButton>
        </div>
    }
}

