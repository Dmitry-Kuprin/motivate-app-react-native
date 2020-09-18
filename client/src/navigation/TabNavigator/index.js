import React from 'react';
import {StyleSheet} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';

import TestHome from '../../screens/TestScreens/testhome';
import TestSettings from '../../screens/TestScreens/testsettings';

const { Navigator, Screen } = createBottomTabNavigator();

const HomeOutline = (props) => <Icon {...props} name="home-outline" />;
const SettingsIcon = (props) => <Icon {...props} name="settings-outline" />;

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab icon={HomeOutline} title="HOME" />
    <BottomNavigationTab icon={SettingsIcon} title="SETTINGS" />
  </BottomNavigation>
);

// const styles = StyleSheet.create({
//   bottomNavigationContainer: {
//     backgroundColor: 'black',
//   }
// })

const TabNavigator = () => {
  return (
    <NavigationContainer>
      <Navigator tabBar={(props) => <BottomTabBar {...props} />}>
        <Screen name="HOME" component={TestHome} />
        <Screen name="SETTINGS" component={TestSettings} />
      </Navigator>
    </NavigationContainer>
  );
};

export default TabNavigator;