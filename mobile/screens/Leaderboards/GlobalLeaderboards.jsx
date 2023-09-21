import { ActivityIndicator, RefreshControl, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { COLORS } from '../../constants/styles'
import { fetchGlobalLeaderboardsAPI } from '../../api/api'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { showToast } from '../../helpers/helpers'
import useAppStore from '../../store/appStore'
import UserProfileScreen from './UserProfileScreen'

const Stack = createNativeStackNavigator()

export default function GlobalLeaderboards() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='GlobalLbScreen' component={GlobalLeaderboardsScreen} />
      <Stack.Screen name='UserProfileScreen' component={UserProfileScreen} />
    </Stack.Navigator>
  )
}

function GlobalLeaderboardsScreen({ navigation }) {
  const { USER_ID } = useAppStore()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchGlobalLeaderboards()
  }, [])

  const fetchGlobalLeaderboards = useCallback(async () => {
    try {
      setIsLoading(true)
      const users = await fetchGlobalLeaderboardsAPI()
      setIsLoading(false)
      setUsers(users)
    } catch (err) {
      showToast("error", 'Error', "Could not fetch the leaderboards")
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: 300, color: 'black', alignSelf: 'center', marginTop: 8 }}>Swipe down to refresh</Text>

      {isLoading && <View style={{ position: 'absolute', height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color={COLORS.blue} />
      </View>}
      <FlatList
        data={users}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchGlobalLeaderboards} />
        }
        ListHeaderComponent={() => <View style={{ flexDirection: 'row', padding: 8 }}>
          <Text style={{ color: "black", marginRight: 8 }}>Rank</Text>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
            <Text style={{ color: "black" }}>Player</Text>
            <Text style={{ color: "black" }}>Time Invested</Text>
          </View >
        </View>}
        contentContainerStyle={{ padding: 8, paddingTop: 16 }}
        ItemSeparatorComponent={() => < View style={{ height: 8 }} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) =>
          item.id === USER_ID ?
            (<View style={[styles.leaderBoardItem, { borderWidth: 2, borderColor: COLORS.blue }]}>
              <Text style={{ color: "black", marginRight: 16 }}>{index < 3 ? `#${index + 1}` : index + 1}</Text>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
                <Text style={{ color: "black", fontWeight: "900" }}>You</Text>
                <Text style={{ color: "black" }}>{item.totalTimeInvested.toFixed(2)}</Text>
              </View>
            </View>) :
            (<TouchableOpacity style={styles.leaderBoardItem} onPress={() => navigation.navigate('UserProfileScreen', { user: item })}>
              <Text style={{ color: "black", marginRight: 16 }}>{index < 3 ? `#${index + 1}` : index + 1}</Text>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
                <Text style={{ color: "black" }}>{item.name}</Text>
                <Text style={{ color: "black" }}>{item.totalTimeInvested.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>)
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgGray
  },
  leaderBoardItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row'
  }
})