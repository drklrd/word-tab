import React from 'react';

export default class HintTemplate extends React.Component{

    render(){
        return(
            <div>
                <div className="meaning-sentence">
                    meaning
                    <span className="dot">
										&#xb7;
									</span>
                    <span className="itallics">
										{this.props.randomWord.meaning}
									</span>

                </div>
                <div className="meaning-sentence">
                    usage
                    <span className="dot">
										&#xb7;
									</span>
                    <span className="itallics">
										{this.props.randomWord.sentence}
									</span>
                </div>
            </div>
        );
    }
}