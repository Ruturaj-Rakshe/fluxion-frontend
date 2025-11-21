import {
  IconBrandDiscord,
  IconBrandInstagram,
  IconBrandTwitter,
} from "@tabler/icons-react";
import React from "react";
import { Button } from "./ui/button";
import ButtonFooter from "./ButtonFooter";

export const Footeer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* About Us */}
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-bold text-white mb-4 bbh-sans-bartle">© Fluxion</h2>
          <div className="bg-white rounded-2xl shadow-2xl p-0.5 w-full max-w-sm flex justify-center items-center">
            <video
              src="/videos/footervid.mp4"
              muted
              playsInline
              autoPlay
              loop
              className="rounded-xl w-full h-auto"
            ></video>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white bbh-sans-bartle">Quick Links</h2>
          <ul className="space-y-2 text-xl">
            <li>
            <ButtonFooter title="Home" href="/"/>
            </li>
            <li>
              <ButtonFooter title="About" href="/aboutUs"/>
            </li>
            <li>
              <ButtonFooter title="Reach" href="/contact"/>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white bbh-sans-bartle">Follow Us</h2>
          <ul className="flex space-x-5">
            <li>
              <a href="#" className="hover:text-indigo-400">
                <IconBrandDiscord size={28} />
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                <IconBrandTwitter size={28} />
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-400">
                <IconBrandInstagram size={28} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
        © 2025 Company name here. All rights reserved.
      </div>
    </footer>
  );
};
