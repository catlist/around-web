import React, { Component } from 'react';
import { TopBar } from './TopBar';
import { Main } from './Main';
import { TOKEN_KEY } from '../constants';
import { message } from 'antd';

class App extends Component {
  state = {
    isLoggedIn: !!localStorage.getItem(TOKEN_KEY)
  }

  handleLogin = (token) => {
    this.setState({ isLoggedIn: true });
    localStorage.setItem(TOKEN_KEY, token);
  }

  handleLogout = () => {
    this.setState({ isLoggedIn: false });
    localStorage.removeItem(TOKEN_KEY);
    message.info("Logout successfully!");
  }

  render() {
    return (
      <div className="App">
        <TopBar
          isLoggedIn={this.state.isLoggedIn}
          handleLogout={this.handleLogout}
        />
        <Main
          isLoggedIn={this.state.isLoggedIn}
          handleLogin={this.handleLogin}
        />
      </div>
    );
  }
}

export default App;
