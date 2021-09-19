import firebase from 'firebase/app'
import React, { useState } from 'react'
import { useEffect } from 'react/cjs/react.development'

export default function InnerPost(props) {
    const item = props.item
    const userId = firebase.auth().currentUser?firebase.auth().currentUser.uid:false
    const [heartCounter,setHeartCounter] = useState(item.postHearts)

    function heartHandler() {
        if(!userId) return
        if(item.postHearts.indexOf(userId) === -1 && heartCounter.indexOf(userId) === -1){
            firebase.firestore().collection("posts").doc(item.postId).update({
                postHearts:  firebase.firestore.FieldValue.arrayUnion(`${userId}`)
            }).then(()=>{
                setHeartCounter([...heartCounter,userId])
            })
        }else{
            firebase.firestore().collection("posts").doc(item.postId).update({
                 postHearts:  firebase.firestore.FieldValue.arrayRemove(`${userId}`)
            }).then(()=>{
                setHeartCounter(heartCounter.filter(id => id !== userId))
            })
        }
    }

    function expandPostSettings(e) {
        const list = e.target.parentElement.nextElementSibling
        list.classList.toggle("expandSettings")
        //Close all oppend settings options
        window.addEventListener("click",closeAll)
        function closeAll() {
            const allSettings = document.querySelectorAll("#list")
            allSettings.forEach((item)=>{
                item.classList.remove("expandSettings")
            })
            window.removeEventListener("click",closeAll)
        }
    }
    return (
        <div className="postBox">
            <p className="topUserInfo">{item.userName + " "}{item.userSurname}</p>
            <p className="postTextContent" style={item.photoUrl?{textAlign: "center"}:{}}>{item.content}</p>
            <img src={item.photoUrl} className={item.photoUrl ? "postImage":"noDisplay"} />
            <div className="heartsCommentsBox">
                <div className="heartBox">
                    <button onClick={heartHandler}><img className={`heart ${heartCounter.indexOf(userId) === -1?"":"active"}`} src="pictures/heart.svg"/></button>
                    <div style={{textAlign:"center",color:"#00a889"}}>{heartCounter.length}</div>
                </div>
                <button className="commentsBox"><p>Comments <span>(2)</span></p></button>
            </div>
            <div onClick={(e)=>e.stopPropagation()} className={`${props.loggedIn && (firebase.auth().currentUser.uid === item.userId)? "showPostSettings" : ""} settings`}>
                <button onClick={(e)=>expandPostSettings(e)}>
                    <img src="pictures/gear_icon.png" />
                </button>
                <ul id="list">
                    <li><button onClick={()=> props.editPost(item.date)}>Edit</button></li>
                    <li><button onClick={()=> props.deletePost(item.postId,item.photoUrl,item.date)}>Delete</button></li>
                </ul>
            </div>
    </div>
    )
}
