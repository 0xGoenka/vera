import { Colors } from "@/constants/colors";
import { Margin, Padding } from "@/constants/spacing";
import { useServices } from "@/domain/core/service.provider";
import { SearchStep } from "@/domain/services/stream/stream.type";
import { useObservable } from "micro-observables";
import styled from "styled-components/native";
import { ProgressBar } from "./ProgressBar";

export const Header = () => {
  const { streamService } = useServices();
  const searchSteps = useObservable(streamService.searchSteps);
  //@TODO didn't get exactly what should I do with this
  //const searchProgress = useObservable(streamService.searchProgress);

  const currentStepInfo = getCurrentStepInfo(searchSteps);

  return (
    <HeaderContainer>
      <HeaderText>{currentStepInfo.currentStepText}</HeaderText>
      <ProgressBar searchSteps={searchSteps} />
    </HeaderContainer>
  );
};

const getCurrentStepInfo = (searchSteps: SearchStep[]) => {
  const currentStepText = searchSteps.find((step) => step.isActive)?.text;

  return {
    currentStepText,
  };
};

const HeaderContainer = styled.View`
  background-color: ${Colors.background.primary};
  padding: ${Padding.header}px ${Padding.headerHorizontal}px;
`;

const HeaderText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${Colors.text.primary};
  margin-bottom: ${Margin.text}px;
`;
