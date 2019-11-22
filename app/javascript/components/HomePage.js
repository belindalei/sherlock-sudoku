import React from 'react';
import NavBar from '../components/HeaderComponent/NavBar'
import Footer from '../components/HeaderComponent/Footer'

class HomePage extends React.Component {
  render(){
    return(
      <>
        <NavBar/>
        <h1>Home</h1>
        <Footer/>
      </>
    )
  }

}

export default HomePage;