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
            randomordIndex = result.lastword.split('_')[1];
    		randomWord = Words.words[randomordIndex];
    	}
    }
    ReactDOM.render(<App/>,document.getElementById("app"));
});

class App extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			hintVisible : false,
			favorited : false,
			viewFavorites : false,
            bgImg : images[Math.floor(Math.random()*images.length)]
		};
		this.showHint = this.showHint.bind(this);
		this.addToFavorite = this.addToFavorite.bind(this);
	}

	isFavoriteWord(){
        chrome.storage.local.get('favorites', (result) => {
            if(result.favorites && result.favorites.length && result.favorites.indexOf(randomordIndex) !== -1){
                this.setState({
                    favorited : true
                })
            }
        });
	}

	componentDidMount(){
        this.isFavoriteWord();
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
        	if(favorites.indexOf(wordIndex) === -1){
                favorites.push(wordIndex);
			}
            chrome.storage.local.set({
                'favorites': favorites
            });
            this.setState({
                favorited : true
			})
        });

	}

	viewFavorites(){

        chrome.storage.local.get('favorites', (result) => {
            let favorites = result.favorites;
            this.setState({
                viewFavorites : true,
				favoritesItems : result.favorites
            });
        });
	}

    viewSpecificFavorite(favoriteIndex){
        randomordIndex = favoriteIndex;
        if(Words.words[randomordIndex]){
            randomWord = Words.words[randomordIndex];
            this.setState({
                viewFavorites : false
            },()=>{
                this.isFavoriteWord();
            })
		}

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

		if(this.state.viewFavorites){
			if(this.state.favoritesItems && this.state.favoritesItems.length){
				var items = this.state.favoritesItems;
			}else{
				var items = "No any word added to favorites yet !".split(' ');
			}
            var favoritesItemsTemplate = items.map((item,index)=>{
                return(
					<div key={index} className="each-word" onClick={()=>{this.viewSpecificFavorite(item)}}>
                        { typeof Words.words[item] === 'object' ? Words.words[item].word : item}
					</div>
                );
            })
		}

		let heartClass = 'glyphicon '+ (this.state.favorited ? 'glyphicon-heart ' : 'glyphicon-heart-empty ') +'icon';
		return(
			<div className="container row app-background">
				<img  src={"img/"+this.state.bgImg+".jpg"} alt="Img" />
				{
					!this.state.viewFavorites &&
					<div className="word">
						<div className="title">
                            {randomWord.word}
							<span onClick={()=>{this.addToFavorite(randomordIndex)}} className={heartClass}></span>

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
				}
				{
					this.state.viewFavorites &&
					<div className="favorite-words">
						{favoritesItemsTemplate}
					</div>

				}
				{
					!this.state.viewFavorites &&
					<span onClick={()=>{this.viewFavorites()}} className={'view-favorites'}>View favorites</span>
				}
			</div>
		)
	}
}

ReactDOM.render(<App/>,document.getElementById("app"));