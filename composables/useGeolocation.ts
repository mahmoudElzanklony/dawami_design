import { ref, reactive } from 'vue';

export function useGeolocation() {
  const location = reactive({
    latitude: null as unknown,
    longitude: null as unknown,
    accuracy: null as unknown,
    error: null as unknown,
    loading: null as unknown
  });


  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = "المتصفح لا يدعم تحديد الموقع";
        location.error = error;
        reject(error);
        return;
      }

      location.loading = true;
      location.error = null;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.latitude = position.coords.latitude;
          location.longitude = position.coords.longitude;
          location.loading = false;
          resolve(location);
        },
        (error) => {
          let errorMessage = "خطأ في تحديد الموقع";
          
          // Provide more descriptive error messages
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "تم رفض إذن الوصول للموقع، يرجى تفعيله من إعدادات المتصفح";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "معلومات الموقع غير متوفرة حاليا";
              break;
            case error.TIMEOUT:
              errorMessage = "انتهت مهلة طلب تحديد الموقع";
              break;
          }
          location.error = errorMessage;
          location.loading = false;
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,  // Request high accuracy (Wi-Fi + GPS)
          timeout: 10000,            // Increased timeout to 15 seconds
          maximumAge: 0              // Don't use cached location
        }
      );
    });
  };

  const formatLocation = () => {
    if (location.latitude && location.longitude) {
      return `${Number(location.latitude).toFixed(7)}, ${Number(location.longitude).toFixed(7)}`;
    }
    return '';
  };

  const getLocationObject = () => {
    if (location.latitude && location.longitude) {
      return {
        lat: location.latitude,
        lang: location.longitude,
      };
    }
    return null;
  };

  return {
    location,
    getCurrentPosition,
    formatLocation,
    getLocationObject
  };
}
