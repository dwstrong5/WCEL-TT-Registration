import React from 'react'
import Image from "../images/github-mark-white.png"
import "../stylesheets/Footer.css"
export default function Footer() {
    return (
        <div class="footer">
            <a href="https://github.com/dwstrong5/tt-registration">
                <img src={Image} alt="GitLab logo with transparent background" />
            </a>
            Whatcom Center for Early Learning
        </div>
    )
}