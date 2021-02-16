import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    ratingContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },

    ratingTitle : {
        fontSize: 14,
        width: '30%',
    },

    ratingCube : {
        width: '10%',
        backgroundColor: 'red',
        height: 10,
        marginRight: 1,
    }
});

export default styles;