import React from "react";
import Performance from "./Performance";
import Performance1 from "./Performance1";
import HomeHead from "./HomeHead";
import Navbar from "./Navbar";
import AboutUs from "./AboutUs";
import Testimonials from "./Testimonials.jsx";
import Speciality1 from "./Speciality1.jsx";
import Footer from "./Footer.jsx";
import Us from "./Us.jsx";

function Home() {
  return (
    <>
      <HomeHead />
      <Us />
      <AboutUs />
      <Speciality1 />
      <Performance />
      <Testimonials id="Testimonials" />
      <Performance1 />
      {/* <Footer /> */}
    </>
  );
}

export default Home;
