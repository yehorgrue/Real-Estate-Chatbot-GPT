import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatRoom from "./screens/ChatRoom";
import HomeScreen from "./screens/HomeScreen";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/chatroom' element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
