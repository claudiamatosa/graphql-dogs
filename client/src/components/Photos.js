import React from 'react';
import { gql, graphql } from 'react-apollo';
import { compose, lifecycle } from 'recompose';
import update from 'immutability-helper';

import Votes from './Votes';
import './Photos.css';

const Photos = ({data = {}}) => (
  <ul className="Photos">
    {data.loading ? 'Get ready for dog pics...' : null}

    {data.photos && data.photos.map(photo => (
      <li className="Photos-item" key={photo.hash}>
        <div className="Photos-image-container">
          <img className="Photos-image" src={photo.url} alt="" />
        </div>

        <Votes
          photoHash={photo.hash}
          currentRating={photo.rating}
        />

        <a className="Photos-original" href={photo.original} target="_blank">
          View on <b>{photo.type} ></b>
        </a>
      </li>
    ))}
  </ul>
);

// gql converts the string into an object that can be used by Apollo
const query = gql`
  query getPhotos {
    photos {
      hash
      type
      url
      original
      rating
    }
  }
`;

const subscribeToNewVotes = gql`
  subscription {
    ratingChanged {
      hash
      rating
    }
  }
`;

const componentWillMount = ({subscribeToMore}) => {
  subscribeToMore({
    document: subscribeToNewVotes,
    variables: {},
    updateQuery: (prev, {subscriptionData}) => {
      if (!subscriptionData.data) {
        return prev;
      }

      const newRating = subscriptionData.data.ratingChanged;
      const updatedPhotoIndex = prev.photos.findIndex(photo => (photo.hash === newRating.hash));

      if (updatedPhotoIndex > -1) {
        const photo = prev.photos.find(photo => (photo.hash === newRating.hash));

        return update(prev, {
          photos: {
            $splice: [[updatedPhotoIndex, 1, {
              ...photo,
              ...newRating,
            }]],
          },
        });
      } else {
        return prev;
      }
    }
  });
};

export default compose(
  graphql(query),
  lifecycle({
    componentWillMount: function () {
      componentWillMount({
        subscribeToMore: this.props.data && this.props.data.subscribeToMore
      });
    },
  })
)(Photos);
