import React, { Component } from 'react';
import 'firebase/database';
import './Home.css';

class Home extends Component {
    state = {
        screenName: 'Screen 1',
        day: '1',
        month: 'January',
    }

    render() {
        return (
            <div>
               
                <div>
                    <img src={require("./nogales.jpg")} alt="" className="img-responsive" />
                </div>                
             
            </div>
        )
    }
}
export default Home;



