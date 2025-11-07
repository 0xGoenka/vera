import { Colors } from "@/constants/colors";
import { BorderRadius, Dimensions, Margin, Padding } from "@/constants/spacing";
import { useServices } from "@/domain/core/service.provider";
import type {
  ContentType,
  DataType,
} from "@/domain/services/stream/stream.type";
import Feather from "@expo/vector-icons/Feather";
import Markdown from "react-native-markdown-display";
import styled from "styled-components/native";

export const Collapsible = (data: DataType) => {
  const { streamService } = useServices();
  return (
    <Container>
      <TitleButton
        onPress={() => streamService.setCollapsibleContent(data.id)}
        accessibilityLabel={`Toggle ${getTitle(data.type)} section`}
        accessibilityRole="button"
      >
        <TitleContainer>
          <Title>{getTitle(data.type)}</Title>
          <IconWrapper>
            <Feather
              name={data.collapsed ? "chevron-down" : "chevron-up"}
              size={Dimensions.iconSize}
              color={Colors.icon.primary}
            />
          </IconWrapper>
        </TitleContainer>
      </TitleButton>
      {data.collapsed && (
        <ContentContainer>
          <Markdown>{data.content}</Markdown>
        </ContentContainer>
      )}
    </Container>
  );
};

function getTitle(type: ContentType) {
  switch (type) {
    case "<guideline>":
      return "Guideline";
    case "<drug>":
      return "Drug information";
    case "<think>":
      return "Thinking";
    default:
      return "Unknown";
  }
}

const Container = styled.View`
  background-color: ${Colors.background.primary};
  border-radius: ${BorderRadius.xlarge}px;
  margin: ${Margin.collapsible}px ${Margin.collapsibleHorizontal}px;
  overflow: hidden;
  border-width: 4px;
  border-color: ${Colors.border.medium};
`;

const TitleButton = styled.TouchableOpacity`
  width: 100%;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${Colors.background.secondary};
  padding: ${Padding.collapsible}px ${Padding.collapsibleHorizontal}px;
  min-height: ${Dimensions.headerHeight}px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${Colors.text.primary};
  flex: 1;
`;

const IconWrapper = styled.View`
  width: ${Dimensions.iconContainer}px;
  height: ${Dimensions.iconContainer}px;
  border-radius: ${Dimensions.iconContainer / 2}px;
  background-color: ${Colors.icon.secondary};
  justify-content: center;
  align-items: center;
  margin-left: ${Margin.text}px;
`;

const ContentContainer = styled.View`
  padding: ${Padding.content}px ${Padding.contentHorizontal}px;
  background-color: ${Colors.background.primary};
`;
