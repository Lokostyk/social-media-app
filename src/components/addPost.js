import React, { useState } from 'react'
import firebase from "firebase/app"
import "firebase/storage"

export default function AddPost(props) {
    const [postContent,setPostContent] = useState("Create your post here")
    const [view,setView] = useState("")
    const [photo,setPhoto] = useState(false)
    
    function expand(e) {
        e.stopPropagation()
        setView("fullView")
        postContent === "Create your post here" ? setPostContent("") : console.log()
    }
    function clearBox() {
        setPostContent("")
    }
    function addPost() {
        const userId = firebase.auth().currentUser.uid
        const timeStamp = new Date().getTime()
        firebase.database().ref("posts/" + timeStamp).set({
            date: timeStamp,
            content: postContent,
            photoAdded: false,
            userId: userId
        }).then(()=>{
            setView("")
            setPostContent("")
        })
        if(photo){
            firebase.storage().ref("posts").child(timeStamp + "").put(photo)
            setPhoto("")
        }
    }
    function addPhoto(e) {
        console.log(e.target.files[0])
        setPhoto(e.target.files[0])
    }
    window.addEventListener("click",()=>{
        if(view !== ""){
            setView("")
        }
    })
    if(props.loggedIn){
        return (
                <div className={`postAdd ${view}`}>
                    <label className="postLabel" onClick={expand}>
                        <p>Add new post</p>
                        <textarea className={`postTextarea ${view}`} value={postContent} onChange={(e)=>setPostContent(e.target.value)}/>
                        {photo ? <a href={URL.createObjectURL(photo)} target="_blank">{photo.name}</a>: ""}
                        <div className="postBtns">
                            <button className="rBtn" onClick={clearBox}>Clear</button>
                            <label className="rBtn">
                                <input type="file" onChange={addPhoto} accept="image/png, image/jpeg" />
                                <button className="rBtn photoAdd">Photo</button>
                            </label>
                            <button className="rBtn" onClick={addPost}>Add post</button>
                        </div>
                    </label>
                </div>
        )
    }else {
        return <div>Post adding is avialable for logged users!</div>
    }
}
