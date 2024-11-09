import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Content, Title } from '../../tamagui.config';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from './components/Card';
import ActionButton from './components/ActionButton';
import BottomTabNavigation from './components/BottomTabNavigation';
import RecordSection from './components/RecordSection'; // Import the RecordSection component
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import { Routes } from '../../routes/routes';
import { RouteParams } from '../../routes/types';
import ScanSection from './components/ScanSection';

type RoutePropType = StackNavigationProp<RouteParams, Routes.Home>;

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedBottomTab, setSelectedBottomTab] = useState('Home');
  const [selectedAction, setSelectedAction] = useState('Write');
  const [textInputValue, setTextInputValue] = useState('');
  const [languages, setLanguages] = useState({ top: 'English', bottom: 'French' });
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

  const handleLanguageSwitch = () => {
    setLanguages((prev) => ({
      top: prev.bottom,
      bottom: prev.top,
    }));
  };

  return (
    <Container>
      <Title style={{ textAlign: 'center', fontSize: 32, marginTop: '15%' }}>RushTranslate</Title>
      <Content contentContainerStyle={{ flexGrow: 1, paddingBottom: '7%', paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Main Content Area */}
        <View style={{ gap: 16, width: '100%', alignItems: 'center' }}>
          {selectedAction === 'Write' ? (
            <>
              <Card title={languages.top} textInputValue={textInputValue} setTextInputValue={setTextInputValue} />
              
              {/* Language Switch Icon */}
              <TouchableOpacity onPress={handleLanguageSwitch} style={{ marginVertical: 16 }}>
                <Icon name="swap-vertical" size={30} color="#007F7F" />
              </TouchableOpacity>
              
              <Card title={languages.bottom} textInputValue={textInputValue} setTextInputValue={setTextInputValue} />
            </>
          ) : selectedAction === 'Record' ? (
            <RecordSection onTextGenerated={(text) => setTextInputValue(text)} /> 
          ) : (
            <ScanSection
              languages={languages}
              handleLanguageSwitch={handleLanguageSwitch}
            />
          )}

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 }}>
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

        {/* Bottom Tab Navigation */}
        <BottomTabNavigation selectedTab={selectedBottomTab} onTabPress={handleBottomTabPress} />
      </Content>
    </Container>
  );
};

export default HomeScreen;
