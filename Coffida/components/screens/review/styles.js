import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    input : {
        width: '100%',
        height: 40,
        marginBottom: 10,
    },

    largeInput: {
        justifyContent:'flex-start',
        width: '100%',
        maxHeight: 120,
        marginBottom: 10,
    },

    buttonLayout : {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },

    button : {
        width: '45%',
    }

});

export default styles;