import React from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import Switch from 'react-toggle-switch';
import 'react-toggle-switch/dist/css/switch.min.css';

export default class extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            showEveryXMinutes : this.props.showEveryXMinutes,
            switched : this.props.showMeaning
        };
        this.sliderChanged = this.sliderChanged.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);
    }

    sliderChanged(value){
        this.setState({
            showEveryXMinutes : value
        });
        chrome.storage.local.set({
            'repeatEvery': value.toString()
        });
    }

    toggleSwitch(){
        let switchState = !this.state.switched;
        this.setState({
            'switched' : switchState
        });
        chrome.storage.local.set({
            'showMeaning': switchState ? 'true' : 'false'
        });
    }

    render(){
        return(
            <div>
                <h1>Settings</h1>
                <h3>Next Word Interval</h3>
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
                <hr/>
                <h3> Word Meaning Behaviour </h3>
                <div>
                    <h5>
                        Select if you want to show the meaning on default
                    </h5>
                    <Switch  onClick={this.toggleSwitch} on={this.state.switched} />
                    <h5>
                        {
                            !this.state.switched &&
                            <span>
                                Currently, this option is turned OFF, so you will not be seeing meaning on default
                            </span>
                        }
                        {
                            this.state.switched &&
                            <span>
                                Currently, this option is turned ON, so you will see meaning on default
                            </span>
                        }

                    </h5>
                </div>

            </div>


    );
    }
}