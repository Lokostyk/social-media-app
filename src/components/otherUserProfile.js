import React,{ useState, useEffect, useCallback } from 'react'
import firebase from 'firebase/app'
import "firebase/storage"

export default function OtherUserProfile(props) {
    const currentUserId = firebase.auth().currentUser === null?"false":firebase.auth().currentUser.uid
    const [userData,setUserData] = useState({userName: "--",userSurname:"--",userDescription:""})
    const [newFriend,setNewFriend] = useState(true)

    useEffect(()=>{
        let data = {}

        firebase.database().ref("users").child(props.userId).get().then((snapshot)=> {
            data = snapshot.val()
            
            const storagePath =  firebase.storage().ref("users").child(props.userId)
            storagePath.getMetadata().then((meta)=>{
                if(meta.contentType !== "txt"){
                    storagePath.getDownloadURL().then((url)=>{
                        data = {...data,userProfilePicture: url}
                        setUserData(data)
                    })
                }else {
                    data = {...data,userProfilePicture: "pictures/no_profile_picture.png"}
                    setUserData(data)
                }
            })
        }) 
        firebase.database().ref("users").child(currentUserId).child("userFriends").get().then(snap=>{
            const friendsList = snap.val()
            if(friendsList === null) return
            if(friendsList.indexOf(props.userId) !== -1){
                setNewFriend(false)
            }
        })
    },[newFriend])
    const addFriend = useCallback(()=>{
        const path = firebase.database().ref("users").child(currentUserId)
        path.child("userFriends").get().then(snap=>{
            if(snap.val()===null){
                path.update({
                    userFriends: [props.userId]
                })
            }else{
                path.update({
                    userFriends: [...snap.val(),props.userId]
                })
            }
        }).then(()=>setNewFriend(false))
    },[props.userId])
    const removeFriend = useCallback(()=>{
        const path = firebase.database().ref("users").child(currentUserId)
        path.child("userFriends").get().then(snap=>{
            console.log(snap.val())
            if(snap.val()===null)return
            path.update({
                userFriends: snap.val().filter(item=>item!==props.userId)
            })
        }).then(()=>setNewFriend(true))
    },[props.userId])
    return (
        <div className="profileSet">
            {userData.userName !== "--"?
            <div className="formSet">
                <div className="surName"> 
                    <p>{userData.userName}</p>
                    <p>{userData.userSurname}</p>
                </div>
                <div className="profilePic">
                    <img src={userData.userProfilePicture} />
                </div>
                <p style={{marginTop: .5 + "rem"}}>{userData.userDescription}</p>
                {(currentUserId !== "false" && currentUserId !== props.userId)?
                    <>
                    {newFriend?
                        <button onClick={addFriend} className="friendBtn green">Add Friend<img src="pictures/add2.svg"/></button>
                        :
                        <button onClick={removeFriend} className="friendBtn red">Remove Friend<img src="pictures/delete.svg"/></button>
                    }
                    </>
                    :""
                }
            </div>:
            <div className="loader">
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>}
        </div>
    )
}
