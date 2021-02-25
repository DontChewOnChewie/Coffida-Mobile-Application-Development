import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ToastAndroid } from 'react-native';
import {
  Text,
  Card,
  Paragraph,
  Divider,
} from 'react-native-paper';
// eslint-disable-next-line import/no-unresolved
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import styles from '../../styles';
import AsyncStoreHelper from '../../helpers/AsyncStoreHelper';

const LIKE_COLOR = '#6200ee';
const UNLIKE_COLOR = '#b1b1b1';

// Used in Location and UserActivity screen.
// Params:
// review = Review object from database.
// locationId = Location ID of location review is for.
// reviewListState = Used to remove review from screen upon review deletion (state object).
// navigation = Navigation object from parent screen.
// setGlobalImageURI = Function passed down to change locations image to users uploaded image.
// showUserEditButtons =  Whether or not to render editing buttons, not shown on UserActivity.

const ReviewObject = ({
  review,
  locationId,
  reviewListState,
  navigation,
  setGlobalImageURI,
  showUserEditButtons,
}) => {
  const [liked, setLiked] = useState(false);
  const [iconColour, setIconColour] = useState(UNLIKE_COLOR);
  const [isUsers, setIsUsers] = useState(false);
  const [imageURI, setImageURI] = useState(null);
  const [likes, setLikes] = useState(review.likes);

  // Test to see if an image is attached to review.
  const getImage = async () => {
    let token;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
    } catch (error) { return; /* Catch for if no token stored. */ }

    fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${review.review_id}/photo?t=${new Date().valueOf()}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.blob();
        setImageURI(null);
        return 'Error';
      })
      .then((data) => {
        if (data !== 'Error') {
          const fs = new FileReader();
          fs.readAsDataURL(data);
          fs.onload = () => { setImageURI(fs.result); };
        }
      })
      .catch(() => { ToastAndroid.show('Error getting your comment data.', ToastAndroid.SHORT); });
  };

  // Check to see if review is logged in users and if its like status for user.
  const setUserHasLikedCommentAndOwnership = async () => {
    let token;
    let id;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
      id = JSON.parse(await AsyncStoreHelper.getCredentials()).id;
    } catch (error) { return null; /* Catch for if no token stored. */ }

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        ToastAndroid.show('Error getting your comment data. Here', ToastAndroid.SHORT);
        return 'Error';
      })
      .then((data) => {
        if (data !== 'Error') {
          const likedReviews = data.liked_reviews;
          const isLiked = (
            likedReviews.filter((like) => like.review.review_id === review.review_id).length)
              > 0;
          if (isLiked) setIconColour(LIKE_COLOR);
          else setIconColour(UNLIKE_COLOR);
          setLiked(isLiked);

          const { reviews } = data;
          const isUsersReview = (
            reviews.filter((rev) => rev.review.review_id === review.review_id)
              .length) > 0;
          setIsUsers(isUsersReview);
        }
      })
      .catch(() => { ToastAndroid.show('Error getting your comment data.', ToastAndroid.SHORT); });
  };

  // Add or remove a like based on current status.
  const handleLikeButtonClick = async () => {
    let token;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
    } catch (error) { return; /* Catch for if no token stored. */ }

    fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${review.review_id}/like`, {
      method: liked ? 'delete' : 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          if (liked) {
            setIconColour(UNLIKE_COLOR);
            setLikes((prevLikes) => prevLikes - 1);
          } else {
            setIconColour(LIKE_COLOR);
            setLikes((prevLikes) => prevLikes + 1);
          }
          setLiked((prevLiked) => !prevLiked);
          ToastAndroid.show(liked ? 'Removed Like' : 'Added Like', ToastAndroid.SHORT);
        } else ToastAndroid.show('Error setting like status.', ToastAndroid.SHORT);
      })
      .catch(() => { ToastAndroid.show('Error setting like status.', ToastAndroid.SHORT); });
  };

  // Delete this review and remove from screen.
  const handleDeleteReviewButtonClick = async () => {
    let token;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
    } catch (error) { return; /* Catch for if no token stored. */ }

    fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${review.review_id}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          const oldReviews = reviewListState[0];
          const newReviews = oldReviews.filter(
            (rev) => rev.review_id !== review.review_id,
          );
          reviewListState[1](newReviews);
          ToastAndroid.show('Removed Review', ToastAndroid.SHORT);
        } else ToastAndroid.show('Error deleting review.', ToastAndroid.SHORT);
      })
      .catch(() => { ToastAndroid.show('Error deleting review.', ToastAndroid.SHORT); });
  };

  useEffect(() => {
    setUserHasLikedCommentAndOwnership();
    getImage();
  }, []);

  return (
    <Card
      accessible
      accessibilityLabel={`Container for review ${review.review_id}.`}
    >
      <Card.Content
        accessible
        accessibilityLabel={`Review ${review.review_id} says ${review.review_body}.`}
      >
        <Text>{review.review_body}</Text>
      </Card.Content>

      <Card.Actions>
        <View style={styles.reviewObjectActionsWrapper}>
          <View style={styles.likeButtonWrapper}>
            <Paragraph style={styles.likeButtonText}>{liked ? 'Unlike' : 'Like'}</Paragraph>
            <TouchableOpacity
              accessible
              accessibilityRole="button"
              accessibilityHint={`${liked ? 'Unlike' : 'Like'} this review.`}
              onPress={() => handleLikeButtonClick()}
            >
              {/* Style added to align fully. */}
              <Icon
                accessible
                accessibilityRole="image"
                accessibilityLabel={`Thumbs up image represeting if a review is liked. You currently ${liked ? 'like' : "don't like"} this review.`}
                name="thumbs-up"
                size={25}
                color={iconColour}
                style={styles.likeButton}
              />
            </TouchableOpacity>
          </View>

          <Text>{`Likes ${likes}`}</Text>
        </View>

      </Card.Actions>

      {showUserEditButtons ? (
        <Card.Actions
          accessible
          accessibilityLabel="Container for editing your created reviews."
        >

          <View style={styles.reviewObjectUserEditActionsWrapper}>
            { isUsers ? (
              <View style={styles.flexDirectionRow}>
                <TouchableOpacity
                  accessible
                  accessibilityRole="button"
                  accessibilityHint={`Navigate to edit page for review ${review.review_id}.`}
                  onPress={() => navigation.navigate('Review', { location_id: locationId, previous_review: review, has_image: imageURI })}
                  style={styles.flexDirectionRow}
                >
                  <Icon
                    accessible
                    accessibilityRole="image"
                    accessibilityLabel={`Icon to edit review ${review.review_id} button.`}
                    name="edit"
                    size={25}
                    color={LIKE_COLOR}
                  />
                  <Paragraph>Edit</Paragraph>
                </TouchableOpacity>

                <TouchableOpacity
                  accessible
                  accessibilityRole="button"
                  accessibilityHint={`Delete review ${review.review_id}.`}
                  onPress={() => handleDeleteReviewButtonClick()}
                  style={styles.userControlButton}
                >
                  <Icon
                    accessible
                    accessibilityRole="image"
                    accessibilityLabel={`Icon for deleting review ${review.review_id} button.`}
                    name="trash"
                    size={25}
                    color="#dd5050"
                  />
                  <Paragraph>Delete</Paragraph>
                </TouchableOpacity>
              </View>
            ) : null}
            { imageURI != null ? (
              <TouchableOpacity
                accessible
                accessibilityRole="button"
                accessibilityHint={`View image for review ${review.review_id}.`}
                onPress={() => setGlobalImageURI(imageURI)}
                style={styles.userControlButton}
              >
                <Icon
                  accessible
                  accessibilityRole="image"
                  accessibilityLabel={`Icon for showing review ${review.review_id} button.`}
                  name="image"
                  size={25}
                  color={LIKE_COLOR}
                />
                <Paragraph>View Image</Paragraph>
              </TouchableOpacity>
            ) : null}
          </View>
        </Card.Actions>
      ) : null }

      <Divider style={styles.divider} />

    </Card>
  );
};

ReviewObject.propTypes = {
  review: PropTypes.shape({
    review_id: PropTypes.number,
    likes: PropTypes.number,
    review_body: PropTypes.string,
  }).isRequired,
  locationId: PropTypes.number.isRequired,
  reviewListState: PropTypes.arrayOf(PropTypes.any).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  setGlobalImageURI: PropTypes.func.isRequired,
  showUserEditButtons: PropTypes.bool.isRequired,
};

export default ReviewObject;
