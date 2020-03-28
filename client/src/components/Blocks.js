import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Block from './Block';

class Blocks extends Component {
    state = { blocks: [], pageId: 1, blockLength: 0 };

    fetchPaginatedBlocks = pageId => () => {
        fetch(`${document.location.origin}/api/blocks/${pageId}`)
            .then(response => response.json())
            .then(json => {this.setState({ blocks: json })});
    }

    fetchBlocksLength = () =>  {
        fetch(`${document.location.origin}/api/blocks/length`)
            .then(response => response.json())
            .then(json => {this.setState({ blockLength: json })});
    }

    componentDidMount() {
        this.fetchPaginatedBlocks(this.state.pageId)();
        this.fetchBlocksLength()
    }

    render() {
        const blocksPerPage = 5
        return (
            <div>
                <div><Link to='/'>Home</Link></div>
                <br />
                <h3>Mined Transaction Blocks</h3>
                <br />
                {
                  [...Array(Math.ceil(this.state.blockLength/blocksPerPage)).keys()].map((key) => {
                      const pageId = key+1
                      return(
                      <span key={pageId} onClick={this.fetchPaginatedBlocks(pageId)}>
                          <Button variant="danger" size="sm">{pageId}</Button>
                      </span>
                      )
                  }) 
                }
                <br />
                {
                    this.state.blocks.map(block => {
                        return (
                            <Block key={block.hash} block={block} />
                        )
                    })
                }
            </div>
        );
    }
}

export default Blocks;