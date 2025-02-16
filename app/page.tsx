import Feature from "@/components/Feature";
import Footer from "@/components/Footer";
import { Hero } from "@/components/hero";
import Header from "@/components/ui/header";
import Image from "next/image";

export default function Home() {
  return (
   <>
    <Header/>
    <Hero/>
    <Feature/>
    <Footer/>
   </>
  );
}
