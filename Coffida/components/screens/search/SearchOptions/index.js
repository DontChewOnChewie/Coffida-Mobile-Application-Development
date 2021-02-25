import React, { useState } from 'react';
import { FAB } from 'react-native-paper';
import PropTypes from 'prop-types';

// Used in Search Screen as a menu in bottom right corner.
// Params:
// setShowFilter = State object saying whether or not to display filter options.
// sortByLocationFunction = Function that sorts and displays locations in distance order.
// showMap = Function that navigates to map page.

const SearchOptions = ({ setShowFilter, sortByLocationFunction, showMap }) => {
  const [opened, setOpened] = useState({ open: false });
  const onStateChange = ({ open }) => setOpened({ open });
  const { open } = opened;

  return (
    <FAB.Group
      accessible
      accessibilityLabel="Drop down menu for search options."
      open={open}
      icon={open ? 'minus' : 'plus'}
      actions={[
        {
          icon: 'map',
          label: 'Show on Map',
          onPress: () => showMap(),
        },
        {
          icon: 'map-marker',
          label: 'Location Search',
          onPress: () => sortByLocationFunction(),
        },
        {
          icon: 'filter',
          label: 'Filter Options',
          onPress: () => setShowFilter((prevShowFilter) => !prevShowFilter),
        },
      ]}
      onStateChange={onStateChange}
      onPress={() => {
      }}
    />
  );
};

SearchOptions.propTypes = {
  setShowFilter: PropTypes.func.isRequired,
  sortByLocationFunction: PropTypes.func.isRequired,
  showMap: PropTypes.func.isRequired,
};

export default SearchOptions;
