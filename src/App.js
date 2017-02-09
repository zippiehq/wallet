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
import {Link} from 'react-router'

import ReactCSSTransitionGroup from "react-addons-css-transition-group"

import {Dispatcher} from 'flux'
import WalletStore from './stores/WalletStore'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import IconButton from 'material-ui/IconButton'
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'

import QRCodeIcon from './components/QRCodeIcon'
import QRScanDialog from './components/QRScanDialog'

export default class App extends React.Component {
    constructor(props, context) {
        super(props, context)

        this.store = new WalletStore()

        window.dispatcher = new Dispatcher()
        window.dispatcher.register(function(calldata) {
            switch(calldata.action) {
                case 'CONTACT_CREATE':
                    console.log("== CREATING CONTACT ===")
                    this.store.addContact(calldata.contact)
                    break

                default:
            }
        }.bind(this))

        this.doShowDrawer = this.doShowDrawer.bind(this)
        this.doHideDrawer = this.doHideDrawer.bind(this)

        this.state = {
            title: props.children.props.route.title,
            back: props.children.props.route.back,

            showDrawer: false,
            showScanner: false,
        }

        this.pages = [
            { path: '/accounts', title: "My Wallet" },
            { path: '/contacts', title: "My Contacts" },
            { path: '/settings', title: "Settings" },
        ]

        document.title = "Zipper - " + this.state.title
    }

    componentDidMount() {
    }

    componentWillReceiveProps(props) {
        this.setState({
            title: props.children.props.route.title,
             back: props.children.props.route.back,
        })

        document.title = "Zipper - " + props.children.props.route.title
    }

    doHistoryBack() {
        window.history.back()
    }

    doShowDrawer() {
        this.setState({showDrawer: true})
    }

    doHideDrawer() {
        this.setState({showDrawer: false})
    }

    doShowScanCode () {
        this.scanner.doOpen()
    }

    onScanResults (data) {
        console.log(data)
        if (data.startsWith('http:') || data.startsWith('https:')) {
            window.location = data
            return
        }

        if (data.startsWith('zip:')) {
            const account = data.slice(4)
            const contact = this.store.findContactById(account)

            if (!contact) {
                this.props.router.push('/contacts/create?account=' + account)
            } else {
                this.props.router.push('/contacts/' + account)
            }
        }

        this.scanner.doClose()
    }

    render() {
        const navitems = this.pages.map((elem, index) => {
            return (
                <MenuItem
                  key={elem.path}
                  containerElement={<Link to={elem.path} />}
                  onTouchTap={this.doHideDrawer}>
                  {elem.title}
                </MenuItem>
            )
        })

        return (
            <MuiThemeProvider>
                <div id="document">
                    <AppBar
                      title={this.state.title}
                      iconElementLeft={
                        <IconButton
                          onTouchTap={this.state.back ? this.doHistoryBack : this.doShowDrawer}>
                            {this.state.back ? <NavigationBack color="#ffffff" /> : <NavigationMenu color="#ffffff" />}
                        </IconButton>}
                      iconElementRight={
                        <IconButton
                          onTouchTap={ this.doShowScanCode.bind(this) }>
                            <QRCodeIcon />
                        </IconButton>
                      } />

                    <Drawer
                      docked={false}
                      open={this.state.showDrawer}
                      onRequestChange={showDrawer => this.setState({showDrawer})}>
                        {navitems}
                    </Drawer>

                    <QRScanDialog
                      ref={ref => { this.scanner = ref }}
                      onScanResults={ this.onScanResults.bind(this) } />

                    <div>
                        <ReactCSSTransitionGroup
                          transitionName="page"
                          transitionEnterTimeout={750}
                          transitionLeaveTimeout={750}>
                            {
                                React.cloneElement(this.props.children, {
                                      key: this.props.children.props.route.path,
                                      app: this,
                                    store: this.store,
                                })
                            }
                        </ReactCSSTransitionGroup>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

