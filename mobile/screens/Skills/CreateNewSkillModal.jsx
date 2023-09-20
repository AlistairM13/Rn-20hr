import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import { useLayoutEffect, useState } from 'react'
import { createSkillAPI, updateSkillAPI } from '../../api/api'
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
    const [isEditMode, setIsEditMode] = useState(false)

    function updateSkillInfo(fieldName, text) {
        setSkillInfo(prev => ({ ...prev, [fieldName]: text }))
    }
    async function createSkill() {
        try {
            skillSchema.parse(skillInfo)
            const token = getToken()
            if (!token) return navigation.replace('Login') // really bad UX
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
    async function updateSkill() {
        try {
            skillSchema.parse(skillInfo)
            const token = getToken()
            const skillId = route.params.skill._id
            if (!token) return navigation.replace('login') // really bad UX
            const response = await updateSkillAPI(skillId, token, skillInfo.name, skillInfo.goal)
            if (response) {
                navigation.pop()
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

    useLayoutEffect(() => {
        const skillToBeEdited = route.params?.skill
        if (skillToBeEdited) {
            setIsEditMode(true)
            setSkillInfo({ name: skillToBeEdited.name, goal: skillToBeEdited.goal })
        }
    }, [])

    return (
        <Pressable style={styles.modalContainer} onPress={navigation.goBack}  >
            <KeyboardAvoidingView style={styles.modalContent}>
                <Text>{isEditMode ? "Update skill" : "Create New Skill"}</Text>
                <TextInput style={styles.textInput} placeholder="Name of the skill" value={skillInfo.name} onChangeText={text => updateSkillInfo("name", text)} />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                <TextInput style={styles.textInput} placeholder="Enter your goal" value={skillInfo.goal} onChangeText={text => updateSkillInfo("goal", text)} />
                {errors.goal && <Text style={styles.errorText}>{errors.goal}</Text>}
                {isEditMode ?
                    <TouchableOpacity style={styles.button} onPress={updateSkill}>
                        <Text style={{ color: "black" }}>Update Skill</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.button} onPress={createSkill}>
                        <Text style={{ color: "black" }}>Create Skill</Text>
                    </TouchableOpacity>
                }
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
    errorText: {
        color:COLORS.red
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

