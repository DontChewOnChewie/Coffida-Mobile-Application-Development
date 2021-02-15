import React, {useState, useEffect, useRef} from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import { Camera } from 'expo-camera';
import styles from './styles';

const CameraView = ({navigation}) => {
    const [image, setImage] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    let camera = useRef().current;

    const take_picture = async () => {
        if (camera) {
            console.log("Taking picture");
            let photo = await camera.takePictureAsync();
            console.log(photo.uri);
        }
    }

    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>

            <Camera style={styles.camera} ref={ref => {
                                                camera = ref;
                                                }}/>

            <View style={styles.buttonView}>
                <Button
                onPress={ () => take_picture() }
                style={styles.button}
                mode="outlined"
                icon="camera">
                Take Picture</Button>
            </View>
        </View>
    );

} 

export default CameraView;