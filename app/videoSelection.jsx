import * as VideoPicker from "expo-image-picker";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

export default function VideoSelection() {
  const router = useRouter();

  const pickVideo = async () => {
    const result = await VideoPicker.launchImageLibraryAsync({
      mediaTypes: VideoPicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      router.push({
        pathname: "/videoCropping",
        params: {
          videoUri: result.assets[0].uri,
          duration: result.assets[0].duration,
        },
      });
    }

    console.log(JSON.stringify(result.assets[0], null, 4));
  };

  return (
    <SafeAreaView className=" flex-1 items-center justify-center bg-white">
      <Image
        source={require("../assets/images/pick1.jpeg")}
        className="w-60 h-60 rounded-full  mb-10"
      />
      <TouchableOpacity
        className="px-6 py-3 bg-green-400 rounded-lg"
        onPress={pickVideo}
      >
        <Text className="font-semibold text-lg text-white">Pick a Video</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
