import React from "react";
import "./modal.css";

const Modal = (props) => {
  if (!props.show) {
    return null;
  }
  return (
    <div className="modal" onClick={props.onClose}>
      <div className="model-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">{props.title}</h4>
        </div>
        <div className="modal-body"> {props.children}</div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={props.onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
