import React from "react";

export default function TopBar() {

    const handleClose = () => {
        window.electron.ipcRenderer.send("close-window")
    }

    const handleMinimize = () => {
        window.electron.ipcRenderer.send("minimize-window")
    }

    const handleMaximize = () => {
        window.electron.maximizeWindow();
    }

    return (
        <div>
            <div id="top-bar" className="rounded-t-xl bg-blue-400 w-screen h-8"
                style={{ WebkitAppRegion: "drag" }}>
                <span>Top Bar</span>
            </div>
            <div id="control-buttons" className="absolute top-1 right-0 pe-2">
                <button id="minimize"
                    onClick={handleMinimize}
                    className="text-xl"
                    style={{ WebkitAppRegion: "no-drag" }}
                >
                    _
                </button>
                <button id="close"
                    onClick={handleClose}
                    className="text-xl"
                    style={{ WebkitAppRegion: "no-drag" }}
                >
                    x
                </button>
            </div>
        </div>
    )
}
