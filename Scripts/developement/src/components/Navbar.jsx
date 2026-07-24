import React, { Component } from "react";
import { HiMenu } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar bg-dark">

        {/* Left */}
        <div className="navbar-left">
          <button
            className="menu-btn"
            onClick={this.props.toggleSidebar}
          >
            <HiMenu />
          </button>

          <div className="navbar-logo">
            RevenueAI
          </div>
        </div>

        {/* Right */}
        <div className="navbar-right">
          <button className="login-btn">
            Login
          </button>

          <div className="avatar">
            <FaUserCircle />
          </div>
        </div>

      </nav>
    );
  }
}

export default Navbar;