import React,{useState} from 'react'
import { useCallback, useEffect } from 'react/cjs/react.development'
import firebase from "firebase/app"

export default function ChatBox(props) {
    const person = props.person
    const uId = firebase.auth().currentUser.uid
    const [expandChat,setExpandChat] = useState(false)
    const [chatMessages,setChatMessages] = useState([])
    const [currentMessage,setCurrentMessage] = useState("")
    
    useEffect(()=>setExpandChat(false),[person])
    useEffect(()=>{
        firebase.firestore().collection("chat").doc(uId).onSnapshot((snap)=>{
            firebase.firestore().collection("chat").doc(person.id).onSnapshot((e)=>{
                if(!e.exists || !e.data()[uId]) return
                setChatMessages([...e.data()[uId],...snap.data()[person.id]].sort((a,b)=>a.timestamp - b.timestamp))
            })
        })
    },[person])
    const sendMessage = useCallback((e)=>{
        const timestamp = new Date().getTime()
        e.preventDefault()
        firebase.firestore().collection("chat").doc(uId).update({
            [person.id]: firebase.firestore.FieldValue.arrayUnion({timestamp,content:currentMessage,uId})
        }).then(()=>{
            setCurrentMessage("")
        })
    },[currentMessage])
    return (
        <div className={`chatBox ${expandChat?"expandChat":""}`} style={props.haveTwo?(props.isSecond?{right:"15.1rem"}:{right:"30.4rem"}):{right:"15.2rem"}}>
            <p onClick={()=>setExpandChat(!expandChat)} className="chatTitle">{person.name}</p>
            <div className="messageBox">
                {chatMessages.map((mess)=>{
                        return (
                            <div key={mess.timestamp} className={`message ${mess.uId !== uId?"left":""}`}>
                                <p>{mess.content}</p>
                            </div>)
                    })}
            </div>
            <form onSubmit={sendMessage} className="messageForm">
                <input value={currentMessage} onChange={(e)=>setCurrentMessage(e.target.value)} className="newMessage"/>
            </form>
        </div>
    )
}
