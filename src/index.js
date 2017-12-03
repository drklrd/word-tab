import React from 'react';
import ReactDOM from 'react-dom';
import Words from './words.json';

let randomordIndex = Math.floor(Math.random() * Words.words.length);
let randomWord = Words.words[randomordIndex];
let isLastWordActive = false;

let images = ['coffee','balloon','book'];

function updateLastWordStorage(){
    randomordIndex =Math.floor(Math.random() * Words.words.length);
    randomWord = Words.words[randomordIndex];
    chrome.storage.local.set({
        'lastword': Date.now()+'_'+randomordIndex
    });
}

chrome.storage.local.get('lastword', (result) => {
    if(!result.lastword){
        updateLastWordStorage();
    }else{
    	if(Date.now()-result.lastword.split('_')[0] > (5 * 60 * 1000)){
            updateLastWordStorage();
    	}else{
    		if(result.lastword.split('_')[2]){
    			isLastWordActive = true;
    		}
    		randomWord = Words.words[result.lastword.split('_')[1]];	
    	}
    }
    ReactDOM.render(<App/>,document.getElementById("app"));
});

class App extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			hintVisible : false,
            bgImg : images[Math.floor(Math.random()*images.length)]
		};
		this.showHint = this.showHint.bind(this);
		this.addToFavorite = this.addToFavorite.bind(this);
	}

	componentDidMount(){
        chrome.storage.local.get('favorites', (result) => {
            console.log('***',result);
        });
	}

	showHint(){
		chrome.storage.local.get('lastword', (result) => {
		    if(result.lastword){
		    	chrome.storage.local.set({
		    	    'lastword': result.lastword+'_opened'
		    	});
		    }
		});
		this.setState({
			hintVisible: true
		});
	}

	addToFavorite(wordIndex){
        chrome.storage.local.get('favorites', (result) => {
        	let favorites = result.favorites || [] ;
        	favorites.push(wordIndex);
            chrome.storage.local.set({
                'favorites': favorites
            });
        });
	}

	render(){
		let hintTemplate =
							<div>
									<div className="meaning-sentence">
										meaning
										<span className="dot">
											&#xb7;
										</span>
										<span className="itallics">
											{randomWord.meaning}
										</span>

									</div>
									<div className="meaning-sentence">
										usage
										<span className="dot">
											&#xb7;
										</span>
										<span className="itallics">
											{randomWord.sentence}
										</span>
									</div>
							</div>

		return(
			<div className="container row app-background">
				<img  src={"img/"+this.state.bgImg+".jpg"} alt="Img" />
				<div className="word">
					<div className="title">
                        {randomWord.word}
						<span onClick={()=>{this.addToFavorite(randomordIndex)}} className="glyphicon glyphicon-heart-empty icon"></span>

					</div>
					{
						(this.state.hintVisible || isLastWordActive) && hintTemplate
					}
					{
						!this.state.hintVisible && !isLastWordActive &&
						<div>
							<button onClick={this.showHint} className="show-meaning">Show meaning</button>
						</div>
					}
				</div>
				<div className="tools">

				</div>
			</div>
		)
	}
}

ReactDOM.render(<App/>,document.getElementById("app"));


// http://wallpaperswide.com/coffee_8-wallpapers.html