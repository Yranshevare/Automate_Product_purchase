import React from 'react'

export default function Toast({handleBannerClick,isBannerClosing,handleCloseBanner}) {

  return (
    <div className={`info-banner ${isBannerClosing ? "closing" : ""}`} onClick={handleBannerClick}>
        <div className="info-icon-container">
          <img src="/info-icon.svg" alt="Info Icon" className="info-icon" />
        </div>
        <div className="info-text">
          <p className="info-title">do you know that ?</p>
          <p className="info-description">
            you can generate the requirement sheet via AI so simple and easy
          </p>
        </div>
        <button className="close-button" onClick={handleCloseBanner}>
          X
        </button>
    </div>
  )
}
