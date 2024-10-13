# RushTranslate App

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Running the App](#running-the-app)
- [Deployment](#deployment)

## Overview

RushTranslate is a mobile application that provides emergency offline translations when you don't have an internet connection. Built using [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) and [Tamagui](https://tamagui.dev/) for UI components, it ensures quick and reliable translations of critical sentences in various languages.

## Features

- **Responsive UI**: Utilizing Tamagui for a consistent and responsive design.
- **Multi-language Support**: Integrated with language providers for dynamic translations.
- **Push Notifications**: Handling push notifications with Expo.
- **Social Authentication**: Implemented authentication with email and Google sign-in.

## Project Structure

Modify here
```plaintext
client/
│
├── App.tsx             # Main entry point for the React Native app
├── assets/             # Static assets like images 
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── src/                # Source files for components and screens
│   ├── components/     # Reusable UI components
│   ├── screens/        # Application screens
└── README.md           # Project documentation (this file)
```

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** installed on your machine. You can download it from [nodejs.org](https://nodejs.org).

- **Yarn** (package manager) installed. You can install it from [yarnpkg.com](https://yarnpkg.com).

- **Expo CLI** installed globally. You can install it via npm with:

    ```bash
    npm install -g expo-cli
    ```

## Installation

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/cosmin-oros/RushTranslate.git
    ```

2. Navigate to the project directory:

    ```bash
    cd client
    ```

3. Install the dependencies:

    ```bash
    yarn install
    ```

## Usage

### Running the App

To start the Expo server and run the app on a simulator or physical device, use the following command:

```bash
yarn start
yarn android
yarn ios
```

## Deployment

For deployment, you can use Expo's build service to create production-ready builds of your app. You might also deploy the web version using [Vercel](https://vercel.com/) or another hosting service if applicable. Follow these steps:

1. **Build the app**:

    To create production-ready builds for Android and iOS, use the following commands:

    ```bash
    expo build:android
    expo build:ios
    ```
    Or use EAS to build

    Follow Expo's [build documentation](https://docs.expo.dev/build/introduction/) for detailed instructions on building your app.

2. **Deploy the app**:

    - For Android and iOS, follow Expo's [build documentation](https://docs.expo.dev/build/introduction/) to manage and distribute your builds.
    


