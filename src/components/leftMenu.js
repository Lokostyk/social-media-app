import React from "react";
import LoginOrRegister from "./loginOrRegister";

function Menu(props){
    return (
        <React.Fragment>
            <div className="menu">
            <LoginOrRegister />
                <ul>
                    <li><button>Posts</button></li>
                    <li><button>Friends</button></li>
                    <li><button>Games</button></li>
                </ul>
            </div>
        </React.Fragment>
    )
}
export default Menu