import React, { Component } from 'react';
import './App.css';


import {InstantSearch, Configure, Hits, SearchBox, Snippet} from 'react-instantsearch/dom';


const Util = (function() {
    const makeStaticUri = function(docId) {
        return 'transcripts/' + docId + '.html';
    };
    return {
        makeStaticUri: makeStaticUri
    }
})();


class DocResult extends Component {
    render() {
        const staticUri = Util.makeStaticUri(this.props.hit.id);
        return (
            <div className="hit-container">
                <h3>
                    {this.props.hit.title}
                    <a
                     className="view-link"
                     onClick={(e) => {this.props.handleLinkClick(e);}}
                     href={staticUri}>view</a>
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

    constructor(props) {
        super(props);
        this.state = { pageContent: null };
    }

    handleLinkClick(e) {
        e.preventDefault();
        const uri = e.target;
        const that = this;
        fetch(uri).then(function(response) {
            return response.text();
        }).then(function(htmlBlob) {
            that.setState({ pageContent: htmlBlob });
        });
        this.props.appHandleLinkClick();
    }

    render() {
        let hits = null;
        if (!this.props.hideResults) {
            hits = (
                <div id="hits-section">
                    <div id="hits-container">
                        <Hits hitComponent={
                            ({hit}) => <DocResult hit={hit} handleLinkClick={this.handleLinkClick.bind(this)} />
                         } />
                    </div>
                </div>
            );
        }
        return (
            <div id="page-container">
                <div id="search-bar">
                    <div id="search-box-container">
                        <SearchBox translations={{ placeholder: "trump, chomsky, etc." }} />
                    </div>
                    {hits}
                </div>
                // derp
                <div id="page-body" dangerouslySetInnerHTML={{__html: this.state.pageContent }}></div>
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

    appHandleLinkClick() {
        this.setState({ hideResults: true });
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
                <Search hideResults={this.state.hideResults} appHandleLinkClick={this.appHandleLinkClick.bind(this)} />
            </InstantSearch>
        );
    }
}

export default App;
