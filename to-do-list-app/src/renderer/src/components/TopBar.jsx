import React, { useEffect } from "react";

export default function TopBar() {

    useEffect(() => {
        const minimizeButton = document.getElementById('minimize-btn');
        const closeButton = document.getElementById('close-btn');

        const handleMinimize = () => {
            window.api.minimizeWindow();
        };

        const handleClose = () => {
            window.api.closeWindow();
        };

        // Attach event listeners
        if (minimizeButton) minimizeButton.addEventListener('click', handleMinimize);
        if (closeButton) closeButton.addEventListener('click', handleClose);

        // Cleanup event listeners when component unmounts
        return () => {
            if (minimizeButton) minimizeButton.removeEventListener('click', handleMinimize);
            if (closeButton) closeButton.removeEventListener('click', handleClose);
        };
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    return (
        <div id="top-bar-container">
            <nav style={{ WebkitAppRegion: "drag" }}>
                <div id="top-bar" className="bg-blue-400 w-screen h-8 p-1">
                    <span>Top Bar</span>
                </div>
                <div id="control-buttons" className="absolute top-1 right-0 pe-2">
                    <button id="minimize-btn"
                        // onClick={handleMinimize}
                        className="text-xl"
                        style={{ WebkitAppRegion: "no-drag" }}
                    >
                        _
                    </button>
                    <button id="close-btn"
                        // onClick={handleClose}
                        className="text-xl"
                        style={{ WebkitAppRegion: "no-drag" }}
                    >
                        x
                    </button>
                </div>
            </nav>
        </div>
    )
}
