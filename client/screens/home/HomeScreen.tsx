import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Content, CenteredView, Title } from '../../tamagui.config';
import { View, Text } from '@tamagui/core';
import Card from './components/Card';
import ActionButton from './components/ActionButton';
import BottomTabNavigation from './components/BottomTabNavigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import { Routes } from '../../routes/routes';
import { RouteParams } from '../../routes/types';

type RoutePropType = StackNavigationProp<RouteParams, Routes.Home>;

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedBottomTab, setSelectedBottomTab] = useState('Home');
  const [selectedAction, setSelectedAction] = useState('Write'); 
  const navigation = useNavigation<RoutePropType>();

  const handleBottomTabPress = (tab: string) => {
    setSelectedBottomTab(tab);
    switch (tab) {
      case 'Home':
        navigation.navigate(Routes.Home);
        break;
      case 'Saved':
        navigation.navigate(Routes.Saved);
        break;
      case 'Settings':
        navigation.navigate(Routes.Settings);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setSelectedBottomTab('Home');
  }, []);

  const handleActionPress = (action: string) => {
    setSelectedAction(action);
  };

  return (
    <Container>
      <Content contentContainerStyle={{ flexGrow: 1 }}>
        <CenteredView>
          <Title>RushTranslate</Title>

          {/* Main Content Area */}
          <View style={{ padding: 16, gap: 16, width: '100%' }}>
            <Card title="Text" subtitle="Text" />
            <Card title="Text" subtitle="Text" />

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 16, marginVertical: 16, width: '100%' }}>
              <ActionButton
                label="Write"
                isSelected={selectedAction === 'Write'}
                onPress={() => handleActionPress('Write')}
              />
              <ActionButton
                label="Record"
                isSelected={selectedAction === 'Record'}
                onPress={() => handleActionPress('Record')}
              />
              <ActionButton
                label="Scan"
                isSelected={selectedAction === 'Scan'}
                onPress={() => handleActionPress('Scan')}
              />
            </View>
          </View>
        </CenteredView>

        {/* Bottom Tab Navigation */}
        <BottomTabNavigation selectedTab={selectedBottomTab} onTabPress={handleBottomTabPress} />
      </Content>
    </Container>
  );
};

export default HomeScreen;
