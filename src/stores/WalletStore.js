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
import Promise from 'promise'
import EventEmitter from '../EventEmitter'

const indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB || window.webkitIndexedDB
const IDBTransaction = window.IDBTransaction || window.msIDBTransaction || window.wekbitIDBTransaction
const IDBKeyRange = window.IDBKeyRange || window.msIDBKeyRage || window.webkitIDBKeyRange

let db

function _initDB () {
    return new Promise ((fulfill, reject) => {
        const req = window.indexedDB.open('wallet', 1)
        req.onerror = event => {
            console.error("Failed to open database.")
            reject()
        }

        req.onsuccess = event => {
            console.info("Database loaded.")
            db = event.target.result
            fulfill()
        }

        req.onupgradeneeded = event => {
            let db = event.target.result
            db.onerror = event => {
                console.error("Error upgrading database.")
                reject()
            }

            console.info("Performing database upgrade")
            var objects = db.createObjectStore('contacts', { keyPath: 'accountNumber' })
            objects.createIndex('firstName', 'firstName', { unique: false })
            objects.createIndex('lastName', 'lastName', { unique: false })
        }
    })
}

export default class WalletStore {
    constructor() {
        this.events = new EventEmitter()

        this.onUpdate = this.onUpdate.bind(this)

        this.onIncoming = this.onIncoming.bind(this)
        this.onOutgoing = this.onOutgoing.bind(this)

        this.account = {
            address: window.PRIMARY_ADDRESS,
              label: "Zip Tokens",
               icon: "zipper_icon.png",
            balance: 0,
        }

        this._txid = 0

        this.contacts = []
        this.accounts = [this.account]
        this.transactions = []

        this.history = []
        this.initialSync = true

        _initDB()
        .then(this.doGetContacts.bind(this))
        .catch(error => {console.error(error)})

        this.onUpdate()
    }

    doGetContacts () {
        console.log("Loading contacts...")
        const objects = db.transaction('contacts', 'readonly').objectStore('contacts')
        objects.openCursor().onsuccess = event => {
            const cursor = event.target.result

            if (!cursor) return

            console.log(cursor.value)
            this.contacts.push(cursor.value)
            this.events.trigger('change')
        }
    }

    findContactById (id) {
        for (var i = 0; i < this.contacts.length; i++) {
            const contact = this.contacts[i]
            if (contact.accountNumber === id) return contact
        }
        return null
    }

    addContact (contact) {
        const objects = db.transaction('contacts', 'readwrite').objectStore('contacts')
        const req = objects.add(contact)
        req.onsuccess = event => {
            console.log("Successfully added contact")
            this.contacts.push(contact)
            this.events.trigger('change')
        }
    }

    onUpdate() {
        window.TOKEN_API.balanceOf(this.account.address, (error, data) => {
            if (error !== null) return console.log(error)

            if(this.account.balance.toString() !== data.toString()) {
                this.account.balance = data
                console.log("balance changed - " + this.account.address +": "+ data.toString())
                this.events.trigger('change')
            }
        })

        /*
        if(!this.incoming && window.PRIMARY_ADDRESS) {
            this.incoming = window.TRANSFER_EVENT_API.Transfer({to: window.PRIMARY_ADDRESS}, {fromBlock: 0, toBlock: 'pending'})
            this.outgoing = window.TRANSFER_EVENT_API.Transfer({from: window.PRIMARY_ADDRESS}, {fromBlock: 0, toBlock: 'pending'})

            this.incoming.watch(this.onIncoming)
            this.outgoing.watch(this.onOutgoing)
        }
        */

        setTimeout(this.onUpdate, 2000)
    }

    onIncoming(error, result) {
        if(error) return console.log("ERROR: " + error.name +":"+ error.message)

        let insertAt = 0
        for(let i = 0; i < this.history.length; i++) {
            if(this.history[i].blockNumber <= result.blockNumber){
                insertAt = i
                break
            }
        }

        this.history.splice(insertAt, 0, result)
        this.events.trigger('change')
    }

    onOutgoing(error, result) {
        if(error) return console.log("ERROR: " + error.name +":"+ error.message)
        this.history.push(result)

        let insertAt = 0
        for(let i = 0; i < this.history.length; i++) {
            if(this.history[i].blockNumber <= result.blockNumber){
                insertAt = i
                break
            }
        }

        this.history.splice(insertAt, 0, result)
        this.events.trigger('change')
    }
}

