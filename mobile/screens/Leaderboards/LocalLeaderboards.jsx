import { TouchableOpacity, ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { COLORS } from '../../constants/styles'
import { FlatList, RefreshControl } from 'react-native-gesture-handler'
import useAppStore from '../../store/appStore'
import { fetchLocalLeaderboardsAPI } from '../../api/api'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserProfileScreen from './UserProfileScreen'

const Stack = createNativeStackNavigator()

export default function LocalLeaderboards() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='LocalLbScreen' component={LocalLeaderboardsScreen} />
      <Stack.Screen name='UserProfileScreen' component={UserProfileScreen} />
    </Stack.Navigator>
  )
}

  function LocalLeaderboardsScreen({ navigation }) {

  const { getToken, USER_ID } = useAppStore()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchLocalLeaderboards()
  }, [])

  const fetchLocalLeaderboards = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = getToken()
      if (!token) return navigation.replace('Login')
      const users = await fetchLocalLeaderboardsAPI(token)
      setIsLoading(false)
      setUsers(users)
    } catch (err) {
      console.log("fetchlocal", err)
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={{fontWeight:300, color: 'black', alignSelf:'center', marginTop:8}}>Swipe down to refresh</Text>
      {isLoading && <View style={{ position: 'absolute', height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color={COLORS.blue} />
      </View>}
      <FlatList
        data={users}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchLocalLeaderboards} />
        }
        ListHeaderComponent={() => <View style={{ flexDirection: 'row', padding:8 }}>
          <Text style={{ color: "black", marginRight:8 }}>Rank</Text>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
            <Text style={{ color: "black" }}>Player</Text>
            <Text style={{ color: "black" }}>Time Invested</Text>
          </View >
        </View>}
        ItemSeparatorComponent={() => < View style={{ height: 8 }} />}
        contentContainerStyle={{ padding: 8, paddingTop: 16 }}
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
            (<TouchableOpacity style={styles.leaderBoardItem} onPress={()=>navigation.navigate('UserProfileScreen',{user:item})}>
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