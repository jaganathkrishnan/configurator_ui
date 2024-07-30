export const encryptString = (string) => {
  return btoa(string);
}

export const decryptString = (string) => {
  return atob(string);
}

export const validImageExtensionCheck = (fileObj) => {
  const extension = fileObj.name.split(".").pop();
  const validExtensions = ["png", "jpg", "jpeg"];
  return validExtensions.includes(extension)
}

export const validImageFileSize = (fileObj, limitInMB) => {
  const size = (fileObj.size) / (1024 * 1024)
  return size <= limitInMB
}

export const logoutSession = () => {
  //TO-DO: Hit backend to delete token
  localStorage.removeItem(encryptString("aptx-configurator-session-token"));
  window.location.href = '/';
}

export const refreshPage = () => {
  window.location.reload()
}
