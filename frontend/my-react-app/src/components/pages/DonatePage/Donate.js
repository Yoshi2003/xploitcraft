import React from 'react';
import './Donate.css';

function Donate() {
    const handleCopyAddress = () => {
        const bitcoinAddress = document.getElementById("bitcoinAddress");
        navigator.clipboard.writeText(bitcoinAddress.value);
        alert("Bitcoin address copied to clipboard!");
    };

    return (
        <div className="donate-container">
            <div className="donate-box">
                <h1 className="donate-title">Hello Friend!</h1>
                <p className="donate-description">
                    Thanks for using the site. I started this project to make studying a bit more fun and accessible for everyone. Maintaining it involves a few costs—like the OpenAI API, AWS, SendGrid, and Splunk. If you find this platform valuable and would like to support its growth, feel free to contribute via Bitcoin to the address below.
                </p>
                <div className="bitcoin-box">
                    <input
                        type="text"
                        id="bitcoinAddress"
                        value="Your_Bitcoin_Address_Here"
                        readOnly
                    />
                    <button onClick={handleCopyAddress} className="copy-button">Copy</button>
                </div>
            </div>
            <div className="thanks-message">
                <p>Thanks!</p>
            </div>
        </div>
    );
}

export default Donate;




