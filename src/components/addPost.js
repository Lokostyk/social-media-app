import React, { useState, useContext,useCallback } from 'react'
import firebase from "firebase/app"
import "firebase/storage"
import { AlertContext } from '../Contexts/alert'

export default function AddPost(props) {
    const setAlert = useContext(AlertContext)

    const [postContent,setPostContent] = useState("")
    const [view,setView] = useState("")
    const [photo,setPhoto] = useState(false)
    
    function expand(e) {
        e.stopPropagation()
        setView("fullView")
    }
    const addPost = useCallback(()=>{
        if(postContent === "") return
        const userId = firebase.auth().currentUser.uid
        const timestamp = new Date().getTime()
        if(photo){
            firebase.storage().ref("posts").child(timestamp + "").put(photo).then(()=>{
                firebase.storage().ref("posts").child(timestamp + "").getDownloadURL().then((url)=>{
                    firebase.firestore().collection("posts").add({
                        date: timestamp,
                        content: postContent,
                        photoUrl: url,
                        userId: userId,
                        postComments: [],
                        postHearts: []
                    }).then(()=>{
                        setView("")
                        setPostContent("")
                        setPhoto("")
                        setAlert({"style": "topAlert","txt":"Post added!","functions":"delete"})
                    })
                })
            })
        }else{
            firebase.firestore().collection("posts").add({
                    date: timestamp,
                    content: postContent,
                    photoUrl: "",
                    userId,
                    postComments: [],
                    postHearts: []
            })
            .then(()=>{
                setView("")
                setPostContent("")
                setAlert({"style": "topAlert","txt":"Post added!","functions":"delete"})
        })}
    },[postContent,photo])
    window.addEventListener("click",()=>{
        if(view !== ""){
            setView("")
        }
    },[])
    if(props.loggedIn){
        return (
                <div className={`postAdd ${view}`}>
                    <label className="postLabel" onClick={expand}>
                        <p>Add new post</p>
                        <textarea className={`postTextarea ${view}`} value={postContent} onChange={(e)=>setPostContent(e.target.value)} placeholder="Create your post here"/>
                        {photo ? 
                            <div className="postImage">
                                <a href={URL.createObjectURL(photo)} target="_blank">
                                    {photo.name.length >= 10?photo.name.slice(0,9)+".."+photo.name.slice(photo.name.lastIndexOf(".")):photo.name}
                                </a>
                                <button onClick={()=> setPhoto(false)}><img src="pictures/delete.svg" /></button>
                            </div>: ""}
                        <div className="postBtns">
                            <button className="rBtn" onClick={()=>setPostContent("")}>Clear</button>
                            <label className="rBtn">
                                <input type="file" onChange={(e)=>setPhoto(e.target.files[0])} accept="image/png, image/jpeg" />
                                <button className="rBtn photoAdd">Photo</button>
                            </label>
                            <button className="rBtn" onClick={addPost}>Add post</button>
                        </div>
                    </label>
                </div>
        )
    }else {
        return <div className="postAdd noUserLogged"><span>Sign in to add posts.</span></div>
    }
}
