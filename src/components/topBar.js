import React,{useState} from 'react'
import firebase from 'firebase/app'

export default function TopBar() {
    const [searchValue,setSearchValue] = useState("Search friends...")
    const [users,setUsers] = useState([])

    function getUsers(){
        setSearchValue("")
        firebase.database().ref().child("users").get().then((snapshot)=>{
            if(snapshot.exists()){
                const userData = snapshot.val()[Object.keys(snapshot.val())]
                setUsers([...users,userData])
            }
        })
    }
    function removeUsers(){
        setUsers([])
    }
    return (
        <nav className="topBar">
            <form onSubmit={(e)=>e.preventDefault()} onBlur={removeUsers}>
                <input value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} onClick={getUsers} />
                <ul className={"searchedUsers"} >
                    {users.map((e)=> <li>{e.userName}</li>)}
                </ul>
            </form>
        </nav>
    )
}
