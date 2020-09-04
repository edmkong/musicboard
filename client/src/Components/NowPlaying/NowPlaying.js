import React from 'react';

class NowPlaying extends React.Component {
    constructor(props) {
        super(props);
        this.handlePlay = this.handlePlay.bind(this)
    }
    handlePrevious(a) {
        this.props.previous(a)
    }
    handlePause(a) {
        this.props.pause(a)
    }
    handlePlay() {
        this.props.play('play')
    }
    handleNext(a) {
        this.props.next(a)
    }
    render() {
        return (
            <div className="Now-Playing">
              <button onClick={() => this.handlePrevious('previous')
              }>Previous</button>
              <button onClick={this.handlePlay
              }>Play</button>
              <button onClick={() => this.handlePause('pause')
              }>Pause</button>
              <button onClick={() => this.handleNext('next')
              }>Next</button>
            </div>
        )

    }
}
export default NowPlaying;