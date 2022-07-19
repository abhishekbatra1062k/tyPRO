import React, { Component } from 'react';

class Game extends Component {
    state = {
        miliSec: 0,
        seconds: 0,
        alphabet: '',
        ans: '',
        typed: '',
        score: 1,
        timer: null,
        penaltyAlert: null,
        highestScore: { seconds: 0, miliSec: 0 }
    };

    componentDidMount() {
        const char = this.getRandomCharacter();
        this.setState({ alphabet: char, ans: char });
        const highScore = localStorage.getItem('highestScore');
        this.setState({ highestScore: (highScore) ? JSON.parse(highScore) : { seconds: 0, miliSec: 0 } });
    }

    getRandomCharacter = () => {
        const str = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        const char = str.at(Math.random() * 52);
        return char;
    }

    isSuccess = () => {
        const { highestScore, miliSec, seconds } = this.state;
        return (highestScore.seconds === 0 && highestScore.miliSec === 0) || (highestScore.seconds > seconds) || (highestScore.seconds >= seconds && highestScore.miliSec > miliSec);
    }

    handleKeyDown = (e) => {
        const { seconds, miliSec, timer, alphabet, score, ans } = this.state;
        if (!(seconds + miliSec) && !timer) this.startCounting();
        const inputValue = e.target.value;
        const entered = inputValue[inputValue.length - 1];
        if (entered === alphabet && ans === inputValue) {
            const char = this.getRandomCharacter();
            this.setState({ alphabet: char, score: score + 1, typed: inputValue, ans: ans + char });
            if (score === 20) {
                if (this.isSuccess()) {
                    localStorage.setItem('highestScore', JSON.stringify({ seconds: seconds, miliSec: miliSec }));
                    this.setState({ alphabet: "SUCCESS", highestScore: { seconds, miliSec } });
                } else this.setState({ alphabet: "FAILURE" });
                clearInterval(timer);
                this.setState({ timer: null });
            }
            this.setState({ penaltyAlert: null });
        } else {
            if (score < 20 && inputValue !== ans && e.nativeEvent.inputType !== "deleteContentBackward") {
                const ms = miliSec + 50;
                this.setState({ milisec: parseInt(ms % 100), seconds: parseInt(seconds + ms / 100), typed: ans.substring(0, ans.length - 1), penaltyAlert: <div className="alert alert-danger" role="alert">Penalty (+5s)</div> });
            }
        }
    }

    startCounting = () => {
        this.setState({ timer: setInterval(this.countUp, 10) });
    }

    countUp = () => {
        const { seconds, miliSec } = this.state;
        if (seconds > 59) this.handleReset();
        if (miliSec === 99) {
            this.setState({ seconds: seconds + 1, miliSec: 0 });
        }
        else this.setState({ miliSec: miliSec + 1 });
    }

    handleReset = () => {
        if (this.state.timer !== null) clearInterval(this.state.timer);
        const char = this.getRandomCharacter();
        this.setState({
            miliSec: 0,
            seconds: 0,
            alphabet: char,
            ans: char,
            typed: '',
            score: 1,
            penaltyAlert: null,
            timer: null
        });
    }

    render() {
        const styles = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', justifyContent: 'center' };
        return (
            <div className='text-center' style={styles}>
                <div className='alphabet'>{this.state.alphabet}</div>
                <div className='text-btn'>
                    <input type="text" className="form-controlw-50" autoFocus onChange={this.handleKeyDown} value={this.state.typed} />
                    <div className="input-group-append">
                        <button className="btn" type="button" id="button-addon2" onClick={this.handleReset}>Reset</button>
                    </div>
                </div>
                <div className='display-4'>Time : {(this.state.seconds < 10) ? `0${this.state.seconds}` : this.state.seconds}.{(this.state.miliSec < 10) ? `0${this.state.miliSec}` : this.state.miliSec}s</div>
                <div>My Best Time : {(this.state.highestScore.seconds < 10) ? `0${this.state.highestScore.seconds}` : this.state.highestScore.seconds}.{(this.state.highestScore.miliSec < 10) ? `0${this.state.highestScore.miliSec}` : this.state.highestScore.miliSec}s!</div>
                {this.state.penaltyAlert}

            </div>
        );
    }
}

export default Game;