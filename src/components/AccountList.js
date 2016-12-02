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
import {CardHeader, CardActions} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'

class AccountListItem extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            standalone: props.standalone !== undefined ? props.standalone : true,
        }
    }

    render() {
        const props = this.props

        return <ListItem
          style={{
            padding: '0 0 0.8em 0',
            borderBottom: this.state.standalone ? '1px solid #afafaf' : '',
          }}
          onTouchTap={ev => props.onSelected(ev, props.item)}>
            <CardHeader
              style={{
                margin: 0,
                padding: 0,
              }}
              title={props.item.label}
              titleStyle={{
                margin: '0.25em 0 0 0.8em',
                fontSize: '1em',
                fontWeight: 400,
                color: '#6f6f6f',
              }}
              subtitle={props.item.balance ? Number(props.item.balance / 100).toFixed(2) : '0.00'}
              subtitleStyle={{
                margin: '0.25em 0 0 0.5em',
                fontSize: '1.5em',
                fontWeight: 300,
                color: '#000000',
              }}
              avatar={
                <Avatar
                  src={'images/icons/' + props.item.icon}
                  size={48}
                  style={{
                    float: 'left',
                    margin: '0 0 0 0',
                    padding: '0',
                    borderRadius: '5%'
                  }} />
              }>
            </CardHeader>

            {this.state.standalone && props.item.label !== "Zipper Safe Pay" ?
            <CardActions style={{margin: 0, marginBottom: '-1.8em', padding: 0, textAlign: 'right'}}>
                <FlatButton
                  primary={true}
                  label="Transfer"
                  style={{margin: 0}}
                  onTouchTap={ev => props.onTransferRequest(ev, props.item)} />

                <FlatButton
                  primary={true}
                  label="Receive"
                  style={{margin: 0}}
                  onTouchTap={ev => props.onReceiveRequest(ev, props.item)} />
            
            </CardActions>
            : ''}
        </ListItem>
    }
}

class AccountList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            items: props.model,
        }
    }

    render() {
        const items = this.state.items.map(item =>
            <AccountListItem
              key={item.address}
              item={item}
              onSelected={ev => {this.props.onAccountSelected(ev, item)}}
              onTransferRequest={ev => {this.props.onTransferRequest(ev, item)}}
              onReceiveRequest={ev => {this.props.onReceiveRequest(ev, item)}} />
        )

        return <List>
            {items}
        </List>
    }
}

export {AccountList as default, AccountListItem}

