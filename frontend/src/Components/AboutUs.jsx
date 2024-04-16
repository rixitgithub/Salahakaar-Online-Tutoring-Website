import React from "react";
import "./AboutUs.css";
import point1 from "./au2.jpg";


function AboutUs() {
  return (
    <>
      <div id="About" className="wholeau">
        <h1>-ABOUT US-</h1>
        <h3>"Embracing the Power of Unity and Learning: Salahakaar, where every question sparks a brighter tomorrow."</h3>
        <div className="row">
          <div className="content">
            We are dedicated to bridging generations through the power of knowledge. At
            Salahakaar, we understand the value of wisdom that comes with age,
            and we believe in harnessing it to benefit learners of all ages.
            <br />
            Our platform connects eager students with seasoned tutors who are
            seniors, bringing a unique blend of expertise, patience, and
            mentorship to every learning experience.
            <br />
            Whether you're seeking academic support, professional guidance, or simply wish to explore
            new interests, our tutors are here to guide you on your educational journey.
            <br />
            <br />
            <span>Join us</span> at Salahakaar and unlock the wealth of knowledge
            that our senior tutors have to offer.
            <br />
          </div>
          <div className="image">
    <img classname= "giff" src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/601014116770475.6068beff4640a.gif" alt="GIF" />
  </div>
        </div>
        {/* <div className="point1"><div className="ptext"><h2><b>Community Support</b></h2><p>We create a sense of belonging and camaraderie among students,
           as they come together to support each other in their academic pursuits. This support network can help students navigate the 
           challenges of their coursework and feel more connected to their peers.</p></div>
           <div><img className="pimg" src={point1}></img></div></div> */}
      </div>
    </>
  );
}


export default AboutUs;
