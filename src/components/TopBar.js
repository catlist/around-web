import React from 'react';
import logo from '../assets/images/logo.svg';
import { Link } from 'react-router-dom';

export class TopBar extends React.Component {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <Link to="/home">
                    <span className="App-title">Around</span>
                </Link>
            </header>
        );
    }
}
