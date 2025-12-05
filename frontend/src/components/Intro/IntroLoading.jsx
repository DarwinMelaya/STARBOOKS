import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./IntroLoading.css";

const IntroLoading = ({ onComplete, navigateTo = "/home" }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        navigate(navigateTo);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, onComplete, navigateTo]);

  return (
    <div className="intro-loading">
      <div className="intro-glow intro-glow-one" />
      <div className="intro-glow intro-glow-two" />
      <div className="intro-glow intro-glow-three" />

      <div className="intro-card">
        <div className="intro-logo-frame">
          <img
            src="/logo.png"
            alt="Project Monitoring Logo"
            className="intro-logo"
          />
          <div className="intro-logo-ring"></div>
        </div>

        <div className="intro-text">
          <p className="intro-kicker">Department of Science and Technology</p>
          <h1 className="intro-title">Science and Technology Atlas</h1>
          <p className="intro-subtitle">
            Loading the interactive map experience...
          </p>
        </div>

        <div className="intro-progress">
          <span className="intro-progress-dot"></span>
          <span className="intro-progress-dot"></span>
          <span className="intro-progress-dot"></span>
        </div>
      </div>
    </div>
  );
};

export default IntroLoading;
