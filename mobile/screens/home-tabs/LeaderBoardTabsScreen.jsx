import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LocalLeaderboards from '../Leaderboards/LocalLeaderboards';
import GlobalLeaderboards from '../Leaderboards/GlobalLeaderboards';

const Tab = createMaterialTopTabNavigator();

export default function LeaderBoardTabScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Local" component={LocalLeaderboards} />
      <Tab.Screen name="Global" component={GlobalLeaderboards} />
    </Tab.Navigator>
  );
}