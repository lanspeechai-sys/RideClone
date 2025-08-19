export interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let message = "Unable to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }
        
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

export const checkLocationPermission = (): Promise<'granted' | 'denied' | 'prompt'> => {
  return new Promise((resolve) => {
    if (!navigator.permissions) {
      resolve('prompt');
      return;
    }

    navigator.permissions.query({ name: 'geolocation' })
      .then((permission) => {
        resolve(permission.state);
      })
      .catch(() => {
        resolve('prompt');
      });
  });
};
