## App Screens
<img width="925" height="898" alt="image" src="https://github.com/user-attachments/assets/875704f5-ca92-46fc-a942-c72cbb121cf3" />
<img width="992" height="912" alt="image" src="https://github.com/user-attachments/assets/3c151d09-4ca8-4427-a352-6994b7f0b317" />


## Recommended Node Version:

- 20.19.5

## Running the app

- Install the dependencies:

  ```sh
  npm install
  ```

- Start the development server:

  ```sh
  npm start
  ```

- In separate terminal build and run iOS and Android development builds:

  ```sh
  npm run ios
  # or
  npm run android
  ```

- In the terminal running the development server, press `i` to open the iOS simulator, `a` to open the Android device or emulator, or `w` to open the web browser.

## Template for creation expo app

- react-navigation/template

## Stack 

- React Native + React (Hooks) + TypeScript
- styled-components
- React Query (TanStack Query)
- react-navigation

## Notes

This project uses a [development build](https://docs.expo.dev/develop/development-builds/introduction/) and cannot be run with [Expo Go](https://expo.dev/go). To run the app with Expo Go, edit the `package.json` file, remove the `expo-dev-client` package and `--dev-client` flag from the `start` script.

We highly recommend using the development builds for normal development and testing.

The `ios` and `android` folder are gitignored in the project by default as they are automatically generated during the build process ([Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/)). This means that you should not edit these folders directly and use [config plugins](https://docs.expo.dev/config-plugins/) instead. However, if you need to edit these folders, you can remove them from the `.gitignore` file so that they are tracked by git.

## Resources

- [React Navigation documentation](https://reactnavigation.org/)
- [Expo documentation](https://docs.expo.dev/)
