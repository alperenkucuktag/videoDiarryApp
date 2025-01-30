import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Video } from "expo-av";
import Slider from "@react-native-community/slider";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function VideoCropping() {
  const { videoUri, duration } = useLocalSearchParams();
  const router = useRouter();
  const videoRef = useRef(null);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(5);
  const [processing, setProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const formattedDuration = (duration / 1000).toFixed(0);

  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const cropVideoMutation = useMutation({
    mutationFn: async () => {
      setProcessing(true);
      buttonScale.value = withSpring(1.1);

      try {
        if (videoRef.current) {
          await videoRef.current.pauseAsync();
          await new Promise((resolve) => setTimeout(resolve, 500));
          setIsPlaying(false);
        }

        const outputUri = `${videoUri.replace(".mp4", "_cropped.mp4")}`;
        const command = `-i "${videoUri}" -ss ${start} -t ${
          end - start
        } -c:v mpeg4 -c:a aac -strict experimental "${outputUri}"`;

        console.log("🚀 Running FFmpeg command:", command);
        const session = await FFmpegKit.execute(command);
        const returnCode = await session.getReturnCode();

        if (returnCode.isValueSuccess()) {
          console.log("✅ Video cropped successfully!", outputUri);
          setProcessing(false);
          buttonScale.value = withSpring(1);
          return outputUri;
        } else {
          console.error("❌ Video cropping failed");
          setProcessing(false);
          buttonScale.value = withSpring(1);
          throw new Error("FFmpeg video cropping failed");
        }
      } catch (error) {
        console.error("🚨 FFmpeg işleminde hata oluştu:", error);
        throw error;
      }
    },
  });

  const handleCrop = async () => {
    try {
      const croppedOutput = await cropVideoMutation.mutateAsync();

      console.log(
        "✅ Navigating to Metadata with cropped video URI:",
        croppedOutput
      );

      router.push({
        pathname: "/metadata",
        params: { croppedVideoUri: croppedOutput },
      });
    } catch (error) {
      console.error("❌ Error cropping video:", error);
    }
  };

  const togglePlayback = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekToTime = async (value) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value * 1000);
      setCurrentTime(value);
    }
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="mb-4 text-xl font-bold">Select 5-Second Segment</Text>

      <View className="relative">
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.videoPlayer}
          useNativeControls
          resizeMode="contain"
          onPlaybackStatusUpdate={(status) => {
            if (status.positionMillis !== undefined) {
              setCurrentTime(Math.floor(status.positionMillis / 1000));
            }
          }}
        />

        <TouchableOpacity
          className="absolute bottom-5 left-1/2 -translate-x-1/2 p-3 bg-black/70 rounded-full"
          onPress={togglePlayback}
        >
          <Text className="text-white text-lg font-bold">
            {isPlaying ? "Pause" : "Play"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-4">
        <Text className="text-center mb-2">Jump to: {currentTime}s</Text>
        <Slider
          className="w-full h-10"
          minimumValue={0}
          maximumValue={+formattedDuration}
          step={1}
          value={currentTime}
          onValueChange={seekToTime}
        />
      </View>

      <Text>Start: {start}s</Text>
      <Slider
        className="w-full h-10"
        minimumValue={0}
        maximumValue={+formattedDuration}
        step={1}
        value={start}
        onValueChange={(value) => setStart(value)}
      />

      <View className="mb-6">
        <Text className="mb-2 text-base">End: {end}s</Text>
        <Slider
          className="w-full h-10"
          minimumValue={start + 1}
          maximumValue={start + 5}
          step={1}
          value={end}
          onValueChange={(value) => setEnd(value)}
        />
      </View>

      <TouchableOpacity
        className={`w-full p-4 rounded-lg ${
          processing ? "bg-gray-400" : "bg-green-400 active:bg-blue-600"
        }`}
        onPress={handleCrop}
        disabled={processing}
      >
        <Text className="font-semibold text-center text-lg text-white">
          {processing ? "Processing..." : "Crop Video"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  videoPlayer: { width: "100%", height: 200, marginBottom: 20 },
});
