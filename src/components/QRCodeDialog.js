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

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import QRCode from 'qrcode.react'


export default class QRCodeDialog extends React.Component {
    constructor(props) {
        super(props)

        this.setData = this.setData.bind(this)
        this.doOpen  = this.doOpen.bind(this)
        this.doClose = this.doClose.bind(this)

        this.state = {
            open: false,
            data: props.data,
        }
    }

    setData(data) {
        this.setState({data})
    }

    doOpen() {
        this.setState({open: true})
    }

    doClose() {
        this.setState({open: false})
    }
    
    render() {
        const actions = [
            <FlatButton label="Close" primary={true} onTouchTap={this.doClose} />
        ]

        const addUri = "https://wallet.zipperglobal.com/#/contacts/create?account="+this.state.data

        return <div className="qrcode-dialog">
            <Dialog
              title="Scan me"
              actions={actions}
              model={false}
              open={this.state.open}
              onRequestClose={this.doClose}>
                <div style={{textAlign: 'center'}}>
                    <QRCode
                      value={ addUri }
                      size={196} />
                    <br />
                    <a href={ addUri }>Share Link</a>
                    <br />
                    <a href={'sms:?body='+escape(addUri)}>
                        via SMS
                    </a><br />
                    <a data-rel="external" href={'mailto:?subject=Add%20me%20on%20Zipper%20-%20' +escape(addUri)+ '&body='+escape(addUri)}>
                        via E-Mail
                    </a><br />
                    <a href={'fb-messenger://share?link='+escape(addUri)}>
                        via Facebook Messenger
                    </a>
                </div>
            </Dialog>
        </div>
    }
}

