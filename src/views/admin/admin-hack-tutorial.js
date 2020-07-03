import React from 'react';
import styled from 'styled-components';
import MarkdownEditor from '../../components/markdownEditor/markdownEditor.js';
import AvailableActionsDiv from '../../util/availableActionsDiv.js';
import Button from '../../util/button';

const SectionContainer = styled('div')`
  width: 100%;
  padding: 25px 50px 50px 50px;
  height: ${(props) => props.theme.containerHeight};
`;

class AdmTutorialSection extends React.Component {
  constructor(props) {
    super(props);

    this.onEditorChange = this.onEditorChange.bind(this);
  }

  onEditorChange(markdown) {
    this.props.onTutorialMarkdownUpdate(markdown);
  }

  render() {
    return (
        <>
          <h2 className="pb-2">
            Tutorial document editor
          </h2>

          <MarkdownEditor
            editorLayout='tabbed'
            onEditorChange={this.onEditorChange}
            withContent={this.props.previousDocument}
          />

          <AvailableActionsDiv>
            <Button
              primary
              width='150px'
              margin='0 0 0 15px'
              onClick={this.props.updateTutorialDocument}
            >
              Publish tutorial
            </Button>
          </AvailableActionsDiv>
      </>
    );
  }
}

export default AdmTutorialSection;