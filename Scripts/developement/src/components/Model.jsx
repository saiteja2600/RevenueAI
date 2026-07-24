import React, { Component } from "react";
import "./modal.css";

class Modal extends Component {

  render() {

    const {
      isOpen,
      onClose,
      title,
      children,
      size = "md",
      variant = "default",
      rounded = "md",
      shadow = "md",
      centered = true,
      scrollable = false
    } = this.props;

    if (!isOpen) return null;

    return (

      <div
        className={`modal-overlay ${centered ? "modal-overlay-center" : ""}`}
      >

        <div
          className={`
                        modal
                        modal-${size}
                        modal-${variant}
                        modal-rounded-${rounded}
                        modal-shadow-${shadow}
                        ${scrollable ? "modal-scrollable" : ""}
                    `}
        >

          <div className="modal-header">

            <h3>{title}</h3>

            <button
              className="modal-close"
              onClick={onClose}
            >
              ✕
            </button>

          </div>

          <div className="modal-body">

            {children}

          </div>

          <div className="modal-footer">

            <button
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="btn btn-primary">
              Save
            </button>

          </div>

        </div>

      </div>

    );

  }

}

export default Modal;