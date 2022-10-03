import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, Card, Title, Button, Paragraph, Avatar, IconButton, Menu, Portal, Modal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Constants from "../Constants";
import { fetchPosts } from "../pages/Posts";
const LeftContent = props => <Avatar.Icon {...props} icon="archive" />

const RightContent = ({ post, navigation, author, deletePost }) => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<IconButton onPress={openMenu} icon="dots-vertical" />}>
            <Menu.Item onPress={() => {
                navigation.navigate("PostDetails", { post_id: post?.id, author_name: author?.data.full_name, user_id: author?.id })
                closeMenu()

            }} title="View" />
            <Menu.Item onPress={() => {
                navigation.navigate("AddPost", { post_id: post.id })
                closeMenu()

            }} title="Edit" />
            <Menu.Item onPress={() => {
                deletePost()
                closeMenu()
            }} title="Delete" />
        </Menu>
    )
}

const SinglePost = ({ post, actions }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [author, setAuthor] = useState();
    const [deleteModal, setDelete] = React.useState(false);

    const showDelete = () => setDelete(true);
    const hideDelete = () => setDelete(false);

    const containerStyle = { backgroundColor: 'white', padding: 20, marginHorizontal: 10 };

    const fetchAuthor = async () => {
        const res = await axios.get(`${Constants.url}/users?id=${post.data.user_id}`);
        setAuthor(res.data[0]);
    }

    const deletePost = async () => {
        try {
            await axios.delete(`${Constants.url}/posts/${post.id}`);
            dispatch(fetchPosts(1));
            hideDelete();
        } catch (err) {
            console.log(err);
        }
    }



    useEffect(() => {
        fetchAuthor();
    }, [])

    return (
        <View style={styles.post}>
            <Portal>
                <Modal visible={deleteModal} onDismiss={hideDelete} contentContainerStyle={containerStyle}>
                    <Text>Confirm Post Delete</Text>

                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <Button onPress={hideDelete}>Cancel</Button>

                        <Button onPress={deletePost}>Continue</Button>

                    </View>
                </Modal>
            </Portal>
            <Card mode="elevated" style={{ marginVertical: 1 }}>
                <Card.Title subtitleStyle={{ fontFamily: "Fontspring-regular", fontSize: 16 }} titleStyle={{ fontFamily: "Fontspring-bold", fontSize: 18 }} title={post.data.title} subtitle={!actions ? post.data.subtitle : `Created at ${new Date(post.data.created_at).toISOString().split("T")[0]}`} right={actions ? RightContent.bind(this, { post, navigation, author, deletePost: showDelete }) : null} />
                <Card.Content style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    {actions ? (
                        <>

                        </>

                    ) : (
                        <View style={styles.content}>
                            <View style={styles.names}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontFamily: "Fontspring-bold", }}>Author: </Text>
                                    <Pressable onPress={() => {
                                        navigation.navigate("ProfileAlt", { user_id: author?.id })
                                    }}>
                                        <Text style={{ fontFamily: "Fontspring-regular", }}>{author?.data.full_name}</Text>
                                    </Pressable>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontFamily: "Fontspring-bold", }}>Created at: </Text>
                                    <Text style={{ fontFamily: "Fontspring-regular", }}>{new Date(post?.data.created_at).toISOString().split("T")[0]}</Text>

                                </View>
                            </View>

                            <View style={styles.view_button}>
                                <Button labelStyle={{ fontFamily: "Fontspring-regular" }} onPress={() => navigation.navigate("PostDetails", { post_id: post?.id, author_name: author?.data.full_name, user_id: author?.id })} icon={"eye"}>View</Button>

                            </View>

                        </View>
                    )}
                </Card.Content>

            </Card>

        </View>
    )
}

const styles = StyleSheet.create({
    post: {
        marginVertical: 5,
        marginHorizontal: 5,

    },
    content: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    view_button: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-end"

    },
    bold: {
        fontFamily: "Fontspring-bold",
    },
    regular: {
        fontFamily: "Fontspring-regular",

    }
})

export default SinglePost;