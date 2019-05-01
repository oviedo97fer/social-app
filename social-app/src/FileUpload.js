import React, { Component } from 'react'
import firebase from 'firebase'

export class FileUpload extends Component {
    constructor(){
        super();
        this.state={
            uploadValue: 0,
            picture: null
        };
        this.handleUpload = this.handleUpload.bind(this);
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
           storageRef.getDownloadURL().then(url => {this.setState({picture:url})});
        })
    }
    render() {
    return (
      <div>
          <progress value={this.uploadValue} max='100'></progress>
          <br/>
          <input type='file' onChange={this.handleUpload}/>
          <br/>
          <img width='320' src={this.state.picture}/>
      </div>
    )
  }
}

export default FileUpload;
