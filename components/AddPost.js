import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, IconButton, Portal, Dialog, Paragraph, Button, TextInput } from "react-native-paper";
import Constants from "../Constants";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { create } from "../features/posts/postSlice";
import axios from "axios";
import { fetchPosts } from "../pages/Posts";

const primary = Constants.colors.primary;

const AddPost = ({ navigation, route }) => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [visible, setVisible] = React.useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [postId, setPostId] = useState();
    const [post, setPost] = useState();
    const { setValue, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            subtitle: '',
            content: '',
            created_at: new Date().getTime(),
            user_id: user.id
        }
    });

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    const handleBack = () => {
        navigation.navigate("Home", { screen: "Profile" })
    };

    const createPost = (data) => async (dispatch, getState) => {
        await axios.post(`${Constants.url}/posts`, {
            data: { ...data }
        })
        dispatch(fetchPosts(1));
        navigation.navigate("Posts");
    }
    const updatePost = (data) => async (dispatch, getState) => {
        await axios.put(`${Constants.url}/posts/${post.id}`, {
            data: { ...data }
        })
        dispatch(fetchPosts(1));
        navigation.navigate("Posts");
    }

    const onSubmit = async (data) => {
        try {
            if (post) {
                dispatch(updatePost(data));
                return;
            }
            dispatch(createPost(data));
        } catch (err) {
            console.log(err);
        }
    }

    const fetchPost = async (post_id) => {
        try {
            const res = await axios.get(`${Constants.url}/posts?id=${post_id}`);
            setPost(res.data[0]);
            setValue("title", res.data[0].data.title);
            setValue("subtitle", res.data[0].data.subtitle);
            setValue("content", res.data[0].data.content);

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (route.params) {
            setPostId(route.params.post_id);
            fetchPost(route.params.post_id);
        }
    }, [])

    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton onPress={handleBack} icon={"arrow-left"} iconColor="white" />
                <Text variant="headlineSmall" style={[styles.text, { ...styles.heading }]}>{post ? `Edit Post` : "Add Post"}</Text>
            </View>
            <View style={styles.main}>
                <ScrollView>
                    <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog}>
                            <Dialog.Title>Error</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>{errorMsg}</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>Done</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <View style={styles.form_control}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Title"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    defaultValue="dasada"
                                    error={errors.title}
                                />
                            )}
                            name="title"
                        />
                    </View>
                    <View style={styles.form_control}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Subtitle"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.subtitle}
                                />
                            )}
                            name="subtitle"
                        />
                    </View>
                    <View style={styles.form_control}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Content"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.content}
                                />
                            )}
                            name="content"
                        />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Button onPress={handleSubmit(onSubmit)} labelStyle={{ fontFamily: "Fontspring-bold" }} style={styles.signUp} mode="contained" >{post ? "Save" : "Create Post"}</Button>
                    </View>
                </ScrollView>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: primary,
    },
    regular: {
        fontFamily: "Fontspring-regular",
        color: "#b8bec8",
        margin: 0
    },
    main: {
        backgroundColor: "white",
        paddingHorizontal: 30,
        paddingTop: 30,
        flex: 1,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20

    },
    text: {
        color: "#18315d",
        fontFamily: "Fontspring-bold",
    },
    head: {
        fontFamily: "Fontspring-regular",
    },
    signIn: {
        marginBottom: 13
    },
    signUp: {
        borderColor: "white",
        backgroundColor: primary,
    },
    footer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        height: 70
    },
    already: {
        fontFamily: "Fontspring-regular",
        color: "black"
    },
    altSignIn: {
        color: primary,
        fontFamily: "Fontspring-bold"
    },
    header: {
        backgroundColor: primary,
        flex: .2,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center"
    },
    heading: {
        color: "white",
        paddingLeft: 15,
        paddingTop: 5
    },
    form_control: {
        marginVertical: 5
    }
})

export default AddPost;