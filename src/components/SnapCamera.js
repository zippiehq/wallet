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

import RaisedButton from 'material-ui/RaisedButton'

export default class PhotoCamera extends React.Component {
    constructor(props) {
        super(props)

        this.onDeviceInfo = this.onDeviceInfo.bind(this)
        this.onStreamStarted = this.onStreamStarted.bind(this)
        this.doSnapshot = this.doSnapshot.bind(this)

        navigator.getUserMedia = navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia ||
                                 navigator.msGetUserMedia
    }

    componentDidMount() {
        navigator.mediaDevices.enumerateDevices()
            .then(this.onDeviceInfo)
            .catch(error => {console.log("ERROR: " + error.name +":"+ error.message)})
    }

    onDeviceInfo(devices) {
        const cameras = []
        devices.forEach(dev => {
            if(dev.kind === 'videoinput') cameras.push(dev)
        })

        const targetDeviceId = cameras[cameras.length-1].deviceId
        navigator.getUserMedia({
                audio: false,
                video: {deviceId: targetDeviceId}
            },
            this.onStreamStarted,
            error => {console.log("ERROR: " + error.name +":"+ error.message)}
        )
    }

    componentWillUnmount() {
        this.stream.getTracks()[0].stop()
    }

    onStreamStarted(stream) {
        console.log(stream.getTracks())

        this.stream = stream
        this.video.src = window.URL.createObjectURL(stream)
    }

    doSnapshot() {
        const video = this.video
        const canvas = this.canvas

        canvas.width = this.video.width
        canvas.height = this.video.height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, this.video.width, this.video.height)

        this.capture.src = canvas.toDataURL('image/webp')

        console.log("V: " + this.video.width +"x"+ this.video.height)
        console.log(this.capture)
        console.log("C: " + this.capture.width + "x" + this.capture.height)

        this.video.style.display = 'none'
        this.stream.getTracks()[0].stop()
    }

    render() {
        return <div style={{textAlign: 'center'}}>
            <canvas ref={ref => this.canvas = ref}
              style={{display: 'none'}} />

            <div ref={ref => this.viewfinder = ref}>
                <video ref={ref => this.video = ref}
                  width="320" height="280"
                  style={{margin: '0 auto', border: '1px solid #000000', objectFit: 'fill'}}
                  autoPlay="true" />

                <img ref={ref => this.capture = ref}
                  alt='' style={{}}/>
            </div>

            <RaisedButton label="Take Photo" onTouchTap={this.doSnapshot}/>
        </div>
    }
}

