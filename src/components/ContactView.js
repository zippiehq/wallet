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

import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import * as COLORS from 'material-ui/styles/colors'

export default class ContactView extends React.Component {
    render() {
        const props = this.props

        const iconButtonElement =
            <IconButton
              touch={true}
              tooltip="more"
              tooltipPosition="bottom-left">
                <MoreVertIcon color='#ffffff' />
            </IconButton>

        const RightIconMenu = props => {
            return <IconMenu
              style={{float: 'right'}}
              iconButtonElement={iconButtonElement}>
                <MenuItem onTouchTap={this.props.onSendRequest}>Send Money</MenuItem>
                <MenuItem onTouchTap={this.props.onDeleteRequest}>Delete</MenuItem>
            </IconMenu>
        }

        return <div className="ContactView">
            <CardHeader
              style={{
                margin: 0,
                padding: 0,
                height: '6.5em',
                backgroundColor: COLORS.blue300,
              }}
              avatar={
                <Avatar size={48} style={{
                  float: 'left',
                  margin: '1em 0 0 0.8em',
                  padding: '0',
                  borderRadius: '5%',
                }}>{props.contact.firstName[0]}</Avatar>
              }

              title={props.contact.firstName}
              titleStyle={{
                margin: '1.6em 0 0 0.8em',
                fontSize: '1em',
                fontWeight: 400,
                color: '#ffffff',
              }}
              subtitle={props.contact.lastName}
              subtitleStyle={{
                margin: '0 0 0 0.5em',
                fontSize: '1.5em',
                fontWeight: 300,
                color: '#ffffff',
              }}>
                <RightIconMenu />
            </CardHeader>
        </div>
    }
}
