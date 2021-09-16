import React, {useState,useEffect, useCallback , useRef} from 'react'
import firebase from 'firebase/app'

export default function Posts(props) {    
    const [posts,setPosts] = useState([])
    const [loadNewPosts,setLoadNewPosts] = useState(true)
    const [lastPostDate,setLastPostDate] = useState(Infinity)

    useEffect(()=>{
        console.log("wywóz")
        const loadPosts = new Array()
        firebase.firestore().collection("users").where("date","<",lastPostDate).orderBy("date").limitToLast(3).get().then((snapshot)=> {
            let index = 0
            snapshot.forEach(doc =>{
                if(doc.data().date === lastPostDate){
                    setLastPostDate(true)
                    return
                }
                firebase.database().ref("users/"+ doc.data().userId).get().then((userData)=>{
                        const {userName,userSurname} = userData.val()
                        loadPosts.push(Object.assign({userName,userSurname},doc.data()))
                        index++
                        if(index === 1){
                            setLastPostDate(doc.data().date)
                        }
                         if(index === snapshot.size){
                            loadPosts.reverse()
                            setPosts([...posts,...loadPosts])
                        }
                    })
            })
        })
    },[loadNewPosts])
    //Function will load more if last post is on screen
    function loadMorePosts(node) {
        if(!node && lastPostDate) return
        const observer = new IntersectionObserver(entries=>{
            if(entries[0].isIntersecting){
                observer.disconnect()
                setLoadNewPosts(!loadNewPosts)
            }else{
                observer.disconnect()
            }
        })
        observer.observe(node)
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
    function editPost(date) {
        console.log(date)
    }
    function deletePost(date) {
        firebase.database().ref("posts").child(date).remove().then(()=>{
                setPosts(posts.filter((item)=>{return item.date !== date}))
        })
    }
    return (
        <>
            {posts.map((item,index) => 
                {return (posts.length - 1 === index?
                    <div className="post" ref={loadMorePosts} key={item.date}>
                        <div className="postBox">
                            <p className="topUserInfo">{item.userName + " "}{item.userSurname}</p>
                            <p className="postTextContent" style={item.photoUrl?{textAlign: "center"}:{}}>{item.content}</p>
                            <img src={item.photoUrl} className={item.photoUrl ? "postImage":"noDisplay"} />
                            <div onClick={(e)=>e.stopPropagation()} className={`${props.loggedIn && (firebase.auth().currentUser.uid === item.userId)? "showPostSettings" : ""} settings`}>
                                <button onClick={(e)=>expandPostSettings(e)}>
                                    <img src="pictures/gear_icon.png" />
                                </button>
                                <ul id="list">
                                    <li><button onClick={()=> editPost(item.date)}>Edit</button></li>
                                    <li><button onClick={()=> deletePost(item.date)}>Delete</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="post" key={item.date}>
                        <div className="postBox">
                            <p className="topUserInfo">{item.userName + " "}{item.userSurname}</p>
                            <p className="postTextContent" style={item.photoUrl?{textAlign: "center"}:{}}>{item.content}</p>
                            <img src={item.photoUrl} className={item.photoUrl ? "postImage":"noDisplay"} />
                            <div onClick={(e)=>e.stopPropagation()} className={`${props.loggedIn && (firebase.auth().currentUser.uid === item.userId)? "showPostSettings" : ""} settings`}>
                                <button onClick={(e)=>expandPostSettings(e)}>
                                    <img src="pictures/gear_icon.png" />
                                </button>
                                <ul id="list">
                                    <li><button onClick={()=> editPost(item.date)}>Edit</button></li>
                                    <li><button onClick={()=> deletePost(item.date)}>Delete</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )})}
        </>
    )
}
