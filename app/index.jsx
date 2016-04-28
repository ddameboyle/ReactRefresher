var React = require('react');
var ReactDOM = require('react-dom');

/*TABCHOICES lists the tabs and corresponding routes*/
var TabChoices =[
					{'id':1, 'name':'addWord', 'url':'/addWord'},
					{'id':2, 'name':'lookup', 'url':'/lookup'},
					{'id':3, 'name':'myWords', 'url':'/myWords'},
					{'id':4, 'name':'test', 'url':'/test'}
				];
/*TAB component will put list items in navbar*/
var Tab = React.createClass({
	tabClickEvent: function(e){
        e.preventDefault();
    	{/*tabsClickEvent() below is a method one level up in the Tabs component*/}
        this.props.tabsClickEvent();
	},
	render: function(){
		{/*console.log("Tab this.props", this.props);*/}
		return (
			<li className={this.props.isCurrent ? 'current' : null}>
				{/* 
					this.props refers to the Tab Choices objects with only name and url as properties
					this.tabClickEvent triggers the tabClickEvent method which changes the tab
				*/}
				<a onClick={this.tabClickEvent} href={this.props.url}>{this.props.name}</a>
			</li>
		);
	}
});
/*TABS will create a navbar*/
var Tabs = React.createClass({
	tabsClickEvent: function(tab){
        this.props.changeTab(tab);
    },
	render: function(){
		{/*console.log("Tabs this", this);*/}
		return (
			<nav>
				<ul>
					{/* this.props is {TabChoices: Array[4]} */}
					{this.props.TabChoices.map(function(tab){
						{/*console.log("Inside TabChoices.map function inside of Tabs", this);*/}
								{/*Without tabsClickEvent.bind(this,tab), tab is undefined*/}
						return (			
								<Tab tabsClickEvent={this.tabsClickEvent.bind(this, tab)} key={tab.id} url={tab.url} name={tab.name}/>
							);
					{/*without the bind(this) "this" is undefined; */}
					}.bind(this))}
				</ul>
			</nav>
		);
	}
});

var Content = React.createClass({
	getInitialState: function(){
		return {wordData: [], searchedWord: {word: null, definition: null, partOfSpeech: null}}
	},
	loadWordDataFromServer: function(){
		this.loadedWordDataFromServer = true;
		$.ajax({
	      url: '/api/savedWords',
	      type: 'GET',
	      cache: false,
	      success: function(data) {
	        this.setState({wordData: data, searchedWord: {word: null, definition: null, partOfSpeech: null}});
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	    console.log("this.state.wordData", this.state.wordData);
	},
	loadedWordDataFromServer: false,
	searchWord: function(){
		console.log(document.getElementById('test').value);
		console.log("THIS.SEARCHEDWORD", this.searchedWordTemp);
		this.searchedWordTemp = document.getElementById('test').value;

		var wordResults = null;
		$.ajax({
				url: 'http://api.wordnik.com:80/v4/word.json/' + this.searchedWordTemp + '/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
				type: 'GET',
				success: function(data) {
					console.log("this.state", this.state);
					this.setState({wordData: this.state.wordData, searchedWord: {word: data[0].word, definition: data[0].text, partOfSpeech: data[0].partOfSpeech}});
					console.log("DATA", data);
					console.log("this.state after", this.state);
				}.bind(this),
				error: function(xhr, status, err) {
					console.error(xhr, status, err.toString());
				}.bind(this)
			});
	},
	searchedWordTemp: null,
	addWord: function(){
		console.log("this.state.searchedWord", this.state.searchedWord);
		if(this.state.searchedWord.word === null){console.log("NO WORD TO SEND!!");}
		else{
			console.log(this.props);
			$.ajax({
				url: this.props.url,
				dataType: 'json',
				type: 'POST',
				data: this.state.searchedWord,
				success: function(data) {
					this.setState({wordData: data, searchedWord: this.state.searchedWord});
					console.log("this.state.wordData", this.state.wordData);
				}.bind(this),
				error: function(xhr, status, err) {
					console.error(this.props.url, status, err.toString());
				}.bind(this)
			});
		}
	},
    render: function(){
    	console.log("this.state", this.state);
    	if (this.loadedWordDataFromServer === false){this.loadWordDataFromServer();}
    	var wordList = this.state.wordData.map(function(word){
			return(
					<div>
						<p>{word.word}</p>
						<p>{word.partOfSpeech}</p>
						<p>{word.definition}</p>
					</div>
				);
		});        
		return(
            <div>
                {this.props.currentTab === 1 ?
                <div className="addWord">
                    <p>Search word</p>
                    <input placeholder="Seach Word" id="test"/>
                    <button onClick={this.searchWord}>Search</button>
                    <p>addWord</p>
                    <button onClick={this.addWord}>Add Word</button>
                    <h4>{this.state.searchedWord.word}</h4>
                    <p>{this.state.searchedWord.partOfSpeech}</p>
                    <p>{this.state.searchedWord.definition}</p>
                </div>
                :null}

                {this.props.currentTab === 2 ?
                <div className="lookup">
                    <p>lookup</p>
                </div>
                :null}


                {this.props.currentTab === 3 ? this.state.wordData.map(function(word){
					return(
						<div>
							<p>{word.word}</p>
							<p>{word.partOfSpeech}</p>
							<p>{word.definition}</p>
						</div>
					);
				}) :null}

                {this.props.currentTab === 4 ?
                <div className="test">
                    <p>test</p>
                </div>
                :null}
            </div>
        );
    }
});


/*APP is fed all of the previous components and rendered*/
var App = React.createClass({
	getInitialState: function () {
        return {
            TabChoices: TabChoices,
            currentTab: 1
    	};
    },
	changeTab: function(tab) {
		{/*console.log("changeTab: tab:",tab);*/}
        this.setState({ currentTab: tab.id });
    },
	render: function(){
		{/*console.log("this.state", this.state);*/}
		return (
			<div>
				<Tabs currentTab={this.state.currentTab} changeTab={this.changeTab} TabChoices={this.state.TabChoices} />
				<Content currentTab={this.state.currentTab} url = '/api/savedWords'/>
			</div>
		);
	}
});

/*Renders App*/
ReactDOM.render(
	<App />,
	document.getElementById('app')
);