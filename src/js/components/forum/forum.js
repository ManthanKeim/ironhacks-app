// IronHacks Platform
// forum.js - forum main Component
// Created by: Alejandro Díaz Vecchio - aldiazve@unal.edu.co

import React from 'react';
//Styled components
import styled, {ThemeProvider} from 'styled-components';
//Router
import {Link} from "react-router-dom";
//Custom Components
import ThreadPreview from './threadPreview.js'
import SponsorsBanner from '../sponsorsBanner/sponsorsBanner.js'
import ForumSelector from './forumSelector.js'
//Custom Constants
import * as Constants from '../../../constants.js';
//Image references
import searchIcon from './img/searchIcon.svg';

const theme = Constants.AppSectionTheme;

//Section container
const SectionContainer = styled('div')`
  width: 100%;
  height: ${props => props.theme.containerHeight};
  background-color: ${props => props.theme.backgroundColor};

  .flex {
    display: flex;
  } 
`;
//Header
const MainHeader = styled('h1')`
  display: flex;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 40px;
  font-weight: 800;
`;
//Controls
const Control = styled('div')`
  height: 30px;
  margin-bottom: 15px;
`;
//New thread button
const NewThreadButton = styled('button')`
  height: 30px;
  font-weight: 700;
  padding-left: 10px;
  padding-right: 10px;
  border: none;
  border-radius: ${Constants.universalBorderRadius}
  background-color: ${Constants.mainBgColor};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${Constants.buttonHighlightedBgColor};
  }

  a {
    color: black;

    &:hover {
      text-decoration: none;
      color: black;
    }
  }
`;
//SearchBar Container
const SearchBar = styled('form')`
  height: 30px;
  display: flex;
  justify-content: flex-end;

  input {
    width: 60%;
    height: 100%;
    background-color: #F2F2F2;
    border: 1px solid #999999;
    border-right: none; 
    border-radius: ${Constants.universalBorderRadius} 0px 0px ${Constants.universalBorderRadius};
    padding-left: 10px;
  }

  button {
    height: 100%;
    background-color: #F2F2F2;
    border: 1px solid #999999;
    border-left: none;
    border-radius: 0px ${Constants.universalBorderRadius} ${Constants.universalBorderRadius} 0px;
    padding-left: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }
`;
//ThemeProviderreads Holder
const ForumThreads = styled('div')`
  margin-bottom 10px;
  overflow: auto;
`;
//ForumHeader
const ForumHeader = styled('div')`
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  margin-bottom: ${Constants.threadPreviewBottomMargin};
  background-color: ${Constants.forumHeaderColor}
  border-radius: ${Constants.universalBorderRadius}

  h2 {
    margin-bottom: 0;
  }
`;
//Section separator -- TODO: move to a separate file
const SectionSeparator = styled('div')`
  background-color: ${Constants.mainBgColor}
  height: 1px;
  width 100%;
  margin-top: calc(${Constants.threadPreviewBottomMargin} + 10px);
  margin-bottom: calc(${Constants.threadPreviewBottomMargin} + 10px);
`;

class Forum extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      threads: [],
      selectedHack: 0,
    }
    this.firestore = window.firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    this.firestore.settings(settings);
  };

  componentDidMount(){
    this.getThreads();
    if(this.props.user.isAdmin){
      this.getHacks();
    };
  }

  getThreads = () => {
    const _this = this;
    var threads = [];
    this.firestore.collection('threads')
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        threads.push(doc);
      });
      _this.setState({threads: threads});
    })
    .catch(function(error) {
        console.error("Error getting documents: ", error);
    });
  };

//---------------------------------------- Admin features ------------------------------------------

  //Query all the hacks objects from the db.
  getHacks = () => {
    const _this = this;
    var hacks = [];
    this.firestore.collection("hacks")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const hackData = doc.data()
        hackData.id = doc.id;  
        hacks.push(hackData);
        _this.firestore.collection('adminHackData').doc(doc.id)
      });
      _this.setState({hacks: hacks});
      _this.getForums();
    })
    .catch(function(error) {
        console.error("Error getting documents: ", error);
    });
  };

  getForums = (hackIndex) => {
    const _this = this;
    const forums = [];
    const index = hackIndex ? hackIndex : 0;
    this.firestore.collection('forums')
    .where('hack', '==', this.state.hacks[index].id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        forums.push(doc.data());
      });
      _this.setState((prevState, props) => {
        prevState.hacks[index].forums = forums;
        return prevState;
      })
    })
    .catch(function(error) {
        console.error("Error getting documents: ", error);
    });
  };

  onHackSelection = (hackIndex) => {
    if(this.state.hacks[hackIndex].forums){
      this.setState({selectedHack: hackIndex});
    }else{
      this.setState({selectedHack: hackIndex});
      this.getForums(hackIndex);
    };
  };

  onForumSelection = (forumIndex) => {
    console.log(forumIndex)
  }

//---------------------------------------- Admin features ------------------------------------------

  render() {
    console.log(this.props)
    return (
      <ThemeProvider theme={theme}>
        <SectionContainer className='container-fluid d-flex flex-column'>
          <div className="row">
            <div className='col-12'>
            	<MainHeader>Purdue Unal Fall 2018</MainHeader>
            </div>
          </div>
          <Control className="row">
            <div className='col-4 offset-2 flex'>
              <NewThreadButton><Link to='forum/new'>Create a new thread</Link></NewThreadButton>
              {this.props.user.isAdmin 
                && this.state.hacks 
                && <ForumSelector onSelection={this.onHackSelection} selector={this.state.hacks}/>}
              {this.props.user.isAdmin 
                && this.state.hacks 
                && this.state.hacks[this.state.selectedHack].forums
                && <ForumSelector onSelection={this.onForumSelection} selector={this.state.hacks[this.state.selectedHack].forums}/>}
            </div>
            <SearchBar className='col-4'>
              <input type='text' placeholder='Search...'/>
              <button><img src={searchIcon} alt='searchIcon'/></button>
            </SearchBar>
          </Control>
          <div className="row flex-grow-1">
            <ForumThreads className='col-8 offset-2'>
              <ForumHeader><h2>Pinned</h2></ForumHeader>
              {this.state.threads.map((thread, index) => {
                return(
                  <ThreadPreview key={thread.id}
                    thread={thread}
                  />
                )
              })}
              <SectionSeparator/>
              <ForumHeader><h2>General discussion</h2></ForumHeader>
            </ForumThreads>
          </div>
          <div className="row">
            <div className='col-8 offset-2'>
              <SponsorsBanner></SponsorsBanner>
            </div>
          </div>
        </SectionContainer>
      </ThemeProvider>
    );
  }
}

export default Forum;