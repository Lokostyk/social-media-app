import React,{useState} from 'react'
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

export default function TopBar(props) {
    const [searchValue,setSearchValue] = useState("Search friends...")
    const [users,setUsers] = useState([])
    
    function displayUsers(){
        setSearchValue("")
        displayOnlySevenUsers(usersData)
    }
    function openProfile(key){
        props.display(key)
    }
    //Reduce number of displayead users
    function displayOnlySevenUsers(userList) {
        const displaySevenOrLess = userList.length > 7 ? 7 : userList.length
        const sevenUsersDisplay = []
        for(let i = 0;i < displaySevenOrLess;i++){
            sevenUsersDisplay.push(userList[i])
        }
        setUsers(sevenUsersDisplay)
    }
    //Search what user typed in
    function onChange(e) {
        setSearchValue(e.target.value)
        if(e.target.value !== ""){
            const searchedUsers = []
            const re = new RegExp(e.target.value,"i")
            usersData.forEach((user)=>{
                if(re.test(user[1] + " " + user[2])){
                    searchedUsers.push(user)
                }
            })
            displayOnlySevenUsers(searchedUsers)
        }else {
            displayOnlySevenUsers(usersData)
        }
    }
    function removeUsers(){
        setTimeout(intervalLoader,70)
    }
    function intervalLoader() {
        setUsers([])
        setSearchValue("Search friends...")
    }
    return (
        <nav className="topBar">
            <form onSubmit={(e)=>e.preventDefault()} onBlur={removeUsers}>
                <input value={searchValue} onChange={onChange} onClick={displayUsers} />
                <ul className={"searchedUsers"} >
                    {users.map((user)=> <li key={user[0]}><button onClick={()=>openProfile(user[0])}>{user[1] + " " + user[2]}</button></li>)}
                </ul>
            </form>
        </nav>
    )
}
