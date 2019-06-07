export const getObject = (key: string): any => {
  try {
    return JSON.parse(window.localStorage[key]);
  } catch (e) {
    return {};
  }
}

export const setObject = (key: string, value: any): any => {
  try {
    return window.localStorage[key] = JSON.stringify(value);
  } catch (e) {
    return;
  }
}