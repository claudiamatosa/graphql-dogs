import React from 'react';
import { gql, graphql } from 'react-apollo';

import './Votes.css';

const voteValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const specialVotes = [11, 12];

const Votes = ({photoHash, currentRating, addVote}) => (
  <div className="Votes">
    <p className="Votes-title">Rate this dog</p>

    <p className="Votes-current-rating">
      Average rating: <b>{currentRating || 'N/a'}</b>
    </p>

    <div className="Votes-buttons">
      {voteValues.map(value => (
        <button
          className="Votes-button"
          type="button"
          onClick={() => addVote({
            variables: {photoHash, value}
          })}
          key={value}
        >
          {value}
        </button>
      ))}

      {specialVotes.map(value => (
        <button
          className="Votes-button Votes-button-special"
          type="button"
          onClick={() => addVote({
            variables: {photoHash, value}
          })}
          title="This is a special rating. Please reserve for the very best!"
          key={value}
        >
          {value}
        </button>
      ))}
    </div>
  </div>
);

const addVote = gql`
  mutation ($photoHash: GraphQLLong!, $value: Int!) {
    addVote(photoHash: $photoHash, value: $value) {
      hash
      rating
    }
  }
`;

export default graphql(addVote, {name: 'addVote'})(Votes);
