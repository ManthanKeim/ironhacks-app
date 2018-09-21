// IronHacks Platform
// admin.js
// Created by: Alejandro Díaz Vecchio - aldiazve@unal.edu.co

import React from 'react';
import { Redirect } from 'react-router-dom';
//Styled components
import styled, {ThemeProvider} from 'styled-components';
//Custom components
import HackCard from './hackCard.js';
//Custom Constants
import * as Constants from '../../../constants.js';

const theme = Constants.AppSectionTheme;

//Section container
const SectionContainer = styled('div')`
  width: 100%;
  height: ${props => props.theme.containerHeight};
  background-color: ${props => props.theme.backgroundColor};

  h1 {
    margin-bottom: 20px;

    &:first-child {
      margin-top: 150px;
    }
  }
`;
const Separator = styled('div')`
  width: 100%;
  height: 1px;
  background-color: ${Constants.mainBgColor};
  margin: 5px 0 5px 0;
`;
const CardsContainer = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 70px;
`;

class Admin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      startNewHackNav: false,
      startDashboardNav: false,
      hacks: [],
    };
  }

  componentDidMount(){
    this.getHacks();
  }

  //Query all the hacks objects from the db.
  getHacks = () => {
    const firestore = window.firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    firestore.settings(settings);
    const _this = this;
    var hacks = [];
    firestore.collection("hacks").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        hacks.push(doc);
      });
      _this.setState({hacks: hacks});
    })
    .catch(function(error) {
        console.error("Error getting documents: ", error);
    });
  };

  goToNewHack = () => {
    this.setState({startNewHackNav: true})
  };

  goToHackDashBoard = (hackIndex) => {
    this.setState((prevState, props) => {
      return {
        startDashboardNav: true,
        selectedHack: prevState.hacks[hackIndex],
      }
    });
  };

  render() {
    if (this.state.startNewHackNav === true) return <Redirect to='admin/newHack'/>;
    if (this.state.startDashboardNav === true){
      const selectedHack = this.state.selectedHack.data();
      const selectedHackId = this.state.selectedHack.id;
      const hackName = selectedHack.name
      const pathname = '/admin/dashboard/' + hackName;
      return <Redirect to={{
        pathname: pathname,
        state: {hack: selectedHack, hackId: selectedHackId}
      }}
      />;
    }

    return (
      <ThemeProvider theme={theme}>
      <SectionContainer className="container-fluid">
        <div className="row">
          <div className='col-md-8 offset-md-2'>
          	<h1>Welcome to IronHacks Platform!</h1>
            <span>Belllow you will find all the availabe hacks, click on one of them to see more details.</span>
            <Separator/>
            <CardsContainer>
              <HackCard newHack={true} onClick={this.goToNewHack}/>
              {this.state.hacks.map((hack, index) => {
                return <HackCard hack={hack} index={index} key={hack.id} onClick={this.goToHackDashBoard}/>
              })}
            </CardsContainer>
          </div>
        </div>
      </SectionContainer>
      </ThemeProvider>
    );
  }
}

export default Admin;