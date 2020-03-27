import React from 'react';
import {Redirect} from 'react-router-dom';
import styled, {ThemeProvider} from 'styled-components';
import * as Constants from '../../constants.js';

const theme = Constants.Error404Theme;

const SectionContainer = styled('div')`
  width: 100%;
  height: 100vh;
  background-color: ${Constants.mainBgColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > h1 {
    font-size: 60px;
    font-weight: 900;
    line-height: 40px;
  }

  h1 span {
    font-weight: 300;
  }

  h2 {
    font-weight: 300;
  }
`;


/**
 * 404 Error Page
 *
 * @component
 */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigate: false,
    };
  }

  render() {
    if (this.state.navigate === true) {
      return (
        <Redirect to='/hackSelection'/>
      );
    }
    return (
      <ThemeProvider theme={theme}>
        <SectionContainer>
          <h2><span>PURDUE </span>IRONHACKS</h2>
          <h1>404 PAGE NOT FOUND :'(</h1>
        </SectionContainer>
      </ThemeProvider>
    );
  }
}

export default Login;
