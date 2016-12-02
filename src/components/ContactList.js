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
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'

function ContactListItem(props) {
    const item = props.item

    return <ListItem
      leftAvatar={<Avatar style={{borderRadius: '5%'}}>{item.firstName[0]}</Avatar>}
      primaryText={item.firstName + " " + item.lastName}
      onTouchTap={ev => props.onItemSelected(ev, item)} />
}

export default class ContactList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            items: props.model,
        }
    }

    render() {
        const footerButtonStyle = {
            width: '100%',
            marginTop: 0,
            color: '#6f6f6f',
        }

        const items = this.state.items.map(item =>
            <ContactListItem
              key={item.accountNumber}
              item={item}
              onItemSelected={this.props.onItemSelected} />)

        return <List>
            {items}

            <Divider />

            {this.props.onCreateRequest ? (<FlatButton
              label="Add new contact"
              style={footerButtonStyle}
              onTouchTap={this.props.onCreateRequest} />) : ''}
        </List>
    }
}

