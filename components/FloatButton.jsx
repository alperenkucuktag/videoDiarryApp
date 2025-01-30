import { Pressable, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";

const FloatButton = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center w-16 h-16 p-3 bg-green-400 rounded-full active:scale-95 active:opacity-90"
    >
      <Entypo name="plus" size={35} color="#fff" />
    </Pressable>
  );
};

export default FloatButton;
