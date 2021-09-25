import React from 'react'
import { useState } from 'react/cjs/react.development'

export default function ChatList() {
    const [displayFriendList,setDisplayFriendList] = useState(false)

    return (
        <div className="chatBox">
            <button onClick={()=>setDisplayFriendList(!displayFriendList)}>Friends <span>(0)</span></button>
        </div>
    )
}
