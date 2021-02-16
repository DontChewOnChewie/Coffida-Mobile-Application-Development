import React from 'react';
import {Modal, Text} from 'react-native-paper';

const FilterModal = ({showFilter}) => {

    return (
        <Modal visible={showFilter[0]} onDismiss={() => showFilter[1](prevShowFilter => !prevShowFilter)} contentContainerStyle={{alignItems:'center', justifyContent:'center'}}>
          <Text style={{color: 'white'}}>Example Modal.  Click outside this area to dismiss.</Text>
        </Modal>
    );

}

export default FilterModal;