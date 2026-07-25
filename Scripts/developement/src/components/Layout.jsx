import React, { Component } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
  }

  toggleSidebar() {
    this.setState((prev) => ({ sidebarOpen: !prev.sidebarOpen }));
  }

  closeSidebar() {
    this.setState({ sidebarOpen: false });
  }

  render() {
    const { sidebarOpen } = this.state;

    return (
      <div className="app-shell">
        <Navbar toggleSidebar={this.toggleSidebar} />

        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={this.toggleSidebar}
        />


        {sidebarOpen && (
          <div
            className="sidebar-overlay show"
            onClick={this.closeSidebar}
          />
        )}


        <main className="page-content">
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default Layout;