import React, { Component } from "react";
import { FcGoogle } from "react-icons/fc";

class Login extends Component {
  render() {
    return (
      <div className="auth-shell">

        {/* Left: brand panel */}
        <div className="auth-brand">
          <div className="auth-brand-top">
            <div className="navbar-logo">RevenueAI</div>
          </div>

          <div className="auth-brand-mid">
            <h1>Turn every transaction into growth intelligence.</h1>
            <p>
              Track revenue, payments, and customer behavior in one
              dashboard built for modern commerce teams.
            </p>

            <div className="auth-stat-card">
              <div className="auth-stat-label">Avg. revenue lift for partners</div>
              <div className="auth-stat-value">+42% <span>this quarter</span></div>
            </div>
          </div>

          <div className="auth-brand-bottom">
            © {new Date().getFullYear()} RevenueAI. All rights reserved.
          </div>
        </div>

        {/* Right: form panel */}
        <div className="auth-form-panel">
          <div className="auth-card">
            <h2 className="text-center">Welcome back</h2>
            <p className="auth-subtitle text-center">Log in to your RevenueAI account.</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input className="input" type="email" id="email" placeholder="you@company.com" />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input className="input" type="password" id="password" placeholder="Enter your password" />
              </div>

              <div className="auth-row-between">
                <label className="option-row" style={{ margin: 0 }}>
                  <input className="checkbox" type="checkbox" id="remember" />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password">Forgot password?</a>
              </div>

              <button className="btn btn-primary btn-block" type="submit">
                Log in
              </button>
            </form>

            <div className="auth-divider">or</div>

            <button className="auth-oauth-btn">
              <FcGoogle size={18} />
              Continue with Google
            </button>

            <p className="auth-footer-text">
              Don't have an account? <a href="/register">Sign up</a>
            </p>
          </div>
        </div>

      </div>
    );
  }
}

export default Login;