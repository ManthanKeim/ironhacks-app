import React from 'react';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import styled, { ThemeProvider } from 'styled-components';
// import registerStat from '../../../util/register-stat';
import { NavButton } from '../navigation/nav-button'
import { Theme } from '../../../theme';
import menuIcon from '../../../assets/svg/menu-icon.svg';

const colors = Theme.COLORS;
const styles = Theme.STYLES;
const units = Theme.UNITS;
const themes = Theme.THEMES;

const HeaderContainer = styled('div')`
  height: ${(props) => props.theme.containerHeight};
  background-color: ${colors.mainBgColor}

  .menu {
    display: flex;
    align-items: center;
  }
`;

const NavContainer = styled('nav')`
  display: flex;
  align-items: center;
  font-size: 14px;

  button {
    display: none;
  }

  .links-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* width: 100%; */
    /* height: 100%; */
  }

  @media screen and (max-width: 1200px) {
    position: absolute;
    flex-direction: column;
    align-items: start;
    width: 200px;
    top: 10px;
    left: 15px;

    .links-container {
      display: ${(props) => props.display};
      flex-direction: column;
      align-items: start;
      border-radius: ${units.universalBorderRadius};
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }

    a {
      text-align: left;
      font-weight: 600;
      width: 100%;

      &:hover {
        color: black;
        background-color: lightgray;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    span {
      display: none;
    }

    button {
      display: block;
      width: 30px;
      height: 30px;
      padding: 0;
      border: none;
      background-color: transparent;
      border-radius: ${units.universalBorderRadius};
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: lightgray;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }primary
  }
`;


const UserMenuDropper = styled('button')`
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: black;
  font-weight: 700;
`;

const UserMenu = styled('div')`
  display: ${(props) => props.display};
  flex-direction: column;
  align-items: left;
  position: absolute;
  top: 45px;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;

  a {
    padding: 10px;
    font-size: 16px;
    font-weight: 600;
    text-align: left;

    &:hover {
      background-color: lightgray;
    }
  }
`;

const UserMenuButton = styled('button')`
  border: none;
  background-color: transparent;
  color: black;
  font-weight: 600;
  text-align: left;
  padding: 10px;

  &:hover {
    background-color: lightgray;
  }
`;

const ironhacksLogoStyle = {
   flex: 1,
   textAlign: 'left',
   justifyContent: 'left',
   margin: 0,
   display: 'flex',
};

const IronHacksCenterLogo = styled('div')`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 24px;

  label {
    margin: 0;
  }
`;

const RightAlignDiv = styled('div')`
  display: flex;
  justify-content: flex-end;
`;



class Header extends React.Component {
  constructor(props) {
    super(props);

    let user = {};

    if (this.props.location.state) {
      user = this.props.location.state.user
    } else if (this.props.user) {
      user = this.props.user
    }

    this.state = {
      showUserMenu: 'none',
      showMenu: 'none',
      user: user,
    };


    this.userMenuRef = React.createRef();
    this.navMenuRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    const userMenuRef = this.userMenuRef.current;
    const navMenuRef = this.navMenuRef.current;
    if (
      userMenuRef && !userMenuRef.contains(event.target)
      && navMenuRef && !navMenuRef.contains(event.target)
    ) {
      this.setState({
        showMenu: 'none',
        showUserMenu: 'none',
      });
    }
  };

  getUserName = () => {
    var user = window.firebase.auth().currentUser
    console.log('user', user);
    console.log('state user', this.state.user);

    if (user) {
      return user.displayName;
    }

    return 'unset';

  };

  showUserMenu = () => {
    if (this.state.showUserMenu === 'none') {
      this.setState({ showUserMenu: 'flex' });
    } else {
      this.setState({ showUserMenu: 'none' });
    }
  };

  showMenu = () => {
    if (this.state.showMenu === 'none') {
      this.setState({ showMenu: 'flex' });
    } else {
      this.setState({ showMenu: 'none' });
    }
    ;
  };

  hideMenus = (event) => {
    // const statData = {
    //   userId: this.state.user.uid,
    //   event: 'change-section',
    //   metadata: {
    //     location: 'header',
    //     target: event.target.innerHTML,
    //   },
    // };
    // registerStats(statData);
    this.setState({
      showMenu: 'none',
      showUserMenu: 'none',
    });
  };

  logout = () => {
    this.removeCookies();
    window.firebase
      .auth()
      .signOut()
      .then(
        function() {},
        function(error) {
          console.error('Sign Out Error', error);
        }
      );
  };

  removeCookies = () => {
    const { cookies } = this.props;
    if (cookies.get('currentHack')) {
      cookies.remove('currentHack');
    }
    if (cookies.get('currentForum')) {
      cookies.remove('currentForum');
    }
  };

  render() {
    if (this.state.signOut === true) {
      return <Redirect to='/' />;
    }
    return (
      <ThemeProvider theme={themes.HeaderTheme}>
        <div className='container-fluid' style={styles.HeaderStyle}>
          <HeaderContainer className='row' style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: '1em',
            paddingTop: '.4em',
          }}>
            <div className='col-2'>
              <IronHacksCenterLogo>
                <label>IronHacks</label>
              </IronHacksCenterLogo>
            </div>

            {this.props.location.pathname === '/select-hack' ? (
                <div className='col-5' />
              ) : (
                <div className='col-5 menu'>
                  <NavContainer
                    display={this.state.showMenu}
                    innerRef={this.navMenuRef}
                  >
                    <button onClick={this.showMenu}>
                      <img src={menuIcon} alt='menu_icon' />
                    </button>

                    <div className='links-container'>
                      <NavButton to='/forum' onClick={this.hideMenus}>
                        Forum
                      </NavButton>
                      <span> | </span>
                      <NavButton to='/results' onClick={this.hideMenus}>
                        Results
                      </NavButton>
                      <span> | </span>
                      <NavButton to='/tutorial' onClick={this.hideMenus}>
                        Tutorial
                      </NavButton>
                      <span> | </span>
                      <NavButton to='/quizzes' onClick={this.hideMenus}>
                        Quizzes
                      </NavButton>
                      <span> | </span>
                      <NavButton to='/task' onClick={this.hideMenus}>
                        Task
                      </NavButton>
                      <span> | </span>
                      <NavButton to='/examples' onClick={this.hideMenus}>
                        Examples
                      </NavButton>
                      <span> | </span>
                      {this.state.user.isAdmin && (
                      <NavButton to='/admin' onClick={this.hideMenus}>
                        Admin
                      </NavButton>
                      )}
                    </div>
                  </NavContainer>
                </div>
              )
          }

            <RightAlignDiv className='col-5'>
              <UserMenuDropper onClick={this.showUserMenu}>
                {this.state.user.displayName || 'Profile'}
              </UserMenuDropper>

              <UserMenu
                display={this.state.showUserMenu}
                innerRef={this.userMenuRef}
              >
              {this.props.location.pathname !== '/select-hack' && (
                <NavButton
                  to='/profile'
                  onClick={this.hideMenus}
                >
                  Profile
                </NavButton>
              )}
                <UserMenuButton
                  onClick={this.logout}
                >
                  Sign Out
                </UserMenuButton>
              </UserMenu>

            </RightAlignDiv>
          </HeaderContainer>
        </div>
      </ThemeProvider>
    );
  }
}

export default withCookies(Header);
