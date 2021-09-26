import React from "react";

function Menu(props){
    return (
        <ul>
            <li><button onClick={()=>props.display("")}>Posts</button></li>
            <li><button onClick={()=>props.display("ProfileSettings")} disabled={!(props.loggedIn)}>Your profile</button></li>
            <li><button onClick={()=>props.display("FriendList")} disabled={!(props.loggedIn)}>Friends List</button></li>
            <li><button>Games</button></li>
        </ul>
    )
}
export default React.memo(Menu)