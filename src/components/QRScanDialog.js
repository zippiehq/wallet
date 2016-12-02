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

import JsQr from 'jsqr'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia

class QRScanner extends React.Component {
    constructor(props) {
        super(props)

        this.onDeviceInfo = this.onDeviceInfo.bind(this)
        this.onStreamStarted = this.onStreamStarted.bind(this)
        this.onScanInterval = this.onScanInterval.bind(this)

        this.state = {
            facingMode: (this.props.facingMode ? this.props.facingMode : 'rear'),
            decodeText: undefined,
            videoDisplay: 'none',
            videoWidth: window.innerWidth * 0.6,
            videoHeight: window.innerWidth * 0.5,
        }
    }

    componentDidMount() {
        navigator.mediaDevices.enumerateDevices()
        .then(this.onDeviceInfo)
        .catch(error => {console.log("ERROR: " + error.name +":"+ error.message)})
    }

    componentWillUnmount() {
        if(this.timerId) window.clearInterval(this.timerId)
        if(this.stream) this.track.stop()
    }

    onDeviceInfo(devices) {
        const cameras = []
        devices.forEach(dev => {
            if(dev.kind === 'videoinput') cameras.push(dev)
        })

        const targetId =
            this.state.facingMode === 'front' ? cameras[0].deviceId
                : cameras[cameras.length-1].deviceId

        navigator.getUserMedia({
            audio: false,
            video: {deviceId: targetId},
        },
        this.onStreamStarted,
        error => {console.log("ERROR: " + error.name +":"+ error.message)})
    }

    onStreamStarted(stream) {
        this.stream = stream
        this.track  = stream.getTracks()[0]
        this.video.src = window.URL.createObjectURL(stream)

        this.timerId = window.setInterval(this.onScanInterval, this.props.interval || 1000)
    }

    onScanInterval() {
        const width = this.video.videoWidth
        const height = this.video.videoHeight

        const videoWidth = window.innerWidth * 0.6
        const videoHeight = (height / width) * videoWidth

        this.setState({
            videoDisplay: 'inline',
            videoWidth: videoWidth,
            videoHeight: videoHeight,
        })

        this.canvas.width = width
        this.canvas.height = height

        const ctx = this.canvas.getContext('2d')
        ctx.drawImage(this.video, 0, 0, width, height)

        const bytes      = ctx.getImageData(0, 0, width, height)
        const decodeText = JsQr.decodeQRFromImage(bytes.data, width, height, width)

        // Check we got a result, and only trigger the callback when data changes.
        if(decodeText && decodeText !== this.state.decodeText) {
            this.setState({decodeText})
            this.props.onDecode && this.props.onDecode(decodeText)
        }
    }

    render() {
        const style = {
            main: {
                width: this.state.videoWidth, height: this.state.videoHeight,
                margin: '0 auto', 
                textAlign: 'center'
            },
            video: {
                display: this.state.videoDisplay,
                border: '0.5em solid #dfdfdf',
                width: this.state.videoWidth, height: this.state.videoHeight,
                objectFit: 'contain',
            },
            canvas: {
                display: 'none',
            },
        }

        return <div style={style.main}>
            <video ref={ref => this.video = ref}
              autoPlay={true}
              style={style.video} />

            <canvas ref={ref => this.canvas = ref}
              style={style.canvas} />
        </div>

    }
}

export default class QRScanDialog extends React.Component {
    constructor(props) {
        super(props)

        this.doOpen = this.doOpen.bind(this)
        this.doClose = this.doClose.bind(this)
        this.onError = this.onError.bind(this)

        this.state = {
            open: false,
        }
    }

    doOpen() {
        this.setState({open: true})
    }
    
    doClose() {
        this.setState({open: false})
    }

    onError(err) {
        console.error(err)
    }
    
    render() {
        const actions = [
            <FlatButton label="Close" primary={true} onTouchTap={this.doClose} />
        ]

        return <div className="qrscan-dialog">
            <Dialog
              title="Scanning"
              actions={actions}
              model={false}
              open={this.state.open}
              onRequestClose={this.doClose}>
                <QRScanner
                  interval={1000}
                  onDecode={this.props.onScanResults} />
            </Dialog>
        </div>
    }
}

