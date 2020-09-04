import React from 'react';


class VotingContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    handleUpvote(track) {
        this.props.upvote(track)
    }
    render() {
        return (
            <div className="Voting-Container">
                <h2>
                    Voting Panel
                </h2>
                {this.props.tracks.map(track => (
                    <li key={track.id}>
                        {track.name} <button onClick={() => this.handleUpvote(track)}>Upvote</button>
                        Votes: {track.votes}
                    </li>
                ))}
            </div>
        )

    }
}
export default VotingContainer;