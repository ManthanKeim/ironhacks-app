import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme';
import './assets/style.css';

const colors = Theme.COLORS;


const CardContainer = styled('button')`
  height: 150px;
  width: 30%;
  margin: 10px;
  text-align: left;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.3);
  border: none;
  background-color: white;
  padding: 0;

  &.newHackCard {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      color: ${colors.mainBgColor};
      font-size: 20px;
      font-weight: 800;
      margin: 0;

      &:first-child {
        line-height: 40px;
        font-size: 40px;
      }
    }
  }

  h3 {
    line-height: 16px;
    margin: 0 0 0 15px;
  }

  span {
    font-size: 12px;
    margin-left: 15px;
  }
`;


class AdminNewHackCard extends React.Component {
  onHackCardClick() {
    this.props.onClick(
      this.props.index,
      this.props.hack.registrationSurvey
    )
  }

  render() {
    return (
      <CardContainer
        className='newHackCard'
        onClick={this.props.onClick}
        >
        <span>+</span>
        <span>Add Hack</span>
      </CardContainer>
    )
  }
}


export { AdminNewHackCard }
