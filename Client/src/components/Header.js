import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

import "./Header.css";

export default function Header() {
  return (
    <div>
      <Navbar className='bg-body-transparent'>
        <Container>
          <Navbar.Brand href='/'>Home</Navbar.Brand>
          <Navbar.Brand href='/chatroom'>Get Started</Navbar.Brand>
          <Navbar.Brand href='/chatroom'>Contact</Navbar.Brand>
          {/* <Navbar.Toggle /> */}
          <Navbar.Collapse className='justify-content-end'>
            {/* <Navbar.Text>
              Signed in as: <a href='#login'>Mark Otto</a>
            </Navbar.Text> */}
            <Navbar.Text>
              <a href='#login'>Sign In</a>
            </Navbar.Text>
            <>&nbsp;&nbsp;&nbsp;</>
            <Navbar.Text>
              <a href='#login'>Sign Up</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
