import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Content, CenteredView, StyledButton, Title } from '../../tamagui.config';
import { View, Text } from '@tamagui/core';
import Card from './components/Card';
import ActionButton from './components/ActionButton';
import BottomTabButton from './components/BottomTabButton';

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Content contentContainerStyle={{ flexGrow: 1 }}>
        <CenteredView>
          <Title>RushTranslate</Title>

          {/* Main Content Area */}
          <View style={{ padding: 16, flexDirection: 'column', gap: 16 }}>
            <Card title="Text" subtitle="Text" />
            <Card title="Text" subtitle="Text" />
            
            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 }}>
              <ActionButton label="Write" />
              <ActionButton label="Record" />
              <ActionButton label="Scan" />
            </View>
          </View>
        </CenteredView>

        {/* Bottom Tab Navigation */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, backgroundColor: '#EAEAEA' }}>
          <BottomTabButton label="Home" />
          <BottomTabButton label="Saved" />
          <BottomTabButton label="Settings" />
        </View>
      </Content>
    </Container>
  );
};

export default HomeScreen;
