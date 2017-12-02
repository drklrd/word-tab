import React from 'react';
import ReactDOM from 'react-dom';
import Words from './words.json';

let randomWord = Words.words[Math.floor(Math.random() * Words.words.length)];

class App extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			hintVisible : false
		};
		this.showHint = this.showHint.bind(this);
	}

	showHint(){
		this.setState({
			hintVisible: true
		});
	}

	render(){

		let hintTemplate =
							<div>
									<div className="meaning-sentence">
										meaning &#xb7; {randomWord.meaning}
									</div>
									<div className="meaning-sentence">
										usage &#xb7; {randomWord.sentence}
									</div>
							</div>

		return(
			<div className="container row app-background">
				<img src="img/coffee.jpg" alt="Img" />
				<div className="word">
					<div className="title">
                        {randomWord.word}
					</div>
					{
						this.state.hintVisible && hintTemplate
					}
					{
						!this.state.hintVisible &&
						<div>
							<button onClick={this.showHint} className="show-meaning">Show meaning</button>
						</div>
					}
				</div>
			</div>
		)
	}
}

ReactDOM.render(<App/>,document.getElementById("app"));


// http://wallpaperswide.com/coffee_8-wallpapers.html