import { ActivityIndicator, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { COLORS } from '../../constants/styles'
import { FlatList } from 'react-native-gesture-handler'
import { fetchGlobalLeaderboardsAPI } from '../../api/api'
import useAppStore from '../../store/appStore'


export default function GlobalLeaderboards() {
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
      console.log("fetchglobal", err)
    }
  }, [])

  return (
    <View style={styles.container}>
      {isLoading && <View style={{ position: 'absolute', height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small"  color={COLORS.blue} />
      </View>}
      <FlatList
        data={users}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchGlobalLeaderboards} />
        }
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
            (<TouchableOpacity style={styles.leaderBoardItem}>
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