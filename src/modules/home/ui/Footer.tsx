import Link from "next/link";
import React from "react";
import { FaFacebook, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-[#373737] p-4 md:p-5">
      <div className="flex flex-col md:flex-row gap-8 md:gap-20 justify-center items-center md:items-start">
        <div className="flex flex-col gap-2 py-4 md:py-6 text-center md:text-left">
          <h3 className="text-white text-lg md:text-xl">Địa chỉ liên lạc</h3>
          <p className="text-white text-sm md:text-base hover:text-gray-200 max-w-xs">
            32 Tân Xuân, Phường Tân Hòa, Thành phố Hồ Chí Minh
          </p>
        </div>

        <div className="flex flex-col gap-2 py-4 md:py-6 text-center md:text-left">
          <h3 className="text-white text-lg md:text-xl">Mạng xã hội</h3>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link href="https://www.facebook.com/profile.php?id=100068910341526">
              <FaFacebook className="w-5 h-5 text-blue-600 hover:text-blue-200 transition-colors" />
            </Link>
            <Link href="https://www.youtube.com/@gxtantrang2223">
              <FaYoutube className="w-6 h-6 text-red-600 hover:text-red-200 transition-colors" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col py-4 md:py-6 gap-2 text-center md:text-left">
          <h3 className="text-white text-lg md:text-xl">Google Maps</h3>
          <div className="relative w-full h-full">
            <iframe
              title="Bản đồ dẫn đến Giáo Xứ Tân Trang"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.310541418218!2d106.65006127484403!3d10.7875106589896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752eb5f441514d%3A0x63828e704877011c!2zTmjDoCB0aOG7nSBUw6JuIFRyYW5n!5e0!3m2!1svi!2s!4v1752049526506!5m2!1svi!2s"
              width="300"
              height="150"
              className="w-full max-w-sm md:w-96 md:h-48"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
