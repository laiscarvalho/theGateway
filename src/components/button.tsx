import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  TouchableOpacityProps,
} from "react-native";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface buttonsProps extends TouchableOpacityProps {
  title: string;
  containerConfirm?: boolean;
}
export function Button({ title, containerConfirm, ...rest }: buttonsProps) {
  return (
    <TouchableOpacity
      style={
        containerConfirm === true ? styles.containerConfirm : styles.container
      }
    >
      <Text style={styles.text} {...rest}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.green,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  containerConfirm: {
    backgroundColor: colors.green,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.heading,
  },
});
