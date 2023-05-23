import React from 'react'
import Image from "../images/1.png"
import "../stylesheets/Logo.css"

export default function AgencyLogo() {
    return (
        <div className='logo-container'>
            <a href='https://www.wcel.net'>
                <img className="logo" src={Image} alt="50th Anniversary Logo for Whatcom Center for Early Learning" />
            </a>
            
        </div>
    )
}