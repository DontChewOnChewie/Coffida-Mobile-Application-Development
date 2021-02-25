/* eslint-disable radix */
import React, { useEffect, useState } from 'react';
import {
  View,
  ToastAndroid,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  Button,
  TextInput,
  Paragraph,
  Text,
} from 'react-native-paper';
// eslint-disable-next-line import/no-unresolved
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import styles from '../../../styles';
import AsyncStoreHelper from '../../../helpers/AsyncStoreHelper';
import ErrorPopUp from '../../ErrorPopUp';
import { ReviewValidation } from '../../../helpers/InputHandler';

const backgroundImage = require('../../../images/loginBG.jpg');

// Add/Edit Review Screen
// Params:
// naviagtion = Navigation object.
// route = Contains:
//            location_id = Location ID of loction review is for.
//            previous_review = Previous review details if the user is updating a review.
//            has_image = Whether or not the review has an image attached to it.

const Review = ({ navigation, route }) => {
  const [priceRating, setPriceRating] = useState('');
  const [qualityRating, setQualityRating] = useState('');
  const [clenlisnessRating, setClenlisnessRating] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [review, setReview] = useState(undefined);
  const [error, setError] = useState(null);
  const [imageButtonDisabled, setImageButtonDisabled] = useState(true);
  const [reviewId, setReviewId] = useState('');
  const [hasImage, setHasImage] = useState(route.params.has_image);

  const locationId = route.params.location_id;
  const previousReview = route.params.previous_review;

  // Make sure a review has valid inputs.
  const validateReview = () => {
    const isValid = ReviewValidation(priceRating, qualityRating, clenlisnessRating, reviewBody);
    if (typeof (isValid) !== 'boolean') {
      setError(isValid);
      return false;
    }
    setError(null);
    return true;
  };

  // Get a newly uploaded review so an image can be added.
  const getNewReviewId = async () => {
    let token;
    let id;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
      id = JSON.parse(await AsyncStoreHelper.getCredentials()).id;
    } catch (anError) { return null; /* Catch for if no token stored. */ }

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        ToastAndroid.show('Error getting new review.', ToastAndroid.SHORT);
        return 'Error';
      })
      .then((data) => {
        if (data !== 'Error') {
          const lastReview = data.reviews[data.reviews.length - 1];
          setReviewId(lastReview.review.review_id);
        }
      })
      .catch(() => { ToastAndroid.show('Error getting new review.', ToastAndroid.SHORT); });
  };

  // Submit a brand new review.
  const submitReview = async () => {
    if (!validateReview()) return;

    let token;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
    } catch (anError) { return; /* Catch for if no token stored. */ }

    fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify({
        overall_rating:
        parseInt((
          parseInt(priceRating) + parseInt(qualityRating) + parseInt(clenlisnessRating)
        ) / 3),
        price_rating: parseInt(priceRating),
        quality_rating: parseInt(qualityRating),
        clenliness_rating: parseInt(clenlisnessRating),
        review_body: reviewBody,
      }),
    })
      .then(async (res) => {
        if (res.status === 201) {
          ToastAndroid.show('Review Added', ToastAndroid.SHORT);
          await getNewReviewId();
          setImageButtonDisabled(false);
        } else ToastAndroid.show('Error adding new review.', ToastAndroid.SHORT);
      })
      .catch(() => { ToastAndroid.show('Error adding new review.', ToastAndroid.SHORT); });
  };

  // Update an existing review with new valid details.
  const updateReview = async () => {
    if (!validateReview()) return;

    let token;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
    } catch (anError) { return; /* Catch for if no token stored. */ }

    fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${review.review_id}`, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify({
        overall_rating: parseInt((
          parseInt(priceRating) + parseInt(qualityRating) + parseInt(clenlisnessRating)
        ) / 3),
        price_rating: parseInt(priceRating),
        quality_rating: parseInt(qualityRating),
        clenliness_rating: parseInt(clenlisnessRating),
        review_body: reviewBody,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          ToastAndroid.showWithGravity('Review Updated', ToastAndroid.SHORT, ToastAndroid.CENTER);
        } else ToastAndroid.show('Error updating new review.', ToastAndroid.SHORT);
      })
      .catch(() => { ToastAndroid.show('Error updating new review.', ToastAndroid.SHORT); });
  };

  // Delete and image that is attached to a review.
  const deleteImage = async () => {
    let token;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
    } catch (anError) { return; /* Catch for if no token stored. */ }

    // Reset variables so that user can add a new image.
    setHasImage('');
    setImageButtonDisabled(false);

    fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${review.review_id}/photo`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          ToastAndroid.show('Image Deleted', ToastAndroid.SHORT);
        }
      })
      .catch(() => { ToastAndroid.show('Error removing image,', ToastAndroid.SHORT); });
  };

  // Check if user is editing a review and set inputs to values if they are.
  useEffect(() => {
    if (Object.keys(previousReview).length !== 0) {
      setReviewId(previousReview.review_id);
      setReview(previousReview);
      setPriceRating(previousReview.price_rating);
      setQualityRating(previousReview.quality_rating);
      setClenlisnessRating(previousReview.clenliness_rating);
      setReviewBody(previousReview.review_body);
      if (hasImage === '' || hasImage == null) setImageButtonDisabled(false);
    }
  }, []);

  return (
    <ImageBackground
      accessible
      accessibilityLabel="Background image of coffee on table."
      source={backgroundImage}
      style={styles.container}
    >

      {error !== null
        ? <ErrorPopUp errorMessage={error} errorStateFunction={setError} />
        : null}

      <Text style={styles.formTitle}>Leave a Review</Text>

      <TextInput
        accessibilityLabel="Form input for price rating."
        accessibilityValue={{ min: 0, max: 5, now: priceRating }}
        style={styles.input90}
        label="Price Rating..."
        onChangeText={(text) => setPriceRating(text)}
        keyboardType="number-pad"
        maxLength={1}
        value={priceRating.toString()}
      />

      <TextInput
        accessibilityLabel="Form input for quality rating."
        accessibilityValue={{ min: 0, max: 0, now: qualityRating }}
        style={styles.input90}
        label="Quality Rating..."
        onChangeText={(text) => setQualityRating(text)}
        keyboardType="number-pad"
        maxLength={1}
        value={qualityRating.toString()}
      />

      <TextInput
        accessibilityLabel="Form input for clenliness rating."
        accessibilityValue={{ min: 0, max: 0, now: clenlisnessRating }}
        style={styles.input90}
        label="Clenliness Rating..."
        onChangeText={(text) => setClenlisnessRating(text)}
        keyboardType="number-pad"
        maxLength={1}
        value={clenlisnessRating.toString()}
      />

      <TextInput
        accessibilityLabel="Form input for comments on location."
        accessibilityValue={{ text: 'Review body must be longer than 15 words but less than 500.' }}
        style={styles.textarea}
        multiline
        numberOfLines={7}
        label="Review Body..."
        onChangeText={(text) => setReviewBody(text)}
        value={reviewBody}
      />

      <View style={styles.reviewScreenButtonWrapper}>
        <Button
          accessibilityHint={`This will ${review == null ? 'create' : 'edit'} this review.`}
          style={styles.button40}
          mode="contained"
          icon="arrow-right"
          onPress={() => {
            if (review === undefined) submitReview();
            else updateReview();
          }}
        >
          {review === undefined ? 'Submit Review' : 'Update Review'}
        </Button>

        <Button
          accessibilityHint={`Add an image for this review, currently ${imageButtonDisabled ? 'disabled' : 'enabled'}.`}
          style={styles.button40}
          mode="contained"
          icon="camera"
          disabled={imageButtonDisabled}
          onPress={() => navigation.navigate('Camera', { location_id: locationId, review_id: reviewId })}
        >
          Add a Picture
        </Button>
      </View>

      {hasImage !== '' && hasImage !== null ? (
        <TouchableOpacity
          accessible
          accessibilityRole="button"
          accessibilityHint="Delete image for this review."
          onPress={() => deleteImage()}
          style={styles.deleteImageButton}
        >
          <Icon name="trash" size={25} color="#FFFFFF" />
          <Paragraph style={styles.boldedWhiteText}>Remove Image</Paragraph>
        </TouchableOpacity>
      ) : null}
    </ImageBackground>
  );
};

Review.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      location_id: PropTypes.number,
      previous_review: PropTypes.shape({
        review_id: PropTypes.number,
        price_rating: PropTypes.number,
        quality_rating: PropTypes.number,
        clenliness_rating: PropTypes.number,
        review_body: PropTypes.string,
      }).isRequired,
      has_image: PropTypes.string,
    }),
  }).isRequired,
};

export default Review;
