import React, { Component, Fragment } from 'react';
import './Announcements.css';
import { Button, Modal, Icon, Table } from 'react-materialize';
import DropdownScreen from '../DropdownScreen/DropdownScreen';
import Dropdown from '../Dropdown/Dropdown';
//import ReactPlayer from 'react-player';  este es para el video de youtube
import 'firebase/database';
import firebaseApp from '../../firebase/firebaseApp';

let screen2Push;
let startTime;
let endTime;
let startMin;
let startHr;
let endMin;
let endHr;
let IntStartHr;
let IntStartMin;
let IntEndtHr;
let IntEndMin;
let name2render;
let arrayScreens= [];
let arrayAnnoun =[];
let values2;
let startDB;
let endDB;
let video2Push;
let updateAnnounRef;

const timeNumber = [];

for (let i = 0; i <= 23; i++) {

    for (let j = 0; j <= 59; j = j + 15) {

        if (i < 10 && j < 10) {
            timeNumber.push({ key: `0${i}:0${j}`, name: `0${i}:0${j}` });
        }

        if (i < 10 && j >= 10) {
            timeNumber.push({ key: `0${i}:${j}`, name: `0${i}:${j}` });
        }

        if (i >= 10 && j >= 10) {
            timeNumber.push({ key: `${i}:${j}`, name: `${i}:${j}` })
        }

    }

}

class Announcements extends Component {
    
    state = {
        screenName: 'Screen2',
        name: '',
        schedules: [
            {
                video: 'Birthday.mp4',
                start: '00:00',
                end: '00:00',
            },
        ],
        schedulesShow: [],
        showResults: false,
        showResults2: false,
        screenList: [],
        screens: [],
        annoucements: [],
        videosDropDown: [],
        videoDefault: 'null',
        quantityInput: 0,
        warning: false
    }

    componentDidMount() {
        updateAnnounRef= firebaseApp.database().ref().child("Announcements");

        firebaseApp.database().ref(`Inventory_Announcements/`) //ANNOUNCEMENTS
        .on('value', (data) => {
            values2 = data.val();
            arrayAnnoun=[];
            console.log("values2", values2);
            
            this.setState({ annoucements: values2 }, () => {
              Object.keys(this.state.annoucements).map((key, index) => {
                  arrayAnnoun.push({name: values2[key].name, key:index}); 
                  
                  //se lee todo el objeto con values2[key]
                  //console.log("values2[key]",values2[key].name);
                 
                  this.setState({videosDropDown: arrayAnnoun }); 

                  return arrayAnnoun;
             }
          );
          });

        }, (err) => {
            console.log(err);
        });

        firebaseApp.database().ref(`Inventory`) //screens
        .on('value', (data) => {
            let values = data.val();
            arrayScreens=[];
            this.setState({ screens: values }, () => {
              Object.keys(this.state.screens).map((key, index) => {
                  arrayScreens.push({name: key, key:index}); 
                  this.setState({screenList: arrayScreens }); 
                  return arrayScreens;
             }
          );
          });

        }, (err) => {
            console.log(err);
        });
    }
    
    handleScreenChange = (name, value) => {
        this.setState({ screenName : value });
    }

    handleScheduleChange = (index, name, value) => {
        const schedules = this.state.schedules;
        const scheduleToModify = schedules[index];

        scheduleToModify[name] = value;
        schedules[index] = scheduleToModify;

        this.setState({schedules}, () => {
            console.log(this.state.schedules[index]);
        });
    }


    handleChange = (event) => {
        let variable= event.target.value;
        let n = variable.length;

        if (n > 50){
            n= n - 50;
            n= n*(-1);
            this.setState({quantityInput: n});
            this.setState({warning: true});
        }
        
        else{
            n= 50 - n;
            this.setState({quantityInput: n});
            this.setState({warning: false});
            this.setState({ name: event.target.value});
        }
       
    }

    changeTrigger2 = () =>{  //turns off the "enable aler"
        this.setState(prevState => {
            screen2Push= this.state.screenName;
            
            if (screen2Push === "all" ){
                let i=0;
                updateAnnounRef.once('value', function(snapshot){
                  
                    snapshot.forEach(function(snap){
                        i=i+1;
                        console.log(`Screen${i}`);
                        updateAnnounRef.child(`Screen${i}`).update({"Trigger2": 0 });  
                    });

                    alert('Disable to all screens');
                    window.location.reload();
                })
                   
            }
        
            else{
                updateAnnounRef.once('value', function(snapshot){
                    updateAnnounRef.child(`${screen2Push}`).update({"Trigger2": 0 });  

                    alert(`Disable screen ${screen2Push}`);
                    window.location.reload();
                })                      
            }
        });

    }

