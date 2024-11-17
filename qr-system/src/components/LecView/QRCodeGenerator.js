import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Correct import for SVG-based QR code
import './QRstyle.css';

const QRCodeGenerator = () => {
    const [text, setText] = useState('');
    const [size, setSize] = useState(256);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };

    return (
        <div>
            <h1>QR Code Generator</h1>
            <div className="container">
                <label htmlFor="text-input">Enter Text/URL:</label>
                <input
                    type="text"
                    id="text-input"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Enter text or URL"
                />
                <label htmlFor="size-input">QR Code Size (pixels):</label>
                <input
                    type="number"
                    id="size-input"
                    min="1"
                    value={size}
                    onChange={handleSizeChange}
                />
                <button id="generate-btn">
                    Generate QR Code
                </button>
            </div>
            <div id="qr-code-container">
                {text && (
                    <QRCodeSVG
                        value={text}
                        size={parseInt(size)}
                    />
                )}
            </div>
        </div>
    );
};

export default QRCodeGenerator;
