import React from 'react'
import { useState, useEffect } from 'react/cjs/react.development'
import firebase from "firebase/app"
import ChatBox from './chatBox'

export default function ChatList() {
    const [displayFriendList,setDisplayFriendList] = useState(false)
    const [friendsData,setFriendsData] = useState([])

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

    return (
        <>
            <ChatBox />
            <div className="chatBoxList">
                <button className="friendsBtn" onClick={()=>setDisplayFriendList(!displayFriendList)}>Friends <span>({friendsData.length})</span></button>
                <div className={displayFriendList?"chatList":"notDisplayChat"}>
                    {friendsData.map(person=>{
                        return (
                            <button className="chatTile">{person.userName}</button>
                        )
                    })

                    }
                </div>
            </div>
        </>
    )
}
