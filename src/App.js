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
                     data-chunk-id={this.props.hit.chunk_id}
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


class InfoBox extends Component {
    render() {
        return (
            <div className="info-box-container">
                <div className="info-box pop-up">
                    <h3>About This App</h3>
                    <p>Most of the transcripts here have been generated directly from <strong>Sam Harris</strong>'s <em><a href="https://www.samharris.org/podcast">Waking Up</a></em> podcast audio data using Google's <a href="https://cloud.google.com/speech/">Cloud Speech API</a>. The speech recognition technology &mdash; while powerful &mdash; is imperfect; the transcripts found here include numerous errors and lack punctuation, and are unable to distinguish between when Sam is speaking in his own words or quoting someone else. Literal reading of these trancripts is difficult, and so they should only be used as reference material.</p>
                    <p>Currently, only those podcasts where Sam is speaking alone (without a guest) have been transcribed.</p>
                    <p>See this project on <a href="https://github.com/alexchao/sam-search">GitHub</a>. This app is neither endorsed by nor affiliated with Sam Harris.</p>
                    <p className="pop-up-button"><a href="#" onClick={(e) => {this.props.handleCloseInfoClick(e);}}>CLOSE</a></p>
                </div>
            </div>
        );
    }
}


class Search extends Component {

    constructor(props) {
        super(props);
        this.state = { pageContent: null };
    }

    handleCloseInfoClick(e) {
        e.preventDefault();
        this.props.handleCloseInfoBox();
    }

    handleOpenInfoClick(e) {
        e.preventDefault();
        this.props.handleHideResults();
        this.props.handleShowInfoBox();
    }

    setScrollToMatch(chunkId) {
        const chunkEl = document.getElementById('chunk-' + chunkId);

        // try to move the element into view from behind the search bar
        const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        let verticalOffset = chunkEl.offsetTop;
        verticalOffset -= parseInt(viewportHeight / 2, 10);
        verticalOffset += parseInt(chunkEl.offsetHeight / 2, 10);
        window.scroll(0, verticalOffset);

        const initClassName = chunkEl.className;
        chunkEl.className = initClassName + ' content-highlight';

        // reset the class name after the highlight animation has finisehd
        // so that future searches can still highlight this element
        window.setTimeout(function() {
            chunkEl.className = initClassName;
        }, 4000);
    }

    handleLinkClick(e) {
        e.preventDefault();
        const uri = e.target;
        const chunkId = e.target.dataset.chunkId;

        const that = this;
        fetch(uri).then(function(response) {
            return response.text();
        }).then(function(htmlBlob) {
            that.setState({ pageContent: htmlBlob });
            that.setScrollToMatch(chunkId);
        });
        this.props.handleHideResults();
    }

    render() {
        let hits = null, infoBox = null;
        if (this.props.showResults) {
            hits = (
                <div id="hits-section">
                    <div id="hits-box" className="pop-up">
                        <div id="hits-container">
                            <Hits hitComponent={
                                ({hit}) => <DocResult hit={hit} handleLinkClick={this.handleLinkClick.bind(this)} />
                             } />
                        </div>
                        <div id="search-footer-container">
                            <span id="search-footer">
                                powered by
                                <a href="https://www.algolia.com/"><img alt="Algolia logo" src={process.env.PUBLIC_URL + '/img/algolia.svg'} height="17" width="54" /></a>
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        if (this.props.showInfoBox) {
            infoBox = (<InfoBox handleCloseInfoClick={this.handleCloseInfoClick.bind(this)} />);
        }

        return (
            <div id="page-container">
                <div id="search-bar">
                    <div id="search-box-container" className="group">
                        <SearchBox translations={{ placeholder: "trump, liberals, etc." }} />
                        <div className="header-container">
                            <h1>
                                Search <em>Waking Up</em> transcripts
                            </h1>
                            <span className="more-info-link">( <a href="#" onClick={(e) => {this.handleOpenInfoClick(e);}}>?</a> )</span>
                        </div>
                    </div>
                    {hits}
                    {infoBox}
                </div>
                {/* derp */}
                <div id="page-body" dangerouslySetInnerHTML={{__html: this.state.pageContent }} />
            </div>
        );
    }
}


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showResults: false,
            showInfoBox: false
        };
    }

    handleCloseInfoBox() {
        this.setState({ showInfoBox: false });
    }

    handleShowInfoBox() {
        this.setState({ showInfoBox: true });
    }

    handleSearchStateChanged(nextSearchState) {
        this.setState({
            showResults: nextSearchState.query.trim() !== '',
            showInfoBox: false
        });
    }

    handleHideResults() {
        this.setState({ showResults: false });
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
                 attributesToRetrieve={['id', 'title', 'chunk_id']}
                 attributesToHighlight={[]}
                 />
                <Search
                 showResults={this.state.showResults}
                 showInfoBox={this.state.showInfoBox}
                 handleHideResults={this.handleHideResults.bind(this)}
                 handleCloseInfoBox={this.handleCloseInfoBox.bind(this)}
                 handleShowInfoBox={this.handleShowInfoBox.bind(this)}
                 />
            </InstantSearch>
        );
    }
}

export default App;
