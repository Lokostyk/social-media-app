import React,{ useState, useEffect } from 'react'
import firebase from 'firebase/app'
import "firebase/storage"

export default function OtherUserProfile(props) {
    const [userData,setUserData] = useState({userName: "--",userSurname:"--",userDescription:""})
    
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
    },[])
    

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
            </div>:
            <div className="loader">
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>}
        </div>
    )
}
