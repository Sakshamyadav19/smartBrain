import './App.css';
import React, { Component } from 'react';
import 'tachyons';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/navigation';
import Logo from './components/Logo/logo';
import Rank from './components/Rank/rank';
import ImageForm from './components/ImageForm/imageform';
import FaceRecognition from './components/FaceRecognition/facerecognition.js';
import SignIn from './components/Signin/signin';
import Register from './components/Register/register';

const paramoptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 600
      }
    }
  }
}



const intitState={
  input: '',
  imageurl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user:{
    id:'',
    name:'',
    email:'',
    password:'',
    entries:0,
    joined:''
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = intitState;
  }

  loadUser=(data)=>{
    this.setState({user: {
        id:data.id,
        name:data.name,
        email:data.email,
        password:data.password,
        entries:data.entries,
        joined:data.joined
    }})
  }

  calculateFace = (response) => {
    const face = response.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const height = Number(image.height);
    const width = Number(image.width);
    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height),
    }
  }

  displayFace = (box) => {
    this.setState({ box: box });
  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonClick = () => {
    this.setState({ imageurl: this.state.input });
    fetch('http://localhost:3001/imageurl',{
            method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  input: this.state.input,
              })
          })
          .then(response=>response.json())
      .then(response=>{
        if(response){
          fetch('http://localhost:3001/image',{
            method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  id: this.state.user.id,
              })
          })
          .then(responses=>responses.json())
          .then(count=>{
            this.setState(Object.assign(this.state.user,{entries:count}))
          })
      }
        this.displayFace(this.calculateFace(response))
      }
      )
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout')
      this.setState( intitState )
    else if (route === 'home')
      this.setState({ isSignedIn: true })
    this.setState({ route: route })
  }

  render() {
    const { isSignedIn, imageurl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={paramoptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        { route === 'home' ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageForm onInputChange={this.onInputChange} onButtonClick={this.onButtonClick} />
            <FaceRecognition imageurl={imageurl} box={box} />
          </div>
          : (
            route === 'signin'
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
