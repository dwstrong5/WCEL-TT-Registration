import React from 'react'
import Image from "../images/tt-banner.jpg"
import "../stylesheets/Banner.css"

export default function Banner() {
    return (
        <div className="banner-container">
            <img className="banner-image" src={Image} alt="Four children holding heart-shaped objects in outstretched hands over a wooden table."/>
        </div>
    )
}