    sendApplyNow = () => {
        let inputText2;
        this.setState(prevState => {
            
            inputText2= this.state.name;
            video2Push= this.state.schedules[0].video;
            startDB= this.state.schedules[0].start;
            endDB= this.state.schedules[0].end;
            screen2Push= this.state.screenName;
          
    
            if (name2render === ""){
                alert("Fill all the inputs!");
            }  

            else {

                if (screen2Push === "video1"){
                    video2Push= this.state.videoDefault;
                }
                if (screen2Push === "all" ){
                    let i=0;
                    updateAnnounRef.once('value', function(snapshot){
                        snapshot.forEach(function(snap){
                            i=i+1;
                            
                            updateAnnounRef.child(`Screen${i}`).update({
                                "Text2": inputText2,
                                "VideoName2": video2Push,
                                "startTime": startDB,
                                "endTime": endDB,
                                "Trigger2": 1
                            });                
                        });

                        alert('Send to all screens');
                        window.location.reload();
                    }) 
                }
        
               else{
                    updateAnnounRef.once('value', function(snapshot){
                        updateAnnounRef.child(`${screen2Push}`).update({
                            "Text2": inputText2,
                            "VideoName2": video2Push,
                            "startTime": startDB,
                            "endTime": endDB,
                            "Trigger2": 1                  
                        });

                            alert(`Send to screen ${screen2Push}`);
                            window.location.reload();
                    })                     
                }
            
            }
        });

    }

    requestDB = () => {  // shows current schedules per screen
        let screenName2;
        this.setState(prevState => {
            screenName2= this.state.screenName;
            this.setState({ showResults: false});
            this.setState({ showResults2: false});

            if(screenName2 === "All Screens"){
                alert("Select a different opction. i.e: Screen1, Screen2 ....");
            }

            else{
                screenName2= screenName2.replace(" ",""); 
                firebaseApp.database().ref(`Announcements/${screenName2}/Trigger1`)
                    .on('value', (data) => {
                        let values = data.val();
                       
                        if(values !== 0){
                            firebaseApp.database().ref(`Announcements/${screenName2}`)
                            .on('value', (data) => {
                                values2 = data.val();
                                this.setState({ schedulesShow: values2 });
                                this.setState({ showResults: true});

                            }, (err) => {
                                console.log(err);
                            });   
                        }
                    }, (err) => {
                        console.log(err);
                    });  
                
                    firebaseApp.database().ref(`Announcements/${screenName2}/Trigger2`)
                        .on('value', (data) => {
                            let values3 = data.val();
                            if(values3 !== 0){
                                firebaseApp.database().ref(`Announcements/${screenName2}`)
                                .on('value', (data) => {
                                
                                let values4 = data.val();
                                this.setState({ schedulesShow: values4 });
                                this.setState({ showResults2: true});

                            }, (err) => {
                                console.log(err);
                            });   
                            }
                        
                    }, (err) => {
                            console.log(err);
                    });  
                }    
        });
    }

    sendToDb = () => {
        let i=0;
        let inputText1;

        this.setState(prevState => {
        
        screen2Push= this.state.screenName;
        name2render= this.state.name;
        inputText1= this.state.name;
        video2Push= this.state.schedules[0].video;
        startDB= this.state.schedules[0].start;
        endDB= this.state.schedules[0].end;
       
        if (name2render === ""){
            alert("Fill all the inputs!")
        }  
        
        else {
                if (this.state.schedules[0].start === "" ||
                    this.state.schedules[0].end === "" ||
                    this.state.screenName === "" ||
                    this.state.schedules[0].video === "") {
                    alert("Not valid entry!, fill all the inputs")
                }
    
                if (this.state.schedules[0].start !== "" && this.state.schedules[0].end !== "" &&
                    this.state.screenName !== "" && this.state.schedules[0].video !== "") {

                    startTime = this.state.schedules[0].start;
                    endTime = this.state.schedules[0].end;
                    startHr = startTime.slice(0, -3);
                    startMin = startTime.slice(-2);
    
                    IntStartHr = parseInt(startHr,10);
                    IntStartMin = parseInt(startMin,10);
    
                    endHr = endTime.slice(0, -3);
                    endMin = endTime.slice(-2);
    
                    IntEndtHr = parseInt(endHr,10);
                    IntEndMin = parseInt(endMin,10);
    
                    if (IntStartHr > IntEndtHr) {
                        alert('Invalid Schedule');
                    }
    
                    if (IntStartHr === IntEndtHr && IntStartMin > IntEndMin) {
                        alert('Invalid Schedule');
                    }
    
                    if (IntStartHr === IntEndtHr && IntStartMin === IntEndMin) {
                        alert('Invalid Schedule');
                    }
    
                    else{ 

                        if(screen2Push === "all"){
                            updateAnnounRef.once('value', function(snapshot){
                                snapshot.forEach(function(snap){
                                    i=i+1;
                                    updateAnnounRef.child(`Screen${i}`).update({
                                        "Text1": inputText1,
                                        "VideoName1": video2Push,
                                        "startTime": startDB,
                                        "endTime": endDB,
                                        "Trigger1": 1
                                    });                
                                });
    
                                alert('Send to all screens');
                                window.location.reload();
                            })
                        }

                        else{
                            updateAnnounRef.once('value', function(snapshot){
                                updateAnnounRef.child(`${screen2Push}`).update({
                                        "Text1": inputText1,
                                        "VideoName1": video2Push,
                                        "startTime": startDB,
                                        "endTime": endDB,
                                        "Trigger1": 1                  
                                });
    
                               alert(`Send to screen ${screen2Push}`);
                               window.location.reload();
                            })  
                        }
                        
                    }
                }
             
            }
        });
      
    }

