import Main from "@/layouts/Main";
import Navbar from "../layouts/navbar";
import AllSection from "@/layouts/allSection";
import Image from "next/image";
import Footer from "@/layouts/Footer";

export default function Home() {
  return (
    <div className="">
      <Navbar/>
      <Main/>
      <AllSection />
      <Footer/>
    </div>
  );
}
