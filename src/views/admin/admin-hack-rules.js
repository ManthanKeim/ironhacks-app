import React from 'react';
import styled from 'styled-components';
import MarkdownEditor from '../../components/markdown-editor';
import Button from '../../util/button.js';

const AvailableActionsDiv = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  height: 50px;
`;

class AdminHackTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.previousDocument || '',
    }
    this.onEditorChange = this.onEditorChange.bind(this);
    this.updateHackRules = this.updateHackRules.bind(this)
  }

  encodeDocument(str) {
    let safeString = unescape(encodeURIComponent(str));
    return window.btoa(safeString);
  }

  decodeDocument(enc) {
    let decoded = window.atob(enc);
    return decodeURIComponent(escape(decoded));
  }

  onEditorChange(markdown) {
    this.setState({content: markdown})
  }

  updateHackRules() {
    this.setState({loading: true})
    let encodedDoc = this.encodeDocument(this.state.content);
    let timeUpdated = new Date();
    let rulesDoc = {
      doc: encodedDoc,
      updated: timeUpdated.toISOString(),
    };

    window.firebase.firestore()
      .collection('hacks')
      .doc(this.props.hackId)
      .update({ rules: rulesDoc })
      .then(() => {
        this.setState({ loading: false })
        window.location.reload();
      })
      .catch((error)=>{
        console.error('Error adding document: ', error);
      })
  }

  render() {
    return (
        <>
          <h2 className="pb-2">
            Hack Rules Document
          </h2>

          <MarkdownEditor
            editorLayout='tabbed'
            onEditorChange={this.onEditorChange}
            value={this.state.content}
          />

          <AvailableActionsDiv>
            <Button
              primary
              width='150px'
              margin='0 0 0 15px'
              onClick={this.updateHackRules}
            >
              Publish
            </Button>
            <a
              href={`/hacks/${this.props.hackSlug}/rules`}
              target="_blank"
              rel="noopener noreferrer"
              >
              View live document
            </a>
          </AvailableActionsDiv>
      </>
    );
  }
}

export default AdminHackTask;
