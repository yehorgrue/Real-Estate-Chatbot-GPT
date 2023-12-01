import React from "react";
// import { ReactComponent as BotIcon } from "../asserts/svg/chatbot.svg";
import chatbot_avatar from "../asserts/img/chatbot.jpg";
export default function ChatBot(props) {
  return (
    <div id='bot-container'>
      {/* <BotIcon id='bot' /> */}
      <img src={chatbot_avatar} alt='' id='bot' />
      <div id='chat-bot'>{props.msg}</div>
    </div>
  );
}
