import { Component } from 'react';
import { PhaseInterval } from './lib/phase-interval';
import styled from 'styled-components';


const PhaseItem = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 10px 0 10px 15px;
`;


export default class Phase extends Component {
  onCodingHandler = () => {
    this.props.onFocusHandler(this.props.phaseIndex, 'coding');
  };

  onEvaluationHandler = () => {
    this.props.onFocusHandler(this.props.phaseIndex, 'evaluation');
  };

  render() {
    return (
      <PhaseItem>
        <PhaseInterval
          intervalName='Coding'
          phaseIndex={this.props.phaseIndex}
          start={this.props.dates.coding.start}
          end={this.props.dates.coding.end}
          onClick={this.onCodingHandler}
        />
        <PhaseInterval
          intervalName='Evaluation'
          phaseIndex={this.props.phaseIndex}
          start={this.props.dates.evaluation.start}
          end={this.props.dates.evaluation.end}
          onClick={this.onEvaluationHandler}
        />
      </PhaseItem>
    );
  }
}
