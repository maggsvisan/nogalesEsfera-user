import React, { Component } from 'react';
import './App.css';
// set database config   "npm i firebase"
import Toolbar from './components/Toolbar/Toolbar';
import Login from './components/Login/Login';
import firebaseApp from './firebase/firebaseApp';

class App extends Component {
  state = {
    notes: [],
    trigger: '',
    user: null,
  };

  constructor() {
    super();

    this.app = firebaseApp;
    this.db = this.app.database().ref().child('Scheduler');

  }
    
  componentDidMount() {
    this.authListener(); 
    //this.showSchedules();
     
  }

  authListener = () => {
    this.app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
      else {
        this.setState({ user: null })
      }
    });
  }


  render() {
    return (

      <div >
        <div className="notesHeader">
          <h1>
           Los Nogales Esfera
          </h1>
          
        </div>

        { this.state.user ? (<Toolbar />) : (<Login />)}

      </div>


    );
  }
}

export default App;
