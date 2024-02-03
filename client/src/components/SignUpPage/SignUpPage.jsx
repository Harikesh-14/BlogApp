import React, { useState } from 'react'
import './SignUpPage.css'

function SignUpPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')
    const [password, setPassword] = useState('')

    const registerForm = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/register-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, number, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error === 'User already exists') {
                    alert('The user already exists');
                } else {
                    alert('Internal Server Error');
                }
            } else {
                alert('Registration successful! Login to move further');
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <form className='registrationForm' onSubmit={registerForm}>
                <div className="headerArea">
                    <h1>Here you can Register</h1>
                    <p>Let's join us &#8594;</p>
                </div>

                <div className="inputFields">
                    <div className="inputArea">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inputArea">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inputArea">
                        <label>Email ID</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inputArea">
                        <label>Phone Number</label>
                        <input
                            type="number"
                            name="number"
                            value={number}
                            onChange={e => setNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inputArea">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type='submit'>Sign Up</button>
                </div>

            </form>
        </>
    )
}

export default SignUpPage