import React from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'

export default class extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            showEveryXMinutes : this.props.showEveryXMinutes
        };
        this.sliderChanged = this.sliderChanged.bind(this);
    }

    sliderChanged(value){
        this.setState({
            showEveryXMinutes : value
        });
        chrome.storage.local.set({
            'repeatEvery': value.toString()
        });
    }

    render(){
        return(
            <div>
                <h5>
                    Adjust the time for every next word here.
                </h5>
                <Slider
                    className="slider"
                    tooltip={true}
                    step={5}
                    min={0}
                    max={30}
                    value={this.state.showEveryXMinutes}
                    orientation="horizontal"
                    onChange={this.sliderChanged}
                />
                <h5>
                    Currently, the next word will show up every &nbsp;
                    <strong>
                        {this.state.showEveryXMinutes} minutes &nbsp;
                    </strong>
                    {
                        this.state.showEveryXMinutes==0 &&
                        <span>
                            (Next word will show up in each new tab)
                        </span>
                    }
                    {
                        this.state.showEveryXMinutes==30 &&
                        <h3>
                            Why up to just 30 minutes ? Well, getting a random word every 30 minutes wont harm at all.
                        </h3>
                    }
                </h5>
            </div>


    );
    }
}