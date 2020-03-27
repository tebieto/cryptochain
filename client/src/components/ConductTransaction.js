import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';
import { response } from 'express';

class ConductTransaction extends Component {
    state = { recipient: '', amount: 0, knownAddresses: [] };

    updateRecipient = event => {
        this.setState({recipient: event.target.value});
    }

    updateAmount = event => {
        this.setState({amount: Number(event.target.value)});
    }

    ConductTransaction = () => {
        const { recipient, amount } = this.state;

        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, amount })
        }).then(response => response.json())
          .then(json => {
              alert(json.message || json.type);

              history.push('/transaction/pool')
          });
    }

    fetchKnownAddresses() {
        fetch(`${document.location.origin}/api/known-addresses`)
            .then(response => response.json())
            .then(json => this.setState({ knownAddresses: json }));
    }

    componentDidMount() {
        this.fetchKnownAddresses();
    }

    render() {
        return (
            <div className='ConductTransaction'>
                <Link to='/'>Home</Link>
                <h3>Conduct a Transaction</h3>
                <FormGroup>
                    <FormControl input="text" 
                    placeholder='recipient'
                    value={this.state.recipient}
                    onChange={this.updateRecipient}/>
                </FormGroup>

                <FormGroup>
                    <FormControl input="number" 
                    placeholder='amount'
                    value={this.state.amount}
                    onChange={this.updateAmount}/>
                </FormGroup>
                <div>
                    <Button
                    variant='danger'
                    size='small'
                    onClick={this.ConductTransaction}
                    >Submit</Button>
                </div>
            </div>
        )
    }
}

export default ConductTransaction;