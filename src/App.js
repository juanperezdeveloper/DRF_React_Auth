import React, { Component } from 'react';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedForm: '',
      loggedIn: localStorage.getItem('token') ? true : false,
      username: ''
    };
  }

  componentDidMount() {
    if (this.state.loggedIn) {
      fetch('http://localhost:8000/core/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username });
        });
    }
  }

  handleLogin = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8000/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          loggedIn: true,
          displayedForm: '',
          username: json.user.username
        });
      });
  };

  handleSignUp = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8000/core/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          loggedIn: true,
          displayedForm: '',
          username: json.username
        });
      });
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    this.setState({ loggedIn: false, username: '' });
  };

  displayForm = form => {
    this.setState({
      displayedForm: form
    });
  };

  render() {
    let form;
    switch (this.state.displayedForm) {
      case 'login':
        form = <LoginForm handleLogin={this.handleLogin} />;
        break;
      case 'signup':
        form = <SignupForm handleSignUp={this.handleSignUp} />;
        break;
      default:
        form = null;
    }

    return (
      <div className="App">
        <Nav
          loggedIn={this.state.loggedIn}
          displayForm={this.displayForm}
          handleLogout={this.handleLogout}
        />
        {form}
        <h3>
          {this.state.loggedIn
            ? `Hello, ${this.state.username}`
            : 'Please Log In'}
        </h3>
      </div>
    );
  }
}

export default App