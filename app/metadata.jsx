import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Video } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import useVideoStore from "./store/useVideoStore";
import { Formik } from "formik";
import * as Yup from "yup";
import { randomColorGenerator } from "../hooks/randomColorGenerator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MetadataScreen() {
  const router = useRouter();
  const { croppedVideoUri } = useLocalSearchParams();
  const { addVideo } = useVideoStore();

  const validationSchema = Yup.object().shape({
    videoTitle: Yup.string().required("Title is required!"),
    videoDescription: Yup.string()
      .min(10, "Description must be at least 10 characters!")
      .required("Description is required!"),
  });

  return (
    <View className="items-center flex-1 p-5 bg-white">
      {croppedVideoUri ? (
        <Video
          source={{ uri: croppedVideoUri }}
          style={styles.videoPlayer}
          useNativeControls
          resizeMode="contain"
        />
      ) : (
        <Text>No video available</Text>
      )}

      {/* 📌 Formik Form */}
      <Formik
        initialValues={{
          videoTitle: "",
          videoDescription: "",
          timestamp: new Date().toISOString(),
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (!croppedVideoUri) {
              alert("⚠️ Error: No cropped video found!");
              return;
            }

            const newVideoData = {
              videoTitle: values.videoTitle,
              videoDescription: values.videoDescription,
              timestamp: values.timestamp,
              videoUri: croppedVideoUri,
              videoColor: randomColorGenerator(),
            };

            console.log("✅ Video metadata kaydedildi:", newVideoData);

            const storedVideos = await AsyncStorage.getItem("video-storage");
            let existingVideos = storedVideos ? JSON.parse(storedVideos) : [];

            if (!Array.isArray(existingVideos)) {
              existingVideos = [];
            }

            const updatedVideos = [...existingVideos, newVideoData];
            await AsyncStorage.setItem(
              "video-storage",
              JSON.stringify(updatedVideos)
            );

            addVideo(newVideoData);

            alert("✅ Metadata saved successfully! 🎉");
            resetForm();
            router.push("/");
          } catch (error) {
            console.error("🚨 Something went wrong:", error);
            alert("🚨 Something went wrong! Please try again.");
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              className="w-full p-2 mb-3 text-lg border border-gray-300 rounded"
              placeholder="Enter title..."
              value={values.videoTitle}
              onChangeText={handleChange("videoTitle")}
              onBlur={handleBlur("videoTitle")}
            />
            {touched.videoTitle && errors.videoTitle && (
              <Text className="mb-3 text-sm text-red-500">
                {errors.videoTitle}
              </Text>
            )}

            <TextInput
              className="w-full h-20 p-2 mb-3 text-lg border border-gray-300 rounded text-start"
              placeholder="Enter description..."
              value={values.videoDescription}
              onChangeText={handleChange("videoDescription")}
              onBlur={handleBlur("videoDescription")}
              multiline
            />
            {touched.videoDescription && errors.videoDescription && (
              <Text className="mb-3 text-sm text-red-500">
                {errors.videoDescription}
              </Text>
            )}

            <Text className="mb-4 text-sm text-gray-500">
              📅{" "}
              {values.timestamp
                ? new Date(values.timestamp).toLocaleString()
                : "Geçerli Tarih Yok"}
            </Text>

            <TouchableOpacity
              className="w-full p-4 bg-green-400 rounded-lg"
              onPress={handleSubmit}
            >
              <Text className="text-xl font-semibold text-center text-white">
                Save
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  videoPlayer: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
});
