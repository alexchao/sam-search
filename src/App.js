import React, { Component } from 'react';
import './App.css';


import {InstantSearch, Configure, Hits, SearchBox, Snippet} from 'react-instantsearch/dom';


class DocResult extends Component {
    render() {
        return (
            <div className="hit-container">
                <h3>
                    {this.props.hit.title}
                    <a
                     className="view-link"
                     href={this.props.hit.static_uri}>view</a>
                </h3>
                <p className="snippet">
                    <span className="hit-name">
                        <Snippet attributeName="content" hit={this.props.hit} />
                    </span>
                </p>
            </div>
        );
    }
}


class Search extends Component {
    render() {
        const hits = this.props.hideResults ? null : (<Hits hitComponent={DocResult} />);
        return (
            <div className="container">
                <SearchBox translations={{ placeholder: "trump, chomsky, etc." }} />
                {hits}
            </div>
        );
    }
}


class App extends Component {

    constructor(props) {
        super(props);
        this.state = { hideResults: true };
    }

    handleSearchStateChanged(nextSearchState) {
        this.setState({
            hideResults: nextSearchState.query.trim() === ''
        });
    }

    render() {
        return (
            <InstantSearch
             appId="QJS5T5ILOZ"
             apiKey="7ce9db2eaabc449095a16ab0396f4319"
             indexName="sam_text"
             onSearchStateChange={(n) => { this.handleSearchStateChanged(n); }}>
                <Configure
                 snippetEllipsisText="..."
                 attributesToRetrieve={['id', 'title', 'static_uri']}
                 attributesToHighlight={[]} />
                <Search hideResults={this.state.hideResults} />
            </InstantSearch>
        );
    }
}

export default App;
