import React from "react";
// import { ReactComponent as BotUser } from "../asserts/svg/chatuser.svg";
import chatuser_avatar from "../asserts/img/chatuser.png";

export default function ChatUser(props) {
  return (
    <div id='user-container'>
      {/* <BotUser id='user' /> */}
      <div id='chat-user'>{props.msg}</div>
      <img src={chatuser_avatar} alt='' id='bot' />
    </div>
  );
}
