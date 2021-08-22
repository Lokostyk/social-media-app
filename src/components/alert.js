import React from 'react'

export default function Alert(props) {
    function removeAlert(){
        props.setAlert({"style":"noDisplay","txt":"","functions":""})
    }
    function btnType(item){
        if(item === "delete"){
            return <button onClick={removeAlert}><img src="pictures/delete.svg" alt="delete icon"/></button>
        }else {
            return ""
        }
    }
    return (
        <div className={props.alert.style}>
            <p>{props.alert.txt}</p>
            {btnType(props.alert.functions)}
        </div>
    )
}
