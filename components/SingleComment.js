import React from "react";
import { Pressable, View } from "react-native";
import { Text, Card, Avatar, Button, Menu, Divider, IconButton, Modal, Portal, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Controller,useForm  } from "react-hook-form";
import axios from "axios";
import Constants from "../Constants";
import { fetchPosts } from "../pages/Posts";
import { destroy } from "../features/comments/commentSlice";
import { useNavigation } from "@react-navigation/native";

const LeftContent = props => <Avatar.Icon {...props} icon="account" />

const RightContent = props => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<IconButton onPress={openMenu} icon="dots-vertical" />}>
            <Menu.Item onPress={() => {
                closeMenu()
                props.showEdit();
            }} title="Edit" />
            <Menu.Item onPress={() => {
                closeMenu()
                props.showDelete();

            }} title="Delete" />
        </Menu>
    )
}

const SingleComment = ({ comment, fetchComments }) => {
    const user = useSelector((state) => state.user.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [edit, setEdit] = React.useState(false);
    const [deleteModal, setDelete] = React.useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            message: comment.data.message
        }
    });

    const showDelete = () => setDelete(true);
    const hideDelete = () => setDelete(false);

    const showEdit = () => setEdit(true);
    const hideEdit = () => setEdit(false);
    const containerStyle = { backgroundColor: 'white', padding: 20, marginHorizontal: 10 };

    const onSubmit = async (data) => {
        try {
            comment.data.message = data.message;
            await axios.put(`${Constants.url}/comments/${comment.id}`, {
                data: {...comment.data}
            })
            fetchComments();
            dispatch(fetchPosts(1));
            hideEdit();
        } catch(err) {
            console.log(err);
        }
    }

    const handleDelete = async () => { 
        try {
            await axios.delete(`${Constants.url}/comments/${comment.id}`);
            fetchComments();
            hideDelete();
            dispatch(destroy());
        } catch(err) {
            console.log(err)
        }
    }



    return (
        <Pressable onPress={() => {
            navigation.navigate("ProfileAlt", { user_id: comment.data.user_id })
        }}>
   <Card mode="elevated" style={{ marginVertical: 10, marginHorizontal: 2 }}>
            <Portal>
                <Modal visible={edit} onDismiss={hideEdit} contentContainerStyle={containerStyle}>
                    <View  style={{ marginBottom: 10 }}>
                        <Controller
                            control={control}
                            rules={{
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (

                                <TextInput
                                    mode="outlined"
                                    label="Comment"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.message}
                                />

                            )}
                            name="message"
                        />

                    </View>
                    <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                    <Button onPress={hideEdit}>Cancel</Button>

                    <Button onPress={handleSubmit(onSubmit)}>Save</Button>

                    </View>
                </Modal>
                <Modal visible={deleteModal} onDismiss={hideDelete} contentContainerStyle={containerStyle}>
                <Text>Confirm Delete</Text>

                <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                    <Button onPress={hideDelete}>Cancel</Button>

                    <Button onPress={handleDelete}>Continue</Button>

                    </View>
                </Modal>

            </Portal>

            <Card.Title title={comment.data.username} subtitle={`Date: ${new Date(comment.data.created_at).toISOString().split("T")[0]}`} left={LeftContent} right={user.id === comment.data.user_id? RightContent.bind(this, { showEdit, showDelete }) : null} />
            <Card.Content style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                <Text>{comment.data.message}</Text>
            </Card.Content>


        </Card>
        </Pressable>
     
    )
}

export default SingleComment