import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface CountdownTimerProps {
  initialMinutes: number;
  onTimeUp?: () => void;
}

export function CountdownTimer({
  initialMinutes,
  onTimeUp,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Thời gian còn lại:</Text>
      <Text style={styles.timer}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  timer: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#60A5FA",
  },
});
