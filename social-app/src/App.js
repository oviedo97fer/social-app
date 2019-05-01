import React from 'react';
import logo from './logo.svg';
import firebase from 'firebase'
import './App.css';

class App extends React.Component{
  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result=>console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error=>console.log(`Error ${error.code}: ${error.message}`))
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <h2>Social App</h2>
          <button onClick={this.handleAuth}>Login con Google</button>
        </header>
      </div>
    );
  }
}

export default App;
