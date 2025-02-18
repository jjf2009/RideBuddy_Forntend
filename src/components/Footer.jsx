import React from 'react';
import { Linkedin, Instagram, Twitter, Github } from 'lucide-react';
import { FaCar } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <div>
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <span className="text-4xl font-bold flex flex-row gap-1 ">
            <FaCar/>Ride Buddy
            </span>
          <p className="max-w-xs">
            RideBuddy
            <br />
            Simple and friendly, like a buddy for rides
          </p>
        </div>
      </div>
      
      {/* Social Links Section */}
      <div>
        <span className="footer-title">Follow Jared </span>
        <div className="flex gap-4 mt-4">
          <a
            href="https://www.linkedin.com/in/jared-furtado/"
            className="hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com/jaredf.official/"
            className="hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://x.com/JF2009_official"
            className="hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/jjf2009"
            className="hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;