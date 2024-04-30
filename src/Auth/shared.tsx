import { colors } from "shared/theme";
import styled from "styled-components";

export const H2 = styled.h2`
  color: ${colors.blueish};
  font-size: 1.5rem;
  padding: 20px 0;
`;

export const FormElements = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 20px;
`;

export const FormElement = styled.div`
  display: flex;
  gap: 10px;
`;

export const Link = styled.div`
  font-size: 12px;
  color: ${colors.blueish};
  cursor: pointer;
`;

export const LinkContainer = styled.div`
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Container = styled.div`
  display: flex;
  padding: 20px;
  height: 100vh;
`;

export const TitleContainer = styled.div`
  display: flex;
  padding-bottom: 20px;
`;
