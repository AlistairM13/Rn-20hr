import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import useAppStore from '../../store/appStore'
import { fetchUserDetailsAPI } from '../../api/api'


export default function UserProfileScreen({ navigation, route }) {
    const { getToken } = useAppStore()
    useEffect(() => {
        fetchUserDetails()
    }, [])

    async function fetchUserDetails() {
        try {
            const user = route.params.user
            const token = getToken()
            if (!token) return navigation.replace('Login')
            const response = await fetchUserDetailsAPI(user.id, token)
            console.log(response)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <View style={styles.container}>
            <Text>Username</Text>
            <FlatList
                contentContainerStyle={{ padding: 8, paddingTop: 16 }}
                data={[]}
                renderItem={({ item }) => <Text>Hey</Text>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    }
})