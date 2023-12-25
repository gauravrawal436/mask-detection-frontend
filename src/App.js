import React, {Component} from 'react';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Rank from './component/Rank/Rank';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import SignIn from './component/SignIn/SignIn';
import Register from './component/Register/Register';
import './App.css';
import ParticlesBg from 'particles-bg'

const initialState = {
  input : '',
  imageUrl : '',
  box : {},
  route : 'signin',
  isSignedIn : false,
  user : {
    id : '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component{
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user : {
        id : data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (resp) => {

    const image = document.getElementById('inputImage');
    const width = image.width;
    const height = image.height;
    // console.log(width, height);
    console.log(resp.data[0].x0);
    const isMasked = resp.data[0].masked;
    /*
    regions.forEach(region => {
        // Accessing and rounding the bounding box values
        const boundingBox = region.region_info.bounding_box;
        const topRow = boundingBox.top_row.toFixed(3);
        const leftCol = boundingBox.left_col.toFixed(3);
        const bottomRow = boundingBox.bottom_row.toFixed(3);
        const rightCol = boundingBox.right_col.toFixed(3);
        region.data.concepts.forEach(concept => {
            // Accessing and rounding the concept value
            const name = concept.name;
            const value = concept.value.toFixed(4);
            console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
        });
    }); */
    
    // const boundingBox = resp.data[0];

      const topRow = resp.data[0].y1.toFixed(3);
      const leftCol = resp.data[0].x0.toFixed(3);
      const bottomRow = resp.data[0].y0.toFixed(3);
      const rightCol = resp.data[0].x1.toFixed(3);
      // region.data.concepts.forEach(concept => {
      //     // Accessing and rounding the concept value
      //     const name = concept.name;
      //     const value = concept.value.toFixed(4);
      //     console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
      // });
      return {
        leftcol: leftCol * width,
        toprow: topRow * height,
        rightcol: width - (rightCol * width),
        bottomrow: height - (bottomRow * height)
      }  
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageUrl : this.state.input});

    // fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifiRequestOptions(this.state.input))
        fetch('https://tranquil-thicket-60642-f4f4798631e5.herokuapp.com/imageurl', {
          method : 'post',
          headers : {'Content-Type' : 'application/json'},
          body : JSON.stringify({
            input : this.state.input
          })
        })
        .then(response => response.json())
        .then(result => {

          console.log(result);

          if(result.data[0].masked){
            fetch('https://tranquil-thicket-60642-f4f4798631e5.herokuapp.com/image', {
              method : 'put',
              headers : {'Content-Type' : 'application/json'},
              body : JSON.stringify({
                id : this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}));
            })
            .catch(console.log)
          }
          this.displayFaceBox(this.calculateFaceLocation(result))
        })   
        .catch(error => console.log('error', error));
    
    
  }

  onRouteChange = (route) => {
    if(route === 'register' || route === 'signin')
      this.setState(initialState);
    else
      this.setState({isSignedIn : true});

    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
        <div className="App">
            <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
            <ParticlesBg className='particles' type="circle" bg={true} />
            {
                this.state.route === 'signin' ?
                    <SignIn loadUser = {this.loadUser} onRouteChange={this.onRouteChange} />
                    : this.state.route === 'register' ?
                        <Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange} />
                        :
                        <div>
                            <Logo />
                            <Rank name = {this.state.user.name} entries = {this.state.user.entries} />
                            <ImageLinkForm
                                onPictureSubmit={this.onPictureSubmit}
                                onInputChange={this.onInputChange}
                            />
                            <FaceRecognition box={box} imageUrl={imageUrl} />
                        </div>
            }
        </div>
    );
}

}

export default App;
