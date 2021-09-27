import React from 'react'

export default function ChatBox() {
    return (
        <div className="chatBox">
            <p className="chatTitle">Maciej</p>
            <div className="messageBox">
                <div className="message" style={{justifyContent:"flex-start"}}>
                    <p>oo</p>
                </div>
                <div className="message">
                    <p>yooyooyooyooyooyooyooyooyooyooyooyooyoo</p>
                </div>
            </div>
            <input className="newMessage"/>
        </div>
    )
}
