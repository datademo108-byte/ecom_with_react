import React from 'react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Industries from '../components/Industries'
import WhyChooseUs from '../components/WhyChooseUs'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import CarausalData from '../components/carausaldata'
import { useContext } from "react";
import { DataContext } from "../context/DataContext";


function Home() {

  const data = useContext(DataContext);

  return (
    <>
     <CarausalData />
      <Hero />
      <Services/>
      <Industries/>
      <WhyChooseUs/>
      <Contact/>
      <Footer/>
    
  
    
    
    
    
    </>


  )
}

export default Home