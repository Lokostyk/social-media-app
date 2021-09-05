import React, {useState,useEffect} from 'react'
import firebase from 'firebase/app'

export default function Posts() {
    const [posts,setPosts] = useState([])
    const [showPostSettings,setShowPostSettings] = useState("")
    
    function showSettings(userId){
        const currentUserId = firebase.auth().currentUser.uid
        if(userId === currentUserId){
            return "showPostSettings"
        }else {
            return ""
        }
    }
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
                    <div className={`${showSettings(item.userId)} post`} key={item.date}>
                        <div className="postBox">
                            <div className="settings">
                                <button>
                                    <img src="pictures/gear_icon.png" />
                                </button>
                                <ul>
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
