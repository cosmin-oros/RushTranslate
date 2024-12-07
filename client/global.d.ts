declare module "react-native-text-detector" {
  const detectFromUri: (
    uri: string
  ) => Promise<Array<{ text: string; bounding: number[] }>>;
  export default { detectFromUri };
}
