import React, { useState } from 'react'

export default function AddPost() {
    window.addEventListener("click",()=>{
        setView("")
    })

    const [postContent,setPostContent] = useState("Create your post here")
    const [view,setView] = useState("")

    function expand(e) {
        e.stopPropagation()
        setView("fullView")
        postContent === "Create your post here" ? setPostContent("") : console.log()
    }
    return (
        <div className={`postAdd ${view}`}>
            <label className="postLabel" onClick={expand}>
                <p>Add new post</p>
                <textarea className={`postTextarea ${view}`} value={postContent} onChange={(e)=>setPostContent(e.target.value)}/>
                <div className="postBtns">
                    <button className="rBtn">Delete</button>
                    <button className="rBtn">Photo</button>
                    <button className="rBtn">Add</button>
                </div>
            </label>
        </div>
    )
}
