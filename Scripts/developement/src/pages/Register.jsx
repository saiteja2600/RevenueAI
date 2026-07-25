import React, { Component } from "react";
import { FcGoogle } from "react-icons/fc";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { password: "" };
  }

  getStrength() {
    const { password } = this.state;
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    return "strong";
  }

  render() {
    const strength = this.getStrength();

    return (
      <div className="auth-shell">

        {/* Left: brand panel */}
        <div className="auth-brand">
          <div className="auth-brand-top">
            <div className="navbar-logo">RevenueAI</div>
          </div>

          <div className="auth-brand-mid">
            <h1>Built for teams scaling digital commerce.</h1>
            <p>
              Connect payments, analyze customer data, and grow revenue
              with fintech-grade infrastructure.
            </p>

            <div className="auth-stat-card">
              <div className="auth-stat-label">Merchants onboarded</div>
              <div className="auth-stat-value">12,400+ <span>and growing</span></div>
            </div>
          </div>

          <div className="auth-brand-bottom">
            © {new Date().getFullYear()} RevenueAI. All rights reserved.
          </div>
        </div>

        {/* Right: form panel */}
        <div className="auth-form-panel">
          <div className="auth-card">
            <h2 className="text-center">Create your account</h2>
            <p className="auth-subtitle text-center">Start your free 14-day trial. No card required.</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input className="input" type="text" id="name" placeholder="Jane Doe" />
              </div>

              <div className="field">
                <label htmlFor="company">Company name</label>
                <input className="input" type="text" id="company" placeholder="Acme Inc." />
              </div>

              <div className="field">
                <label htmlFor="email">Work email</label>
                <input className="input" type="email" id="email" placeholder="you@company.com" />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  className="input"
                  type="password"
                  id="password"
                  placeholder="Create a password"
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
                {this.state.password.length > 0 && (
                  <div className={`password-strength ${strength}`}>
                    <span></span><span></span><span></span>
                  </div>
                )}
              </div>

              <div className="option-row">
                <input className="checkbox" type="checkbox" id="terms" />
                <label htmlFor="terms">
                  I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
                </label>
              </div>

              <button className="btn btn-primary btn-block mt-3" type="submit">
                Create account
              </button>
            </form>

            <div className="auth-divider">or</div>

            <button className="auth-oauth-btn">
              <FcGoogle size={18} />
              Sign up with Google
            </button>

            <p className="auth-footer-text">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
        </div>

      </div>
    );
  }
}

export default Register;