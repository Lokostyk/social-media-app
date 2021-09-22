import firebase from 'firebase/app'
import React, { useState } from 'react'
import { useCallback, useEffect } from 'react/cjs/react.development'
import InnerComment from './innerComment'

export default function InnerPost(props) {
    const item = props.item
    const userId = props.loggedIn?firebase.auth().currentUser.uid:false
    const [allComments,setAllComments] = useState([...item.postComments].reverse())
    const [heartCounter,setHeartCounter] = useState(item.postHearts)
    const [showComments,setShowComments] = useState(false)
    const [commentHandler,setCommentHandler] = useState("Write comment here")
    const [handleTextarea,setHandleTextarea] = useState("")
    
    const heartHandler =  useCallback(()=>{
        if(!userId) return
        if(heartCounter.indexOf(userId) === -1){
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
    },[heartCounter,props.loggedIn])
    const addComment = useCallback((e,postId)=>{
        e.preventDefault()
        if(commentHandler !== " " && commentHandler !== ""){
            const commentData = {userId,content:commentHandler,timestamp:new Date().getTime()}
            firebase.firestore().collection("posts").doc(postId).update({
                postComments:  firebase.firestore.FieldValue.arrayUnion(commentData)
            }).then(()=>{
                setAllComments([commentData,...allComments])
                setCommentHandler("")
                setHandleTextarea("")
                e.target.firstChild.style.height = "1.6rem"
            })
        }
    },[commentHandler])
    function textareaFirstClick(node) { 
        if(commentHandler === "Write comment here"){
            setCommentHandler("")
            node.style.color = "black"
        }
    }
    function handleComment(node) {
        node.style.height = "1.6rem"
        setCommentHandler(node.value)
        if(node.scrollHeight > 25){
            node.style.height = node.scrollHeight + 'px'
            setHandleTextarea("expandTextarea")
        }else {
            setHandleTextarea("")
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
        <>
        <div className="postBox">
            <p className="topUserInfo">{item.userName + " "}{item.userSurname}</p>
            <p className="postTextContent" style={item.photoUrl?{textAlign: "center"}:{}}>{item.content}</p>
            <img src={item.photoUrl} className={item.photoUrl ? "postImage":"noDisplay"} />
            <div className="heartsCommentsBox">
                <div className="heartBox">
                    <button onClick={heartHandler}><img className={`heart ${heartCounter.indexOf(userId) === -1?"":"active"}`} src="pictures/heart.svg"/></button>
                    <div style={{textAlign:"center",color:"#00a889"}}>{heartCounter.length}</div>
                </div>
                <button onClick={()=>setShowComments(!showComments)} className="comments"><p>Comments <span>({allComments.length})</span></p></button>
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
        <div className={`commentsBox ${showComments?"expandPost":""}`}>
            {userId?
            <form className={`${handleTextarea}`} onSubmit={(e)=>addComment(e,item.postId)}>
                <textarea onClick={(e)=>textareaFirstClick(e.target)} value={commentHandler} onChange={(e)=>handleComment(e.target)} required/>
                <input type="submit" value="add"/>
            </form>:
                <p className="noUserLogged" style={{textAlign:"center"}}>Sign in to add comments!</p>
            }
            <hr className="postLineBreak"/>
            {showComments?
                allComments.map(comment=>{
                    return <InnerComment key={comment.timestamp} comment={comment} post={item} allComments={allComments} loggedIn={props.loggedIn}/>
                }):""
            }
        </div>
        </>
    )
}
