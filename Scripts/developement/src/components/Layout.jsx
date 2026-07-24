import React, { Component } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/layout.css";

class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebarOpen: true,
    };
  }

  toggleSidebar = () => {
    this.setState((prevState) => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  };

  render() {
    return (
      <div className="layout">
        <Sidebar
          sidebarOpen={this.state.sidebarOpen}
          toggleSidebar={this.toggleSidebar}
        />

        <div className="main-content">
          <Navbar
            sidebarOpen={this.state.sidebarOpen}
            toggleSidebar={this.toggleSidebar}
          />

          <main className="content">
            <div className="container">
              {this.props.children}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Layout;