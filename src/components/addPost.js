import React, { useState } from 'react'

export default function AddPost() {
    const [postContent,setPostContent] = useState("Create your post here")
    const [view,setView] = useState("")
    return (
        <div className="postAdd">
            <label className={`postLabel ${view}`}>
                <p>Add new post</p>
                <textarea value={postContent} onChange={(e)=>setPostContent(e.target.value)} onFocus={()=>setView("fullView")} onBlur={()=>setView("")}/>
            </label>
        </div>
    )
}
