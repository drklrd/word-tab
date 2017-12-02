import React from 'react';
import ReactDOM from 'react-dom';


class App extends React.Component{

	render(){
		return(
			<div className="row">
				<h1>eHELLO</h1>
			</div>
		)
	}
}

ReactDOM.render(<App/>,document.getElementById("app"));
