import React, { useState } from 'react';
import { View, Image, ToastAndroid } from 'react-native';
import { Button } from 'react-native-paper';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import PropTypes from 'prop-types';
import styles from '../../../styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';

const CameraView = ({ navigation, route }) => {
  const [imageURI, setImageURI] = useState(null);
  const [imageData, setImageData] = useState(null);
  const locationId = route.params.location_id;
  const reviewId = route.params.review_id;

  const takePicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    const data = await ImagePicker.launchCameraAsync({
      base64: true,
      allowsEditing: false,
    });

    if (!data.cancelled) {
      setImageURI(data.uri);
      setImageData(data);
    }
  };

  const saveImage = async () => {
    if (imageData == null) {
      ToastAndroid.show('Take a Picture First', ToastAndroid.SHORT);
      return;
    }

    let token;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
    } catch (error) { return; /* Catch for if no token stored. */ }

    fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/photo`, {
      method: 'post',
      headers: {
        'Content-Type': 'image/jpeg',
        'X-Authorization': token,
      },
      body: imageData,
    })
      .then((res) => {
        if (res.status === 200) {
          ToastAndroid.show('Image Added', ToastAndroid.SHORT);
          navigation.navigate('Location', { id: locationId });
        }
      })
      .catch(() => {});
  };

  return (
    <View style={styles.cameraContainer}>
      {imageURI !== null ? (
        <Image
          accessible
          accessibilityRole="image"
          accessibilityLabel="Shows the taken image to upload for review."
          style={styles.size100}
          source={{ uri: imageURI }}
        />
      ) : null}
      <View style={styles.flexDirectionRow}>
        <Button
          accessibilityHint="Load up camera app and take a picture to upload."
          onPress={() => takePicture()}
          style={styles.button50}
          mode="outlined"
          icon="camera"
        >
          Take Picture
        </Button>
        <Button
          accessibilityHint={`Upload image to server for review.${imageURI != null ? '' : ' You need to take a picture first.'}`}
          onPress={() => saveImage()}
          style={styles.button50}
          mode="outlined"
          icon="upload"
        >
          Upload Picture
        </Button>
      </View>
    </View>
  );
};

CameraView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      location_id: PropTypes.number,
      review_id: PropTypes.number,
    }),
  }).isRequired,
};

export default CameraView;
