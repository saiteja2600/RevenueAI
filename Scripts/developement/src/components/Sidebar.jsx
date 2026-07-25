import React, { Component } from "react";
import { HiX } from "react-icons/hi";

class Sidebar extends Component {
  render() {
    return (
      <aside
        className={`sidebar bg-dark ${this.props.sidebarOpen ? "open" : "closed"
          }`}
      >
        <div className="sidebar-header">

          <div className="sidebar-title">
            RevenueAI
          </div>

          <button
            className="close-btn"
            onClick={this.props.toggleSidebar}
          >
            <HiX />
          </button>

        </div>

        <nav className="sidebar-menu">
          <ul>
            <li className="sidebar-item">Dashboard</li>
            <li className="sidebar-item">Analytics</li>
            <li className="sidebar-item">Revenue</li>
            <li className="sidebar-item">Products</li>
            <li className="sidebar-item">Orders</li>
            <li className="sidebar-item">Customers</li>
            <li className="sidebar-item">Marketing</li>
            <li className="sidebar-item">Reports</li>
            <li className="sidebar-item">Settings</li>
          </ul>
        </nav>
      </aside>
    );
  }
}

export default Sidebar;