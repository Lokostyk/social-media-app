import React,{useState} from 'react'
import { useEffect } from 'react/cjs/react.development'
import firebase from "firebase/app"

export default function ChatBox(props) {
    const person = props.person
    const [expandChat,setExpandChat] = useState(false)
    const [chatMessages,setChatMessages] = useState([])
    
    useEffect(()=>setExpandChat(false),[person])
    useEffect(()=>{
        const uId = firebase.auth().currentUser.uid
        firebase.firestore().collection("chat").doc(uId).get().then((e)=>setChatMessages(e.data()[person.id]))
    },[person])
    return (
        <div className={`chatBox ${expandChat?"expandChat":""}`} style={props.haveTwo?(props.isSecond?{right:"15.1rem"}:{right:"30.4rem"}):{right:"15.2rem"}}>
            <p onClick={()=>setExpandChat(!expandChat)} className="chatTitle">{person.name}</p>
            <div className="messageBox">
                <div className="message" style={{justifyContent:"flex-start"}}>
                    <p>oo</p>
                </div>
                <div className="message">
                    <p>{chatMessages[Object.keys(chatMessages)]}</p>
                </div>
            </div>
            <input className="newMessage"/>
        </div>
    )
}
