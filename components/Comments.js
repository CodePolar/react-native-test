import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Divider, IconButton, Text, Button, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Constants from "../Constants";
import SingleComment from "./SingleComment";
import { useForm, Controller } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import { create } from "../features/comments/commentSlice";

const Comments = ({ post_id }) => {
    const [comments, setComments] = useState();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const { reset, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            user_id: user.id,
            post_id: post_id,
            message: "",
            created_at: new Date().getTime(),
            username: user.data.username
        }
    });

    const fetchComments = async () => {
        const res = await axios.get(`${Constants.url}/comments?data.post_id=${post_id}`);
        setComments(res.data);
    }

    const onSubmit = async (data) => {
        data.post_id = post_id;
    
        try {
            await axios.post(`${Constants.url}/comments`, {data: {...data}});
            fetchComments();
            dispatch(create({name: "si"}))
            reset();
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchComments();
    }, [post_id])

    return (
        <View style={styles.container}>
            <View style={styles.comment_header}>
                <IconButton icon="comment" />
                <IconButton onPress={handleSubmit(onSubmit)} mode="contained-tonal" icon="plus" />
            </View>
            <View style={{marginBottom: 10}}>
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
            <ScrollView style={{width: "100%"}}>
                {comments? (
                    comments?.map((e, i) => {
                        return <SingleComment fetchComments={fetchComments} key={i} comment={e} />
                    })

                ) : (
                    <></>
                )}

                
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    comment_header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})

export default Comments;