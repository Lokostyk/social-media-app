import React, {useState,useEffect, useCallback , useRef} from 'react'
import firebase from 'firebase/app'

export default function Posts(props) {    
    const [posts,setPosts] = useState([])
    const lastPost = 100

    useEffect(renderPosts,[])
    function renderPosts(){
        const loadPosts = new Array()
        firebase.database().ref("posts/").orderByChild("date").get().then((snapshot)=> {
            if(snapshot.val() !== null){
                let index = 0
                for(let i in snapshot.val()){
                    firebase.database().ref("users/"+ snapshot.val()[i].userId).get().then((userData)=>{
                        const {userName,userSurname} = userData.val()
                        loadPosts.push(Object.assign({userName,userSurname},snapshot.val()[i]))
                        index++
                        if(index === Object.keys(snapshot.val()).length){
                            loadPosts.reverse()
                            setPosts([...posts,...loadPosts])
                        }
                    })
                }
            }else{
                setPosts([])
            }
        })
    }
    //Function will load more if last post is on screen
    function loadMorePosts(node) {
        if(!node) return
        const observer = new IntersectionObserver(entries=>{
            if(entries[0].isIntersecting){
                renderPosts()
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
