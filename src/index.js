import React from 'react';
import ReactDOM from 'react-dom';
import Words from './words.json';

let randomWord = Words.words[Math.floor(Math.random() * Words.words.length)];

class App extends React.Component{

	render(){
		return(
			<div className="container row app-background">
				<img src="img/coffee.jpg" alt="Img" />
				<div className="word">
					<div className="title">
                        {randomWord.word}
					</div>
					<div className="meaning">
                        meaning &#xb7; {randomWord.meaning}
					</div>
					<div className="sentence">
                        usage &#xb7; {randomWord.sentence}
					</div>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<App/>,document.getElementById("app"));


// http://wallpaperswide.com/coffee_8-wallpapers.html