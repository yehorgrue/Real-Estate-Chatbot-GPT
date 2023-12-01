import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ChatRoom.css";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";

import { ReactComponent as ChatIcon } from "../asserts/svg/chat.svg";
import { ReactComponent as DeleteIcon } from "../asserts/svg/delete.svg";
import assistant from "../asserts/img/assistant.png";

// import data from "../data.json";
import ChatBot from "../components/ChatBot";
import ChatUser from "../components/ChatUser";

const Base_url = process.env.REACT_APP_BASE_URL;

export default function ChatRoom() {
  const [conversations, setCoversations] = useState([]);
  const [convId, setConvId] = useState(1);
  // const convId = 1;
  const userId = 1;
  const [chatinput, setChatinput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [convname, setConvname] = useState("");

  const [focusIndex, setFocusIndex] = useState(0);
  const [waitingInfo, setWaitingInfo] = useState(false);

  const ref = useRef();

  const initailmessage = {
    key: false,
    message: "Hi, I am a real estate assistant. How can I help you today?",
    item: ""
  };
  const initailAllChat = [
    {
      key: false,
      content: initailmessage
    }
  ];
  const [botchat, setBotchat] = useState(initailmessage);
  const [allchat, setAllchat] = useState([
    {
      key: false,
      content: botchat
    }
  ]);

  const [houses, setHouses] = useState([]);
  const imgurls = [
    "https://srdesignconstruction.com/wp-content/uploads/2023/04/1-40.jpg",
    "https://myhousemap.in/wp-content/uploads/elementor/thumbs/front-home-design-images-q5hev8duzg19ddntvmagskm13uvheetxb80fdi84fe.jpg",
    "https://www.buildingplanner.in/images/ready-plans/34N1002.jpg"
  ];

  // Modal Controller
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Get conversations
  const getconversations = async () => {
    axios
      .get(`${Base_url}/api/user/findUser/${userId}`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.conversations.length > 0) {
            const cid = res.data.conversations[0].id;
            setCoversations(res.data.conversations);
            axios
              .get(`${Base_url}/api/user/findConversationById/${cid}`)
              .then((res1) => {
                if (res1.status === 200) {
                  setAllchat(res1.data.messages);
                }
              })
              .catch((error) => {
                if (!axios.isCancel(error)) {
                  console.error("Error fetching data:", error);
                }
              });
          }
        }
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          console.error("Error fetching data:", error);
        }
      });
  };

  useEffect(() => {
    getconversations();
  }, [userId]);

  //Get messages using Conversation id
  const getmessages = async (key) => {
    setFocusIndex(key);
    const cid = conversations[key].id;
    setConvId(cid);

    try {
      const res = await axios.get(
        `${Base_url}/api/user/findConversationById/${cid}`
      );
      setAllchat(res.data.messages);
    } catch (err) {
      alert(err);
    }
  };

  //Creat new conversation
  const createconversation = async () => {
    if (convname === "") {
      alert("Please input conversation name!");
      handleClose();
    } else {
      try {
        const data = {
          name: convname,
          initialmessage: initailmessage
        };
        const res = await axios.post(
          `${Base_url}/api/user/createConversation/${userId}`,
          data
        );
        if (res.status === 200) {
          setCoversations((prev) => [...prev, res.data]);
          setConvname("");
          handleClose();
          setFocusIndex(conversations.length);
          setAllchat(initailAllChat);
        }
      } catch (err) {
        alert(err);
      }
    }
  };

  //Delete Conversation
  const delectconversation = async (key) => {
    const cid = conversations[key].id;
    try {
      const res = await axios.delete(
        `${Base_url}/api/user/deleteConversation/${cid}`
      );
      if (res.status === 200) {
        const newConv = [...conversations];
        newConv.splice(key, 1);
        setCoversations(newConv);
        alert("Deleted!");
      }
    } catch (err) {
      alert(err);
    }
  };

  //Focus on the user input area
  const inputRef = useRef(null);
  const focusInput = () => {
    inputRef.current.focus();
  };

  //Handel Enter key evenet
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Handle the Enter key press event here
      handleOnSend();
    }
  };
  useEffect(() => {
    const inputElement = document.getElementById("chat-inputarea"); // Replace 'myInput' with the actual id of your input element
    inputElement.addEventListener("keydown", handleKeyPress);
    return () => {
      inputElement.removeEventListener("keydown", handleKeyPress);
    };
  });

  //Handel Visit event
  const handleVisit = (zpid) => {
    setWaitingInfo(true);
    axios
      .get(`${Base_url}/api/chat/estateinfo/${zpid}`)
      .then((res) => {
        if (res.status === 200) {
          const url = res.data.data;
          console.log(res);
          window.open(url, "_blank");
        }
        setWaitingInfo(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // Auto scroll in chat show
  const scrollToBottom = () => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [allchat]);

  // Handle  the send button event

  const handleOnSend = async () => {
    if (chatinput === "") {
      alert("Please input the chatbox!");
    } else {
      setIsSending(true);
      const userchat = {
        key: botchat.key,
        query: chatinput,
        item: botchat.item
      };
      setAllchat((prev) => [
        ...prev,
        {
          key: true,
          content: userchat
        }
      ]);
      try {
        const res = await axios.post(
          `${Base_url}/api/chat/${convId}`,
          userchat
        );
        try {
          if (res.data.result.item === "result") {
            try {
              setHouses(res.data.result.message.results);
              setBotchat({
                message: "I found some houses for you.",
                key: false,
                item: ""
              });
              setAllchat((prev) => [
                ...prev,
                {
                  key: false,
                  content: {
                    message: "I found some houses for you.",
                    key: false,
                    item: ""
                  }
                }
              ]);
            } catch (err) {
              console.error(err);
              setBotchat({
                message:
                  "I cannot find any house with your infomation. Please input location again.",
                key: false,
                item: ""
              });
              setAllchat((prev) => [
                ...prev,
                {
                  key: false,
                  content: {
                    message:
                      "I cannot find any house with your infomation. Please input location again.",
                    key: false,
                    item: ""
                  }
                }
              ]);
            }
          } else {
            if (Object.keys(res.data.result).length !== 0) {
              setBotchat(res.data.result);
              setAllchat((prev) => [
                ...prev,
                {
                  key: false,
                  content: res.data.result
                }
              ]);
            }
          }
        } catch (err) {
          throw err;
        }
        setIsSending(false);
        setChatinput("");
      } catch (err) {
        alert(err);
        setIsSending(false);
      }
    }
    focusInput();
  };

  return (
    <>
      <div className='chat-main'>
        <div className='conversation-list'>
          <div className='conversation-create-btn'>
            <Button variant='outline-light' style={{ width: "100%" }}>
              <div
                onClick={handleShow}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "3vw",
                  fontSize: "20px"
                }}>
                <div>+</div>
                <div>New Conversation</div>
              </div>
            </Button>
          </div>
          {conversations.map((conversation, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center"
              }}>
              {index === focusIndex ? (
                <div
                  id='conversation-name'
                  style={{ backgroundColor: "#727a80" }}
                  onClick={() => getmessages(index)}>
                  <ChatIcon id='conversation-chaticon' />
                  <span style={{ userSelect: "none" }}>
                    {conversation.name}
                  </span>
                </div>
              ) : (
                <div id='conversation-name' onClick={() => getmessages(index)}>
                  <ChatIcon id='conversation-chaticon' />
                  <span style={{ userSelect: "none" }}>
                    {conversation.name}
                  </span>
                </div>
              )}
              <div>
                <DeleteIcon
                  id='conversation-deleteicon'
                  onClick={() => delectconversation(index)}
                />
              </div>
            </div>
          ))}
        </div>
        {waitingInfo && (
          <Spinner animation='border' role='status' id='waitingInfo'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
        )}

        <div className='conversation-body'>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Please input conversation name.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* <input onChange={(e) => setConvname(e.target.value)} /> */}
              <Form.Control
                size='lg'
                type='text'
                placeholder='Conversation name'
                onChange={(e) => setConvname(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={handleClose}>
                Close
              </Button>
              <Button variant='primary' onClick={createconversation}>
                Create
              </Button>
            </Modal.Footer>
          </Modal>
          <div id='bg-chatbody'>
            {allchat.map((chat, index) => (
              <div key={index}>
                {chat.key === true ? (
                  <div>
                    <ChatUser msg={chat.content.query} />
                  </div>
                ) : (
                  <div>
                    <ChatBot msg={chat.content.message} />
                  </div>
                )}
              </div>
            ))}
            <div ref={ref} />
          </div>
          <div id='bg-chatinput' />
          <div className='chat-input'>
            <InputGroup className='mb-3'>
              <Form.Control
                id='chat-inputarea'
                as='input'
                aria-label='With input'
                value={chatinput}
                ref={inputRef}
                onChange={(e) => {
                  setChatinput(e.target.value);
                }}
                style={{ padding: "12px" }}
              />
              {isSending ? (
                <Button variant='primary' disabled={conversations === []}>
                  <Spinner
                    as='span'
                    animation='grow'
                    size='sm'
                    role='status'
                    aria-hidden='true'
                  />
                  Waiting...
                </Button>
              ) : (
                <Button
                  variant='primary'
                  onClick={handleOnSend}
                  disabled={!conversations.length > 0 || waitingInfo}>
                  {"   "}
                  &nbsp;&nbsp;&nbsp;Send&nbsp;&nbsp;&nbsp;{"   "}
                </Button>
              )}
            </InputGroup>
          </div>
        </div>
        <div className='conversation-image'>
          {houses.length > 0 ? (
            <div>
              <div>
                <img src={assistant} alt='' id='assistant-show' />
              </div>
              {houses.map((house, index) => (
                <div key={index} id='conv-img'>
                  <Card style={{ marginTop: "20px" }}>
                    <a href={house.imgSrc} target='_blank' rel='noreferrer'>
                      <Card.Img variant='top' src={house.imgSrc} />
                    </a>
                    <Card.Body>
                      <Card.Title>
                        {house.price}&nbsp;&nbsp;{house.currency}
                      </Card.Title>
                      <Card.Text>
                        <p>
                          <b>Street:</b> {house.streetAddress}
                        </p>
                        <p>
                          <b>City, State and Zipcode:</b> {house.city},&nbsp;
                          {house.state}
                          ,&nbsp;{house.zipcode}
                        </p>
                        <p>
                          <b>Bed rooms:</b> {house.bedrooms}
                        </p>
                        <p>
                          <b>Bath rooms:</b> {house.bathrooms}
                        </p>
                      </Card.Text>
                      <Button
                        variant='primary'
                        onClick={() => handleVisit(house.zpid)}
                        disabled={waitingInfo}>
                        Visits
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {imgurls.map((img, index) => (
                <div key={index} id='conv-img'>
                  <a href={img} target='_blank' rel='noreferrer'>
                    <img src={img} alt='' />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
