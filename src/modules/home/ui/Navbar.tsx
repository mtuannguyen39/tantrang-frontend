import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div>
      <header className="bg-[#7b1fa2] text-white text-center py-4">
        <h1 className="text-lg font-bold">GIÁO XỨ TÂN TRANG</h1>
        <p className="text-sm">Giáo phận Sài Gòn</p>
      </header>
      {/* Navigation */}
      <nav className="py-5 px-4 flex flex-wrap justify-between border-b items-center">
        <Link href="/home" className="text-lg font-bold">
          <p>Giáo xứ Tân Trang</p>
        </Link>
        <div className="flex gap-4 text-lg font-semibold">
          <Link href="#" className="rounded-full border py-2 px-4">
            Trang chủ
          </Link>
          <Link href="#" className="rounded-full border py-2 px-4">
            Giới thiệu
          </Link>
          <Link href="#" className="rounded-full border py-2 px-4">
            Liên hệ
          </Link>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="px-10 py-2 rounded border border-gray-300 bg-white "
        />
      </nav>
    </div>
  );
};

export default Navbar;
