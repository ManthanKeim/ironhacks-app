import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme';
const units = Theme.UNITS;

const Select = styled('select')`
  height: 30px;
  padding: 0 10px;
  display: flex;
  justify-content: flex-end;
  background-color: #f2f2f2;
  border: 1px solid #999999;
  border-radius: ${units.universalBorderRadius};

  margin-left: 10px;
`;

class ForumSelector extends React.Component {
  onChange = (event) => {
    this.props.onSelection(event.target.value);
  };

  render() {
    return (
      <Select onChange={this.onChange}>
        {this.props.selector.map((selector, i) => {
          return (
            <option key={selector.name} value={i}>
              {selector.name}
            </option>
          );
        })}
      </Select>
    );
  }
}

export default ForumSelector;