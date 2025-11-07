import { Colors } from "@/constants/colors";
import { Dimensions } from "@/constants/spacing";
import styled from "styled-components/native";
import { Input } from "./Input";

export const Footer = () => {
  return (
    <FooterContainer>
      <Input displayText={false} />
    </FooterContainer>
  );
};

const FooterContainer = styled.View`
  background-color: ${Colors.background.white};
  height: ${Dimensions.footerHeight}px;
`;
