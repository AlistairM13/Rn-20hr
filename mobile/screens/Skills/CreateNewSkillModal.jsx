import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { createSkillAPI } from '../../api/api'
import { z } from 'zod'
import useAppStore from '../../store/appStore'
import { COLORS } from '../../constants/styles'

const skillSchema = z.object({
    name: z.string().nonempty().max(15, "Maximum of 15 characters allowed"),
    goal: z.string().nonempty("What do you wish to finish by 20 hours").max(30, "Maximum of 30 characters allowed"),
})

export default function CreateNewSkillScreen({ navigation, route }) {
    const { getToken } = useAppStore()
    const [skillInfo, setSkillInfo] = useState({ name: "", goal: "" })
    const [errors, setErrors] = useState({})

    function updateSkillInfo(fieldName, text) {
        setSkillInfo(prev => ({ ...prev, [fieldName]: text }))
    }
    async function createSkill() {
        try {
            skillSchema.parse(skillInfo)
            const token = getToken()
            if (!token) return navigation.replace('login') // really bad UX
            const response = await createSkillAPI(skillInfo.name, skillInfo.goal, token)
            if (response) {
                navigation.pop() // This is why bottom sheet is needed
                navigation.navigate("SkillDetailScreen", { skill: response.skill })
            }
        } catch (err) {
            if (err.formErrors) {
                const fieldErrors = {};
                const errors = err.formErrors.fieldErrors
                for (let err in errors) {
                    fieldErrors[err] = errors[err][0]
                }
                setErrors(fieldErrors);
            } else {
                console.error("error logging in ", err);
            }
        }
    }
    return (
        <Pressable style={styles.modalContainer} onPress={navigation.goBack}  >
            <KeyboardAvoidingView style={styles.modalContent}>
                <Text>Create New Skill</Text>
                <TextInput style={styles.textInput} placeholder="Name of the skill" value={skillInfo.name} onChangeText={text => updateSkillInfo("name", text)} />
                {errors.name && <Text>{errors.name}</Text>}
                <TextInput style={styles.textInput} placeholder="Enter your goal" value={skillInfo.goal} onChangeText={text => updateSkillInfo("goal", text)} />
                {errors.goal && <Text>{errors.goal}</Text>}
                <TouchableOpacity style={styles.button} onPress={createSkill}>
                    <Text style={{ color: "black" }}>Create Skill</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalContent: {
        paddingVertical: 20,
        alignItems: "center",
        backgroundColor: COLORS.blue,
        borderTopEndRadius: 50,
        borderTopStartRadius: 50,
    },
    textInput: {
        width: "70%",
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 16,
        marginBottom: 4
    },
    button: {
        width: "70%",
        alignItems: "center",
        paddingVertical: 8,
        backgroundColor: COLORS.green,
        borderRadius: 8,
        marginTop: 16
    }
})

