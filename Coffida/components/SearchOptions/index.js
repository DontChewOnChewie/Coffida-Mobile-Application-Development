import React, { useState } from 'react';
import { FAB } from 'react-native-paper';
import PropTypes from 'prop-types';

const SearchOptions = ({ setShowFilter, sortByLocationFunction }) => {
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
  setShowFilter: PropTypes.bool.isRequired,
  sortByLocationFunction: PropTypes.func.isRequired,
};

export default SearchOptions;
