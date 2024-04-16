import React from "react";
import logo from "./logo.png";
import "./IDK.css";

function idk() {
    return (
        <>

            <div className="container">
        <div className="left-section">
            <p className="selected-tutors">Handpicked tutors from £22/hour</p>
            <p>We're very picky about who we let tutor on our platform - just 1 in 8 who apply make the cut. They're experts in over 30 subjects from KS2 up to GCSE and A Level. Because they're from the UK, they've studied (and aced) the same courses as your teen in the last few years. So they can talk tricky concepts in a way teens understand - and they double as cool older role models.</p>
            <img className="tutor-illustration" src={logo} alt="Selected Tutors" />
        </div>
        <div className="right-section">
        <p className="trusted-text">Trusted by parents & teachers</p>
            <p>MyTutor is the UK’s most trusted tutoring platform by parents. We’re rated 4.9/5 on Trustpilot from the million (and counting!) lessons we’ve delivered so far. And because our tutors get such good results, schools use them to support their teaching. We work with 650+ across the UK, targeting learning gaps and helping teens everywhere achieve their goals.</p>
            <img className="teacher-illustration" src={logo} alt="Trusted Teachers" />
        </div>
    </div>
        </>
    );
}

export default idk;
