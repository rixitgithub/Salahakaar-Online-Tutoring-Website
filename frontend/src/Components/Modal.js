import React from "react";
import "./Modal.css"; // Import the CSS file for styling

function Modal({ onClose, children }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
}

export default Modal;
