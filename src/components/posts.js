import React, {useState,useEffect} from 'react'
import firebase from 'firebase/app'

export default function Posts() {
    const [posts,setPosts] = useState("")
    
    if(posts === ""){renderSeven()}
    function renderSeven(){
        const data = []
        
        firebase.database().ref("posts/").limitToLast(7).get().then((snapshot)=> {
            for(let i in snapshot.val()){
                data.push(snapshot.val()[i])
            }
            setPosts(data)
        })
    }
    function render(items){
        if(items !== ""){
            return items.map((e)=> {return <div>{e.content}</div>}).reverse()
        }
    }
    return (
        <div>
            {render(posts)}
            <button onClick={()=>setPosts("")}>YOO</button>
        </div>
    )
}
