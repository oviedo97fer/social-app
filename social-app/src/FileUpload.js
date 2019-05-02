import React, { Component } from 'react'

class FileUpload extends Component {
    constructor(){
        super();
        this.state={
            uploadValue: 0,
        };
        
    }
   
    render() {
        return (
        <div>
            <progress value={this.uploadValue} max='100'></progress>
            <br/>
            <input type='file' onChange={this.props.onUpload}/>
            <br/>
        </div>
        )
  }
}

export default FileUpload;
