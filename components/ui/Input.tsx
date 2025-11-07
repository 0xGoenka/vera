import { Colors } from "@/constants/colors";
import { BorderRadius, Dimensions, Margin, Padding } from "@/constants/spacing";
import { useServices } from "@/domain/core/service.provider";
import type { LoadingState } from "@/domain/services/stream/stream.type";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useObservable } from "micro-observables";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

export const Input = ({ displayText = true }: { displayText?: boolean }) => {
  const [message, setMessage] = useState("");
  const { streamService } = useServices();
  const loading = useObservable(streamService.loading);

  const handleAction = () => {
    const trimmedMessage = message.trim();

    // Validate input before sending
    if (loading === "SUCCESS" && trimmedMessage.length === 0) {
      return;
    }

    switch (loading) {
      case "LOADING":
        return;
      case "STREAMING":
        streamService.close();
        break;
      case "ERROR":
        // Allow retry on error
        if (trimmedMessage.length > 0) {
          streamService.stream(trimmedMessage);
        }
        return;
      case "SUCCESS":
        if (trimmedMessage.length > 0) {
          streamService.stream(trimmedMessage);
          setMessage(""); // Clear input after sending
        }
        break;
      default:
        return;
    }
  };

  return (
    <Container displayText={displayText}>
      {displayText && <WelcomeText>Where should we begin ?</WelcomeText>}
      <InputContainer>
        <ChatInput
          placeholder="Ask a clinical question"
          placeholderTextColor={Colors.text.placeholder}
          value={message}
          onChangeText={setMessage}
          editable={loading === "SUCCESS" && message.trim().length === 0}
          accessibilityLabel="Message input"
          accessibilityHint="Enter your clinical question here"
        />
        <IconContainer
          onPress={handleAction}
          disabled={
            loading === "LOADING" ||
            (loading === "SUCCESS" && message.trim().length === 0)
          }
          accessibilityLabel={
            loading === "STREAMING" ? "Stop streaming" : "Send message"
          }
          accessibilityRole="button"
        >
          {getIcon(loading)}
        </IconContainer>
      </InputContainer>
    </Container>
  );
};

const getIcon = (loading: LoadingState) => {
  switch (loading) {
    case "LOADING":
      return <ActivityIndicator size="small" color="white" />;
    case "STREAMING":
      return <FontAwesome5 name="stop" size={18} color="white" />;
    case "SUCCESS":
      return <Feather name="arrow-up" size={18} color="white" />;
    case "ERROR":
      return <Feather name="arrow-up" size={18} color="white" />;
    default:
      return <Feather name="arrow-up" size={18} color="white" />;
  }
};

const IconContainer = styled.TouchableOpacity`
  background-color: ${Colors.background.black};
  border-radius: ${BorderRadius.round}%;
  border-color: ${Colors.border.light};
  padding: ${Padding.input}px;
  aspect-ratio: 1;
  justify-content: center;
  align-items: center;
`;

const WelcomeText = styled.Text`
  color: ${Colors.text.primary};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: ${Margin.welcomeText}px;
  font-family: system-ui;
`;

const Container = styled.View<{ displayText: boolean }>`
  padding: ${Padding.container}px;
  background-color: ${Colors.background.primary};
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: ${({ displayText }) => (displayText ? -100 : 0)}px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.background.secondary};
  padding: ${Padding.input}px;
  padding-left: ${Padding.inputLeft}px;
  border-radius: ${BorderRadius.xlarge}px;
  border-color: ${Colors.border.light};
  width: 90%;
`;

const ChatInput = styled.TextInput`
  border-width: 1px;
  border-color: transparent;
  background-color: ${Colors.background.secondary};
  color: ${Colors.text.primary};
  width: 90%;
  height: ${Dimensions.inputHeight}px;
`;
