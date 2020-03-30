import React from 'react';
import {withCookies} from 'react-cookie';
import Showdown from 'showdown';
import {SectionContainer} from '../../layouts/section-container';
// import MarkdownEditor from '../markdownEditor/markdownEditor.js';

const ConverterConfig = {
  tables: true,
  simplifiedAutoLink: true,
  prefixHeaderId: true,
  strikethrough: true,
  headerLevelStart: 3,
  tasklists: true,
};


class TutorialScreen extends React.Component {
  constructor(props) {
    super(props);
    const {cookies} = props;

    this.state = {
      hackName: '',
      // currentHack: cookies.get('currentHack') || null,
      currentHack: 'mmHJrWzmx4rCyQ2YpJWL',
      // forum: cookies.get('currentForum') || null,
      forum: 'qJmgIAFB6FtazeS66vJu',
    };
  }

  componentDidMount() {
    this.getTutorialDocument();
  }

  getTutorialDocument() {
    const firestore = window.firebase.firestore();
    const _this = this;
    firestore.collection('hacks')
        .doc(this.state.currentHack)
        .get()
        .then((doc) => {
          if (doc.data().tutorial) {
            _this.setState({tutorial: doc.data().tutorial, hackName: doc.data().name});
          } else {
            // no task on the response, task not available yet.
            _this.setState({noTutorial: true});
          }
        })
        .catch(function(error) {
          console.error('Error getting documents: ', error);
        });
  };

  decodeBody = (markdown) => {
    const converter = new Showdown.Converter(ConverterConfig);
    return converter.makeHtml(markdown);
  };

  // base64 encoded ascii to ucs-2 string
  atou = (str) => {
    return decodeURIComponent(escape(window.atob(str)));
  };

  render() {
    return (
      <SectionContainer className='container-fluid'>
        {this.state.tutorial && <div dangerouslySetInnerHTML={{__html: this.decodeBody(this.atou(this.state.tutorial.doc))}}/>}
        {this.state.noTutorial && <h1>Task is not available yet!</h1>}
      </SectionContainer>
    );
  }
}

export default withCookies(TutorialScreen);
