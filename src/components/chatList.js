import React from 'react'
import { useState, useEffect , useCallback } from 'react/cjs/react.development'
import firebase from "firebase/app"
import ChatBox from './chatBox'

export default function ChatList() {
    const [displayFriendList,setDisplayFriendList] = useState(false)
    const [friendsData,setFriendsData] = useState([])
    const [chatOppend,setChatOppend] = useState([])

    useEffect(()=>{
        const dataList = new Array()
        firebase.database().ref("users").child(firebase.auth().currentUser.uid).child("userFriends").get().then((snap)=>{
            if(snap.val() === null) return
            snap.val().map((personId,index)=>{
                firebase.database().ref("users").child(personId).get().then(p=>{
                    firebase.storage().ref("users").child(personId).getMetadata().then((img)=>{
                        if(img.contentType === "txt"){
                            dataList.push(Object.assign(p.val(),{userProfilePicture:"pictures/no_profile_picture.png",userId:snap.val()[index]}))
                            if(dataList.length === snap.val().length){
                                setFriendsData(dataList.sort((a,b)=>a.userName.localeCompare(b.userName)))
                            }
                        }else{
                            firebase.storage().ref("users").child(personId).getDownloadURL().then(url=>{
                                dataList.push(Object.assign(p.val(),{userProfilePicture:url,userId:snap.val()[index]}))
                                if(dataList.length === snap.val().length){
                                    setFriendsData(dataList.sort((a,b)=>a.userName.localeCompare(b.userName)))
                                }
                            })
                        }
                    })
                })
            })
        })
    },[])
    const displayFriendChat = useCallback((name,surname,id)=>{
        if(chatOppend.length === 2){
            if(chatOppend[0].id === id || chatOppend[1].id === id) return
            setChatOppend([{name,surname,id},...chatOppend.slice(0,1)])
        }else{
            if(chatOppend.length === 1 && chatOppend[0].id === id) return
            setChatOppend([{name,surname,id},...chatOppend])
        }
    },[chatOppend])
    return (
        <>
            {chatOppend.map(person=>{
                return <ChatBox key={person.id} haveTwo={chatOppend.length === 2} isSecond={(chatOppend.length === 2 && chatOppend[1].id === person.id)} person={person}/>
            })}
            <div className="chatBoxList">
                <button className="friendsBtn" onClick={()=>setDisplayFriendList(!displayFriendList)}>Friends <span>({friendsData.length})</span></button>
                <div className={displayFriendList?"chatList":"notDisplayChat"}>
                    {friendsData.map(person=>{
                        return (
                            <button key={person.id} onClick={()=>displayFriendChat(person.userName,person.userSurname,person.userId)} className="chatTile">{person.userName + " " + person.userSurname}<img className="smallProfilePicture" src={person.userProfilePicture}/></button>
                        )
                    })
                    }
                </div>
            </div>
        </>
    )
}
