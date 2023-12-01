import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Header from "../components/Header";

import "./HomeScreen.css";
import image1 from "../asserts/img/carousel/c1.jpg";
import image2 from "../asserts/img/carousel/c2.jpg";
import image3 from "../asserts/img/carousel/c3.jpg";
import image4 from "../asserts/img/carousel/c4.jpg";

const ImageData = [image1, image2, image3, image4];

export default function HomeScreen() {
  return (
    <div>
      <div className='header'>
        <Header />
      </div>
      <div>
        <Carousel data-bs-theme='dark'>
          {ImageData.map((image, index) => (
            <Carousel.Item>
              <img className='d-block w-100' src={image} alt='First slide' />
              {/* <Carousel.Caption>
                <h5>First slide label</h5>
                <p>
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </p>
              </Carousel.Caption> */}
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
