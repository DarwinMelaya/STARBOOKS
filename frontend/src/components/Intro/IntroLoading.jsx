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
      <div className="intro-border" />
      <div className="intro-card">
        <img
          src="/logo.png"
          alt="Project Monitoring Logo"
          className="intro-logo"
        />
        <p className="intro-tagline">Project Monitoring</p>
      </div>
    </div>
  );
};

export default IntroLoading;
