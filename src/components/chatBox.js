import React,{useState} from 'react'
import { useEffect } from 'react/cjs/react.development'

export default function ChatBox(props) {
    const [expandChat,setExpandChat] = useState(false)
    useEffect(()=>setExpandChat(false),[props.name])
    return (
        <div className={`chatBox ${expandChat?"expandChat":""}`} style={props.haveTwo?(props.isSecond?{right:"15.1rem"}:{right:"30.4rem"}):{right:"15.2rem"}}>
            <p onClick={()=>setExpandChat(!expandChat)} className="chatTitle">{props.name}</p>
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
