import React,{useState,useRef} from 'react'
import firebase from 'firebase/app'

const usersData = []

firebase.database().ref().child("users").get().then((snapshot)=>{
    if(snapshot.exists()){
        const data = snapshot.val()
        const keys = Object.keys(snapshot.val())
        keys.forEach((key)=>{
            usersData.push([key,data[key].userName,data[key].userSurname])
        })
    }
})
export default function TopBar() {
    const [searchValue,setSearchValue] = useState("Search friends...")
    const [users,setUsers] = useState([])
    
    function displayUsers(){
        setSearchValue("")
        setUsers(usersData)
    }
    function openProfile(key){
        console.log(key)
    }
    function removeUsers(){
        setTimeout(()=>setUsers([]),70)
    }
    return (
        <nav className="topBar">
            <form onSubmit={(e)=>e.preventDefault()} onBlur={removeUsers}>
                <input value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} onClick={displayUsers} />
                <ul className={"searchedUsers"} >
                    {users.map((user)=> <li key={user[0]}><button onClick={()=>openProfile(user[0])}>{user[1] + " " + user[2]}</button></li>)}
                </ul>
            </form>
        </nav>
    )
}
