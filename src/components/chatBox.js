import React,{useState} from 'react'
import { useCallback, useEffect } from 'react/cjs/react.development'
import firebase from "firebase/app"

function ChatBox(props) {
    const person = props.person
    const uId = firebase.auth().currentUser.uid
    const [firstChatOpen,setFirstChatOpen] = useState(false)
    const [expandChat,setExpandChat] = useState(false)
    const [chatMessages,setChatMessages] = useState([])
    const [currentMessage,setCurrentMessage] = useState("")

    useEffect(()=>setExpandChat(false),[person])
    useEffect(()=>{
        firebase.firestore().collection("chat").doc(uId).onSnapshot((snap)=>{
            firebase.firestore().collection("chat").doc(person.id).onSnapshot((e)=>{
                if(!e.exists || !e.data()[uId]){
                    setChatMessages([...snap.data()[person.id]].sort((a,b)=>a.timestamp - b.timestamp))
                }else{
                    setChatMessages([...e.data()[uId],...snap.data()[person.id]].sort((a,b)=>a.timestamp - b.timestamp))
                }
            })
        })
    },[person])
    useEffect(()=>{
        if(document.querySelector(`#a${person.id}`) === null) return
        const lastMes = document.querySelector(`#a${person.id}`)
        const messageBox = lastMes.parentElement
        if(messageBox.scrollTop <= messageBox.scrollHeight * 0.7 && firstChatOpen) return
        messageBox.scrollTop = messageBox.scrollHeight
        setFirstChatOpen(true)
    },[chatMessages,firstChatOpen])
    const sendMessage = useCallback((e)=>{
        const timestamp = new Date().getTime()
        e.preventDefault()
        if(currentMessage === " ") return
        firebase.firestore().collection("chat").doc(uId).update({
            [person.id]: firebase.firestore.FieldValue.arrayUnion({timestamp,content:currentMessage,uId})
        }).then(()=>{
            setCurrentMessage("")
            const messageBox = e.target.previousElementSibling 
            messageBox.scrollTop = messageBox.scrollHeight
        })
    },[currentMessage])
    return (
        <div className={`chatBox ${expandChat?"expandChat":""}`} style={props.haveTwo?(props.isSecond?{right:"15.1rem"}:{right:"30.4rem"}):{right:"15.2rem"}}>
            <p onClick={()=>setExpandChat(!expandChat)} className="chatTitle">{person.name +" "+ person.surname}</p>
            <div className="messageBox">
                {chatMessages.length === 0?
                <div style={{backgroundColor: "#f5f5f5",padding:".6rem .3rem",margin:".5rem .6rem",borderRadius:"8px",textAlign:"center"}}>
                    <p>To see others messages they have to add you to friends either!</p>
                </div>:null
                }
                {chatMessages.map((mess,index)=>{
                        return (<>{index !== chatMessages.length -1?
                            <div key={mess.timestamp} className={`message ${mess.uId !== uId?"left":""}`}>
                                <p>{mess.content}</p>
                            </div>:
                            <div id={`a${person.id}`} key={mess.timestamp} className={`message 2 ${mess.uId !== uId?"left":""}`}>
                                <p>{mess.content}</p>
                            </div>
                            }</>)
                    })}
            </div>
            <form onSubmit={sendMessage} className="messageForm">
                <input value={currentMessage} onChange={(e)=>setCurrentMessage(e.target.value)} className="newMessage" required/>
            </form>
        </div>
    )
}
export default React.memo(ChatBox)