    selectAll = () => {
        alert("Selected all screens")
        this.setState({screenName: "all"});
    }
    

    render() {
        return (
            <div className="Announcements" >
                <div className="row"> 

                    <div>
                        <h2 className="headerHBDPromo"> Anuncios </h2>                     
                    </div>

                    <div className="col s12">
                        <div className="col s12">
                            <div className= "fixButtonPadding">
                                <Button  
                                    onClick={() => {
                                        this.requestDB();
                                        
                                }}
                                type="submit" value="Apply"> Mostrar horario actual </Button>
                            </div>
                        </div>
                       

                        { this.state.showResults2 ? (
                            <div className="row">
                                <div className="col s12">
                                    <div className="fixTop">
                                        <p className="titleHead"> Mostrando un anuncio en pantallas </p>
                                        <div className="pageCenter">
                                            <Table className="quickTable">
                                                <thead>
                                                    <tr>
                                                        <th>Video</th>
                                                        <th>Anuncio en pantallas</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr >
                                                        <td> {this.state.schedulesShow.VideoName2} </td>
                                                        <td> {this.state.schedulesShow.Text2} </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )  : (
                                <div>
                                    <br/>
                                    <p> No hay ningún anuncio en pantallas </p>
                                    <br/>
                                </div>
                            )
                        }
                    </div>

   
                    <div className="col s12">
                      <div className="col s12">
                      <div className="addBorderAnnoun">
                      <br/>
                            {   
                                this.state.schedules.map((value, index, key) => (
                                    <Fragment key={index}>
                                        <div className="row">
                                            <div className="col s12">
                                                <Dropdown 
                                                    handleChange={this.handleScheduleChange}
                                                    name="video"
                                                    index={index} 
                                                    items={this.state.videosDropDown} />
                                            </div>
                                        </div>
                                    </Fragment>
                                ))
                            }

                            <div className = "row">  
                                <div className="col s12">
                                    <input className="inputName" 
                                            ref={input => { this.textInput = input; }}
                                            type="text" value={this.state.value} 
                                            placeholder=" Escriba un anuncio ..."
                                            onChange={this.handleChange} 
                                    />
                                    <h6> Cantidad máxima de letras: 50 letras  </h6>
                                    { this.state.warning  ? (
                                        <p className="subtitlesHeadAnn1"> Agregue un contenido con menos letras 
                                            (Cantidad de letras: {this.state.quantityInput})</p>
                                        ): <p className="subtitlesHeadAnn2"> Cantidad de letras: {this.state.quantityInput}</p>

                                    }
                                </div>
                            </div>

                            <div className = "row">    
                                <div className="col s6">
                                    <div className="btnMargin2">
                                        <Button  
                                            onClick={() => {
                                                this.sendApplyNow();
                                        }}
                                        type="submit" value="Apply"> Encender </Button>
                                    </div>
                                </div>
                            
                                <div className="col s6">
                                    <div className="btnMargin2">
                                        {''}
                                        <Button  
                                            onClick={() => {
                                                this.changeTrigger2();
                                        }}
                                        type="submit" value="Apply"> Apagar </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    </div>
                </div>
                
               
            </div>
        )
    }
}

export default Announcements;
