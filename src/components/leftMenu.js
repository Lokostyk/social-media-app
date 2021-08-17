import React from "react";

function Menu(props){
    return (
        <ul>
            <li><button onClick={props.display("ProfileSettings")}>Your profile</button></li>
            <li><button>Posts</button></li>
            <li><button>Friends</button></li>
            <li><button>Games</button></li>
        </ul>
    )
}
export default Menu