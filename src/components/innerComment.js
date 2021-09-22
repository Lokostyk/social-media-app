import React from 'react'
import { useCallback } from 'react'
import { useEffect, useState } from 'react/cjs/react.development'
import firebase from "firebase/app"

export default function InnerComment(props) {
    const comment = props.comment
    const [userData,setUserData] = useState([])

    useEffect(()=>{
        const storagePath = firebase.storage().ref("users").child(comment.userId)
        firebase.database().ref(`users/${comment.userId}`).get().then(snapshot=>{
            const data = {userFullName:snapshot.val().userName + " " + snapshot.val().userSurname}
            storagePath.getMetadata().then(meta=>{
                if(meta.contentType !== "txt"){
                    storagePath.getDownloadURL().then((url)=>{
                        setUserData(Object.assign(data,{photoUrl:url}))
                    })
                }else{
                    setUserData(Object.assign(data,{photoUrl:"pictures/no_profile_picture.png"}))
                }
            })
        })
    },[])
    const deleteComment = useCallback(()=>{
        firebase.firestore().collection("posts").doc(props.post.postId).update({
            postComments: props.allComments.filter(post=>post.timestamp!==comment.timestamp)
        })
    },[])
    return (
        <fieldset className="comment">
            <legend>
                <img className="commentProfilePicture" src={userData.photoUrl} />
                <span>{userData.userFullName}</span>
                {(props.loggedIn && firebase.auth().currentUser.uid === comment.userId)?<button onClick={deleteComment}><img className="commentDeleteBtn" src="pictures/delete.svg"/></button>:""}
            </legend>
            <p>{comment.content}</p>
        </fieldset>
    )
}
