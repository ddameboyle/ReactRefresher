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
	/*this.props works because of <Tab TabChoices={TabChoices}> in App*/
	/*??? DO WE NEED BOTH this.props.url here and tab.url above???? */
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
	searchWord: function(){
		console.log(document.getElementById('test').value);
		this.word = document.getElementById('test').value;
	},
	word: null,
	addWord: function(){
		console.log("Adding this.word");
		console.log("Setting this.word to null");
		this.word = null;
	},
    render: function(){
        return(
            <div>
                {this.props.currentTab === 1 ?
                <div className="addWord">
                    <p>Search word</p>
                    <input placeholder="Seach Word" id="test"/>
                    <button onClick={this.searchWord}>Search</button>
                    <p>addWord</p>
                    <button onClick={this.addWord}>Add Word</button>
                </div>
                :null}

                {this.props.currentTab === 2 ?
                <div className="lookup">
                    <p>lookup</p>
                </div>
                :null}

                {this.props.currentTab === 3 ?
                <div className="myWords">
                    <p>myWords</p>
                </div>
                :null}

                {this.props.currentTab === 4 ?
                <div className="test">
                    <p>TEST</p>
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
				<Content currentTab={this.state.currentTab} />
			</div>
		);
	}
});

/*Renders App*/
ReactDOM.render(
	<App />,
	document.getElementById('app')
);