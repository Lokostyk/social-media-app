import React,{useEffect,useState,useCallback} from 'react'
import firebase from 'firebase/app'

export default function FriendsList(props) {
    const [friendsData,setFriendsData] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        const dataList = new Array()
        firebase.database().ref("users").child(firebase.auth().currentUser.uid).child("userFriends").get().then((snap)=>{
            if(snap.val() === null) return
            snap.val().map((personId,index)=>{
                firebase.database().ref("users").child(personId).get().then(p=>{
                    firebase.storage().ref("users").child(personId).getMetadata().then((img)=>{
                        if(img.contentType === "txt"){
                            dataList.push(Object.assign(p.val(),{userProfilePicture:"pictures/no_profile_picture.png",userId:snap.val()[index]}))
                            if(dataList.length === snap.val().length){
                                setFriendsData(dataList.sort((a,b)=>a.userName.localeCompare(b.userName)))
                                setLoading(!loading)
                            }
                        }else{
                            firebase.storage().ref("users").child(personId).getDownloadURL().then(url=>{
                                dataList.push(Object.assign(p.val(),{userProfilePicture:url,userId:snap.val()[index]}))
                                if(dataList.length === snap.val().length){
                                    setFriendsData(dataList.sort((a,b)=>a.userName.localeCompare(b.userName)))
                                    setLoading(!loading)
                                }
                            })
                        }
                    })
                })
            })
        })
    },[])
    function openUserProfile(id) {
        props.setDisplay(id)
    }
    const deleteFriend = useCallback((e,id)=>{
        e.stopPropagation()
        const path = firebase.database().ref("users").child(firebase.auth().currentUser.uid)
        path.child("userFriends").get().then(snap=>{
            if(snap.val()===null)return
            path.update({
                userFriends: snap.val().filter(item=>item!==id)
            })
        }).then(()=>setFriendsData(friendsData.filter(item=>item.userId!==id)))
    },[friendsData])
    return (
        <div className="profileSet">
            {!loading?<>
            <p style={{fontSize:"1.1rem",marginBottom:".1rem"}}>Click on tile to open profile</p>
            <div className="formSet" style={{padding:".5rem 0"}}>
                {friendsData.map(person=>{
                    return (<>
                    <hr style={{border:"1px solid #f5f5f5"}}/>
                    <button onClick={()=>openUserProfile(person.userId)} className="userProfileOnList">
                        <span>{person.userName} {person.userSurname}</span>
                        <button onClick={(e)=>deleteFriend(e,person.userId)}><img src="pictures/delete.svg"/></button>
                    </button>
                    <hr style={{border:"1px solid #f5f5f5"}}/>
                    </>)
                })}
            </div></>:
                <div className="loader">
                    <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>}
        </div>
    )
}
