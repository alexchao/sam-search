import React, { Component } from 'react';
import './App.css';


import {InstantSearch, Configure, Hits, SearchBox, Snippet} from 'react-instantsearch/dom';


class DocResult extends Component {
    render() {
        return (
            <div>
                <h3>
                    {this.props.hit.title}
                    <a
                     className="view-link"
                     href={this.props.hit.static_uri}>view</a>
                </h3>
                <p>
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
        return (
            <div className="container">
                <SearchBox />
                <Hits hitComponent={DocResult} />
            </div>
        );
    }
}


class App extends Component {
    render() {
        return (
            <InstantSearch
             appId="QJS5T5ILOZ"
             apiKey="7ce9db2eaabc449095a16ab0396f4319"
             indexName="sam_text">
                <Configure
                 snippetEllipsisText="..."
                 attributesToRetrieve={['id', 'title', 'static_uri']}
                 attributesToHighlight={[]} />
                <Search />
            </InstantSearch>
        );
    }
}

export default App;
