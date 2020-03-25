import React, { Component } from 'react';
import logo from '../assets/logo.png';

class App extends Component {
    state = { walletInfo: {}};

    componentDidMount() {
        fetch('http://localhost:3000/api/wallet-info')
        .then(response => response.json())
        .then(json => {this.setState({walletInfo: json})});
    }

    render() {
        const {address, balance } = this.state.walletInfo;
        return(
            <div className="App">
                <img className='logo' src={logo}></img>
                <br />
                <div>
                    Welcome to Cryptochain
                </div>
                <br />
                <div className="WalletInfo">
                <div>Wallet Address: {address}</div>
                <div>Wallet Balance: {balance}</div>    
                </div>
                <br />
            </div>
        );
    }
}

export default App;