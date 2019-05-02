import React from 'react';
import firebase from 'firebase'
import './App.css';
import FileUpload from './FileUpload';

class App extends React.Component{
  constructor(){
    super();
    this.state = {
      user: null,
      pictures: []
    };
    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this)
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user=>{
      this.setState({
        user
      })
    });
    firebase.database().ref('pictures').on('child_added', snapshot=>{
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      })
    })
  }

  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result=>console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error=>console.log(`Error ${error.code}: ${error.message}`))
  }
  handleLogout(){
    firebase.auth().signOut()
      .then(result=>console.log(`${result.user.email} ha cerrado sesión`))
      .catch(error=>console.log(`Error ${error.code}: ${error.message}`))
  }
  handleUpload(event){
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/Photos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot =>{
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({
            uploadValue: percentage
        })
    }, error=>{ 
        console.log(error.message,'hola');
    }, ()=>{
      const record = {
                      photoURL: this.state.user.photoURL,
                      displayName: this.state.user.displayName,
                      image: task.snapshot.downloadURL
                    };
      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    });
}

  renderLoginButton(){
    //if user's logg
    if(this.state.user){
      return(                     
        <div>
          <img src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p>Hola {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}>Salir</button>
          <FileUpload onUpload={this.handleUpload}/>
          {
            this.state.pictures.map(picture=>(
              <div>
                <img src={picture.image}/>
                <br/>
                <img src={picture.photoURL} alt={picture.displayName}/>
                <br/>
                <span>{picture.displayName}</span>
              </div>
            ))
          }
        </div>
      );
    }else{
      return(
        <button onClick={this.handleAuth}>Login con Google</button>
      )
    }
    //if don't
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <h2>Social App</h2>
          {this.renderLoginButton()}
        </header>
      </div>
    );
  }
}

export default App;
