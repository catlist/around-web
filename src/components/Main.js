import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Register } from './Register';
import { Login } from './Login';
import { Home } from './Home';

export class Main extends React.Component {
    render() {
        // const myStyle = { textDecoration: 'line-through underline', textTransform: 'lowercase' };
        return (
            <div className="main">
                <Switch>
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/home" component={Home} />
                    <Route component={Login} />
                </Switch>
            </div>
        );
    }
}