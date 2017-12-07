import React from 'react';
import ReactDOM from 'react-dom';
import Words from './words.json';
import HintTemplate from './hintTemplate';
import * as ReactAnimations from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import Slider from './Slider';


const animationTypes = Object.keys(ReactAnimations).filter((key)=>{ // get available animation styles from React-Animations. The type property will be object for any animation style.
	if(typeof ReactAnimations[key] === 'object') return key;
})
let selectedAnimation;
let randomordIndex = Math.floor(Math.random() * Words.words.length);
let randomWord = Words.words[randomordIndex];
let isLastWordActive = false;
let images = ['coffee','balloon','book'];
let repeatEvery;
let showMeaning;

function updateLastWordStorage(){
    randomordIndex =Math.floor(Math.random() * Words.words.length);
    randomWord = Words.words[randomordIndex];
    chrome.storage.local.set({
        'lastword': Date.now()+'_'+randomordIndex
    });
}

chrome.storage.local.get('repeatEvery',(result)=>{
	if(!result.repeatEvery){
        repeatEvery = 5;
		chrome.storage.local.set({
            'repeatEvery': repeatEvery
        });
	}else{
        repeatEvery = Number(result.repeatEvery);
	}
	chrome.storage.local.get('showMeaning',(meaningResult)=>{

        if(meaningResult.showMeaning == undefined){
            showMeaning = false;
            chrome.storage.local.set({
                'showMeaning': showMeaning
            });
        }else{
            showMeaning = meaningResult.showMeaning;
        }
        console.log('>>>>',showMeaning)
        chrome.storage.local.get('lastword', (result) => {
            if(!result.lastword){
                updateLastWordStorage();
            }else{
                if((Date.now()-result.lastword.split('_')[0] > (repeatEvery * 60 * 1000)) || ( repeatEvery != undefined && repeatEvery == 0)){
                    updateLastWordStorage();
                }else{
                    if(result.lastword.split('_')[2]){
                        isLastWordActive = false;
                    }
                    randomordIndex = result.lastword.split('_')[1];
                    randomWord = Words.words[randomordIndex];
                }
            }
            ReactDOM.render(<App/>,document.getElementById("app"));
        });
    });
})



class App extends React.Component{

	constructor(props){
		super(props);
        selectedAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
		this.state = {
			hintVisible : showMeaning,
			viewSettings : false,
			favorited : false,
			viewFavorites : false,
            bgImg : images[Math.floor(Math.random()*images.length)],
            selectedAnimation : animationTypes[Math.floor(Math.random() * animationTypes.length)],
            bounce: {
                animation: 'x 1s',
                animationName: Radium.keyframes(ReactAnimations[selectedAnimation], `${selectedAnimation}`)
            },
			showEveryXMinutes : repeatEvery,
            showMeaning : showMeaning

		};
		this.showHint = this.showHint.bind(this);
		this.addToFavorite = this.addToFavorite.bind(this);
		this.reload = this.reload.bind(this);
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
                viewSettings : false,
				favoritesItems : result.favorites
            });
        });
	}

    viewSettings(){
		this.setState({
            viewFavorites : false,
			viewSettings : true
		})
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

    reload(){
        selectedAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
        this.setState({
            bounce: {
                animation: 'x 1s',
                animationName: Radium.keyframes(ReactAnimations[selectedAnimation], `${selectedAnimation}`)
            },
            bgImg : images[Math.floor(Math.random()*images.length)],
            viewFavorites : false,
			viewSettings : false
		})
	}

	render(){
		let hintTemplate = <HintTemplate randomWord={randomWord} />;
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
					!this.state.viewFavorites && !this.state.viewSettings &&
					<div className="word">
							<div className="title">
								<StyleRoot>
									<div style={this.state.bounce}>
										{randomWord.word}
										<span onClick={()=>{this.addToFavorite(randomordIndex)}} className={heartClass}></span>
									</div>
								</StyleRoot>

							</div>
						{
							(this.state.hintVisible) &&
							<StyleRoot>
								<div style={this.state.bounce}>
									{ hintTemplate }
								</div>
							</StyleRoot>
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
					this.state.viewSettings &&
					<div className="settings">
						<Slider
							showEveryXMinutes={this.state.showEveryXMinutes}
                            showMeaning = {this.state.showMeaning}
						/>
					</div>
				}
				{
					!this.state.viewFavorites &&
					<span onClick={()=>{this.viewFavorites()}} className={'view-favorites'}>View favorites</span>
				}
                {
                    !this.state.viewSettings &&
					<span onClick={()=>{this.viewSettings()}} className={'view-settings glyphicon glyphicon-cog '}></span>
                }
				<div className="reload">
					<span onClick={this.reload}  className="glyphicon glyphicon-refresh"></span>
				</div>
			</div>
		)
	}
}
