import React from 'react'
import '../stylesheets/RegistrationForm.css'

export default function RegistrationForm() {
    return (

        <div className='form-container'>
            <form action="" method="">
                <label for="parent-name">Your full name:</label>
                <input type="text" id="parent-name" name="parent-name" placeholder='ex: John Smith' required></input>

                <label for="child-name">Your child's full name:</label>
                <input type="text" id="child-name" name="child-name" placeholder='ex: Abby Smith' required></input>

                <label for="child-age">How old is your child?</label>
                <input type="number" id="child-age" name="child-age" required min="0" max="5" value="1"></input>

                <label for="services">Are they receiving services at WCEL?</label>
                <div className='services-container'>
                    <input type="radio" id="services" name="services" value="yes"></input>
                    <label>Yes</label>

                    <input type="radio" id="services" name="services" value="no"></input>
                    <label>No</label>
                </div>

                <label for="relationship">Which best describes you?</label>
                <div className='relationship-container'>
                    <input type="radio" id="relationship" name="relationship" value="parent"></input>
                    <label>Parent</label>

                    <input type="radio" id="relationship" name="relationship" value="grandparent"></input>
                    <label>Grandparent</label>

                    <input type="radio" id="relationship" name="relationship" value="guardian"></input>
                    <label>Legal Guardian</label>

                    <input type="radio" id="relationship" name="relationship" value="Nanny"></input>
                    <label>Nanny</label>
                </div>

                <label for="email">Email address:</label>
                <input type="email" id="email" name="email" placeholder='ex: John.Smith@gmail.com' required></input>

                <label for="phone">Contact Number:</label>
                <input type="tel" id="phone" name="phone" pattern="([0-9]{3}) [0-9]{3}-[0-9]{4})" placeholder='ex: (123) 456-7890' required></input>

                <label for="languages">Do you speak any additional languages? If so, please select all that apply.</label>
                    <div className='language-options'>
                        <div>
                            <input type="checkbox" value="Latin"></input>
                            <label>Latin</label>
                        </div>
                        <div>
                            <input type="checkbox" value="Spanish"></input>
                            <label>Spanish</label>
                        </div>
                        <div>
                            <input type="checkbox" value="Portugese"></input>
                            <label>Portugese</label>
                        </div>
                        <div>
                            <input type="checkbox" value="German"></input>
                            <label>German</label>
                        </div>
                        <div>
                            <input type="checkbox" value="Japanese"></input>
                            <label>Japanese</label>
                        </div>
                        <div>
                            <input type="checkbox" value="Korean"></input>
                            <label>Korean</label>
                        </div>
                        <div>
                            <input type="checkbox" value="Russian"></input>
                            <label>Russian</label>
                        </div>
                        <div>
                            <input type="checkbox" value="French"></input>
                            <label>French</label>
                        </div>
                        <div>
                            <input type="checkbox" value="Chinese"></input>
                            <label>Chinese</label>
                        </div>
                        <div>
                            <input type="checkbox" value="Arabic"></input>
                            <label>Arabic</label>
                        </div>
                        <div>
                            <input type="checkbox" value="Italian"></input>
                            <label>Italian</label>
                        </div>
                        <input type="text" placeholder='Other...'></input>
                    </div>
                    <label for="reference">How did you hear about us?</label>
                    <input type="text" placeholder='ex: My child has previously received services at WCEL'></input>
                   <input type="submit"></input> 
            </form>
        </div>
    )
}