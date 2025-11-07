import { AutoScrollView } from "@/components/ui/AutoScrollView";
import { Collapsible } from "@/components/ui/Collapsible";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { Colors } from "@/constants/colors";
import { useServices } from "@/domain/core/service.provider";
import { useObservable } from "micro-observables";
import { useRef } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function HomeScreen() {
  const { streamService } = useServices();
  const messageContent = useObservable(streamService.messageContent);
  const lastDate = useRef(new Date());
  if (__DEV__) {
    console.log(
      "execTime",
      new Date().getTime() - lastDate.current.getTime(),
      "ms"
    );
    lastDate.current = new Date();
  }

  if (messageContent.length === 0) {
    return (
      <SafeAreaContainer edges={["top"]}>
        <KeyboardAvoidingContainer
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <Header />
          <Input />
        </KeyboardAvoidingContainer>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer edges={["top"]}>
      <KeyboardAvoidingContainer
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <AutoScrollView dependencies={[messageContent]}>
          {messageContent.map((item) =>
            item.type === "TEXT" ? (
              <Markdown key={item.id}>{item.content}</Markdown>
            ) : (
              <Collapsible key={item.id} {...item} />
            )
          )}
        </AutoScrollView>
        <Footer />
      </KeyboardAvoidingContainer>
    </SafeAreaContainer>
  );
}

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Colors.background.primary};
`;

const KeyboardAvoidingContainer = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: ${Colors.background.primary};
`;
