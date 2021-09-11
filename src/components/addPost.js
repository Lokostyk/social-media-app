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
    function addPost() {
        const userId = firebase.auth().currentUser.uid
        const timeStamp = new Date().getTime()
        if(photo){
            firebase.storage().ref("posts").child(timeStamp + "").put(photo).then(()=>{
                firebase.storage().ref("posts").child(timeStamp + "").getDownloadURL().then((url)=>{
                    firebase.database().ref("posts/" + timeStamp).set({
                        date: timeStamp,
                        content: postContent,
                        photoUrl: url,
                        userId: userId
                    }).then(()=>{
                        setView("")
                        setPostContent("")
                        setPhoto("")
                    })
                })
            })
        }else{
            firebase.database().ref("posts/" + timeStamp).set({
                date: timeStamp,
                content: postContent,
                photoUrl: false,
                userId: userId
            }).then(()=>{
                setView("")
                setPostContent("")
        })}
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
        return <div className="postAdd">Post adding is avialable for logged users!</div>
    }
}
