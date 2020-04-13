import React from "react";

export const Gallery = (props) => (
    <div className="gallery">
        <div className="pixies">
            {props.pixArray.map((value) => {
                return (
                    <div className="pix">
                        <div className="pix-container">
                            <img className="pix-img" src={value.url} alt=""/>
                            <div className="pix-selector" onClick={() => props.showPixFullscreen(value.url)}></div>
                        </div>
                    </div>
                )
            })}
        </div>
        <a className="button bottomed" href="/api/v1/download/pixcollector.zip" download>
            <div className="label">Download</div>
        </a>
    </div>
);