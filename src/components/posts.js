import React, {useState,useEffect} from 'react'
import firebase from 'firebase/app'

export default function Posts() {
    
    const [posts,setPosts] = useState([])
    const [expand,setExpand] = useState(false)
    
    window.addEventListener("click",()=>{
        if(expand){
            setExpand(false)
        }
    })
    function renderPosts(){
        firebase.database().ref("posts/").limitToLast(1).get().then((snapshot)=> {
            if(snapshot.val() !== null){
                setPosts([...posts,snapshot.val()[Object.keys(snapshot.val())]])
            }
        })
    }
    return (
        <div>
            {posts.map(item => 
                {return (
                    <div className={`post`} key={item.date}>
                        <div className="postBox">
                            <div onClick={(e)=>e.stopPropagation()} className={`${firebase.auth().currentUser.uid === item.userId? "showPostSettings" : ""} settings`}>
                                <button onClick={()=>setExpand(!expand)}>
                                    <img src="pictures/gear_icon.png" />
                                </button>
                                <ul className={expand?"expandSettings":""}>
                                    <li>yo</li>
                                    <li>yo</li>
                                    <li>yo</li>
                                </ul>
                            </div>
                            <p>{item.content}</p>

                        </div>
                    </div>
                )})}
            <button onClick={renderPosts}>YOO</button>
        </div>
    )
}
