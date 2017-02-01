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

import Avatar from 'material-ui/Avatar'
import {CardActions, CardHeader} from 'material-ui/Card'
import Dialog from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'
import {List} from 'material-ui/List'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import Subheader from 'material-ui/Subheader'
import * as COLORS from 'material-ui/styles/colors'

import QRCodeIcon from '../components/QRCodeIcon'
import QRCodeDialog from './QRCodeDialog'
import QRScanDialog from '../components/QRScanDialog'

function AccountActionButton(props) {    
    return <RaisedButton
             label={props.label}
             labelColor='#ffffff'
             labelStyle={{fontSize: '1.25em', fontWeight: 300}}
             backgroundColor={COLORS.green400}
             style={{margin: '0em 0.5em 0 0.5em'}}
             buttonStyle={{width: '8em', height: '2.5em'}}
             onTouchTap={props.onTouchTap} />
}

export default class AccountView extends React.Component {
    constructor(props) {
        super(props)

        this.onReceiveRequest = this.onReceiveRequest.bind(this)

        this.onScanRequest = this.onScanRequest.bind(this)
        this.onScanResults = this.onScanResults.bind(this)

        this.onSendRequest = this.onSendRequest.bind(this)

        this.openConfirmDialog = this.openConfirmDialog.bind(this)
        this.closeConfirmDialog = this.closeConfirmDialog.bind(this)
        this.confirmPayment = this.confirmPayment.bind(this)

        this.store = props.store

        this.state = {
            confirmTxid: undefined,
            confirmDialogOpen: false,
        }
    }

    onReceiveRequest(ev) {
        ev.stopPropagation()
        this.qrcode.doOpen()
    }
    
    onScanRequest(ev) {
        ev.stopPropagation()
        this.qrscanner.doOpen()
    }

    onScanResults(data) {
        console.log(data)
        if (data.startsWith('zip:')) {
            const account = data.slice(4)
            this.props.router.push('/transactions/create?to='+account)
        }
    }
    
    onSendRequest(ev) {
        ev.stopPropagation()
        this.props.router.push('/transactions/create')
        this.qrscanner.doClose()
    }

    openConfirmDialog(ev, txid) {
        ev.stopPropagation()
        this.setState({confirmTxid: txid, confirmDialogOpen: true})
    }

    closeConfirmDialog() {
        this.setState({confirmDialogOpen: false})
    }

    confirmPayment(ev) {
        this.props.doConfirmDelivery(ev, this.state.confirmTxid)
        this.closeConfirmDialog()
    }

    render() {
        const isEscrow = (this.props.account.label === "Zipper Safe Pay")
        const history = []

        /*
        const escrowStyle = {
            color: COLORS.orange500,
        }

        const normalStyle = {}
        */

        return <div className="account-view">
            <QRCodeDialog
              data={this.props.account.address}
              ref={ref => this.qrcode = ref} />

            <QRScanDialog
              ref={ref => {this.qrscanner = ref}}
              onScanResults={this.onScanResults} />

            <Dialog
              title="Confirm"
              actions={[
                  <FlatButton label="Cancel" primary={true} onTouchTap={this.closeConfirmDialog} />,
                  <FlatButton label="Submit" primary={true} onTouchTap={this.confirmPayment} />
              ]}
              open={this.state.confirmDialogOpen}
              onRequestClose={this.closeConfirmDialog}>
                <p>Are you sure you want to release the funds for this purchase?</p>
            </Dialog>

            <CardHeader
              style={{
                margin: 0,
                padding: 0,
                height: '6.5em',
                backgroundColor: COLORS.blue300,
              }}
              title={this.props.account.label}
              titleStyle={{
                margin: '1.6em 0 0 0.8em',
                fontSize: '1em',
                fontWeight: 400,
                color: '#ffffff',
              }}
              subtitle={Number(this.props.account.balance / 100).toFixed(2)}
              subtitleStyle={{
                margin: '0 0 0 0.5em',
                fontSize: '1.5em',
                fontWeight: 300,
                color: '#ffffff',
              }}
              avatar={
                <Avatar 
                  src={"images/icons/" + this.props.account.icon}
                  size={48}
                  style={{
                    float: 'left',
                    margin: '1em 0 0 0.8em',
                    padding: '0',
                    borderRadius: '5%',
                  }} />
            }>
                <Paper
                  rounded={false}
                  zDepth={2}
                  style={{
                      position: 'absolute',
                      right: '1em',
                      top: '1em',
                      padding: '0.25em 0.25em 0',
                  }}
                  onTouchTap={this.onReceiveRequest}>
                    <QRCodeIcon
                      color='#000000'
                      style={{
                          width: '48px',
                          height: '48px',
                      }} />
                </Paper>
            </CardHeader>

            {isEscrow ? '' :
            <CardActions style={{
                margin: '-1.25em 0 0 0',
                padding: '0',
                textAlign: 'center',
              }}>
                <AccountActionButton label="Scan" onTouchTap={this.onScanRequest} />
                <AccountActionButton label="Send" onTouchTap={this.onSendRequest} />
            </CardActions>}

            <List>
                <Subheader>{isEscrow ? "Purchases" : "Recent Activity"}</Subheader>
                <Divider />

                {history}
            </List>
        </div>
    }
}

