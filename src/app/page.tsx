import Main from "@/layouts/Main";
import Navbar from "../layouts/navbar";
import AllSection from "@/layouts/allSection";
import Image from "next/image";
import Footer from "@/layouts/Footer";
import BottomNav from "@/layouts/BottomNav";

export default function Home() {
  return (
    <div className="bg-slate-900">
      <Navbar/>
      <Main/>
      <AllSection />
      <Footer/>
      <BottomNav/>
    </div>
  );
}
