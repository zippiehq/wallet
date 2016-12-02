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

import FormCard from '../components/FormCard'

import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import {ListItem} from 'material-ui/List'

import ActionHighlightOff from 'material-ui/svg-icons/action/highlight-off'

import {red500} from 'material-ui/styles/colors'

export default class ContactSelectionCard extends React.Component {
    constructor(props) {
        super(props)
        
        this.onRemoveRecipient = this.onRemoveRecipient.bind(this)

        this.state = {
            recipient: props.recipient,
            selectors: props.selectors,
        }
    }

    componentWillReceiveProps (props) {
        this.setState({recipient: props.recipient})
    }

    onRemoveRecipient(ev) {
        ev.stopPropagation()
        this.setState({recipient: null})
    }

    render() {
        const selectors = this.state.selectors.map(selector =>
            <ListItem
              key={selector.key}
              leftIcon={selector.icon}
              primaryText={selector.title}
              onTouchTap={selector.action} />
        )

        let recipient
        if(this.state.recipient) {
            recipient = <ListItem
                          rightIconButton={
                              <IconButton onTouchTap={this.onRemoveRecipient}>
                                  <ActionHighlightOff color={red500} />
                              </IconButton>
                          }
                          primaryText={this.state.recipient.firstName + " " + this.state.recipient.lastName} />
        }

        return <FormCard title={this.props.title || "Select Recipient"}>
                   {recipient ? recipient : selectors}
               </FormCard>
    }
}

