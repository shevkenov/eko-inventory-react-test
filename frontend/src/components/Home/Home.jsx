import React from 'react'

import HomeItems from '../Home/HomeItems/HomeItems';
import Spinner from '../Spinner/Spinner'; 

export default function Home(props) {
  const home = props.isLoading ? <Spinner /> : <HomeItems {...props}/>  
  
  return home;
}