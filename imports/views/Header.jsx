import React, { Component } from 'react';

export default class Header extends Component {
    doLogout() {
        Meteor.logout();
    }

    render() {
        return (
            <div>
                <h1>Gomoku game</h1>

                {
                    this.props.user ?
                    (<button onClick = { this.doLogout.bind(this) }>Logout: { this.props.user.username }</button>) :
                    null
                }
            </div>
        )
    }
}
