import React, {useState,useEffect, useCallback , useRef} from 'react'
import firebase from 'firebase/app'
import InnerPost from './innerPost'

export default function Posts(props) {    
    const [posts,setPosts] = useState([])
    const [loadNewPosts,setLoadNewPosts] = useState(true)
    const [lastPostDate,setLastPostDate] = useState(Infinity)
    const [loading,setLoading] = useState(false)
    const [hasMore,setHasMore] = useState(true)

    useEffect(()=>{
        setLoading(true)
        const loadPosts = new Array()
        firebase.firestore().collection("posts").where("date","<",lastPostDate).orderBy("date").limitToLast(3).get().then((snapshot)=> {
            let index = 0
            if(snapshot.size === 0){
                setHasMore(false)
                setLoading(false)
            }
            snapshot.forEach(doc =>{
                if(doc.data().date === lastPostDate){
                    setLastPostDate(true)
                    return
                }
                firebase.database().ref("users/"+ doc.data().userId).get().then((userData)=>{
                        const {userName,userSurname} = userData.val()
                        loadPosts.push(Object.assign({userName,userSurname,postId: doc.id},doc.data()))
                        index++
                        if(index === 1){
                            setLastPostDate(doc.data().date)
                        }
                         if(index === snapshot.size){
                            loadPosts.reverse()
                            setPosts([...posts,...loadPosts])
                            setLoading(false)
                        }
                    })
            })
        })
    },[loadNewPosts])
    //Function will load more if last post is on screen
    const observer = useRef()
    const lastBookRef = useCallback(node => {
        if(loading) return
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries=>{
            if(entries[0].isIntersecting && hasMore){
                setLoadNewPosts(!loadNewPosts)
            }
        })
        if(node) observer.current.observe(node)
    },[hasMore,loading])
    function editPost(date) {
        console.log(date)
    }
    const deletePost = useCallback((id,hadPhoto,date)=> {
        if(hadPhoto !== ""){
            firebase.storage().ref("posts/" + date).delete()
        }
        firebase.firestore().collection("posts").doc(id).delete().then(()=>{
                setPosts(posts.filter((item)=>{return item.postId !== id}))
        })
    },[posts])
    return (
        <>
            {posts.map((item,index) => 
                {return (posts.length - 1 === index?
                    <div className="post" ref={lastBookRef} key={item.date}>
                        <InnerPost item={item} loggedIn={props.loggedIn} deletePost={deletePost} editPost={editPost}/>
                    </div>
                    :
                    <div className="post" key={item.date}>
                        <InnerPost item={item} loggedIn={props.loggedIn} deletePost={deletePost} editPost={editPost}/>
                    </div>
                )})}
                {loading?
                <div className="loader">
                    <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>:""}
                {!hasMore?
                    <h3 style={{textAlign: "center",color:"#2b6777"}}>We runned out of posts...</h3>
                :""}
        </>
    )
}
