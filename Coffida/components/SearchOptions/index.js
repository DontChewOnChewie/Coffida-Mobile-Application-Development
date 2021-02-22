import React, {useState, setState} from 'react';
import {FAB} from 'react-native-paper';

const SearchOptions = ({setShowFilter, sortByLocationFunction}) => {
    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;
    
    return (
        <FAB.Group
          accessible={true}
          accessibilityLabel="Drop down menu for search options."
          open={open}
          icon={open ? 'minus' : 'plus'}
          actions={[
            {
              icon: 'map-marker',
              label: 'Location Search',
              onPress: () => sortByLocationFunction(),
            },
            {
              icon: 'filter',
              label: 'Filter Options',
              onPress: () => setShowFilter(prevShowFilter => !prevShowFilter),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
            }
          }}
        />
    );
}

export default SearchOptions;