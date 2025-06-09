import { useI18n } from '#imports';

export const useDistanceCalculation = () => {
  const { t } = useI18n();

  // Calculate distance between two geographic coordinates using Haversine formula
  const calculateDistanceBetweenCoordinates = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return parseFloat(distance.toFixed(2));
  }

  // Calculate distance between recorded location and place location
  const calculateDistance = (item: any) => {
    try {
      // Get recorded location
      let recordedLat, recordedLng;
  
      if (item.tracking && item.tracking.length > 0) {
        const trackingLocation = JSON.parse(item.tracking[0].location);
        recordedLat = parseFloat(trackingLocation.latitude);
        recordedLng = parseFloat(trackingLocation.longitude);
      } else if (item.end_shift) {
        const endShiftLocation = JSON.parse(item.end_shift.location);
        recordedLat = parseFloat(endShiftLocation.latitude);
        recordedLng = parseFloat(endShiftLocation.longitude);
      } else if (item.location) {
        if (typeof item.location === 'string') {
          // Handle string format like "{latitude:30.5794203,longitude:31.5233023}"
          const locationObj = JSON.parse(item.location.replace(/([{,])\s*([a-zA-Z0-9_]+):/g, '$1"$2":'));
          recordedLat = parseFloat(locationObj.latitude);
          recordedLng = parseFloat(locationObj.longitude);
        } else {
          recordedLat = parseFloat(item.location.latitude);
          recordedLng = parseFloat(item.location.longitude);
        }
      } else {
        return '-';
      }
  
      // Get place location and calculate distance based on type
      if (item.attendance_place && item.attendance_place.location) {
        const placeLocation = item.attendance_place.location;
        const placeType = item.attendance_place.type;
  
        // Check if coordinates exist
        if (!placeLocation.coordinates || !placeLocation.coordinates.length) {
          return '-';
        }
  
        // Handle different location types
        if (placeType === 'gps' || placeType === 'maps') {
          // For GPS or maps locations, get the center coordinate
          const center = placeLocation.coordinates[0];
          const placeLat = parseFloat(center.latitude);
          const placeLng = parseFloat(center.longitude);
  
          // Calculate distance to center
          const distance = calculateDistanceBetweenCoordinates(recordedLat, recordedLng, placeLat, placeLng);
  
          // If area is defined (radius in meters), subtract it from the distance
          // to show how far outside the area the person is (or 0 if inside)
          if (placeLocation.area) {
            const areaRadius = parseFloat(placeLocation.area) / 1000; // Convert meters to km
            return Math.max(0, distance - areaRadius).toFixed(2);
          }
  
          return distance;
        }
        else if (placeType === 'polygon') {
          // For polygon, find the minimum distance to any point in the polygon
          // This is a simplified approach - ideally we'd calculate distance to the polygon itself
          let minDistance = Number.MAX_VALUE;
  
          for (const coordinate of placeLocation.coordinates) {
            const placeLat = parseFloat(coordinate.latitude);
            const placeLng = parseFloat(coordinate.longitude);
            const distance = calculateDistanceBetweenCoordinates(recordedLat, recordedLng, placeLat, placeLng);
            minDistance = Math.min(minDistance, distance);
          }
  
          return minDistance === Number.MAX_VALUE ? '-' : minDistance;
        }
        else {
          // Default case - just use the first coordinate
          const coordinate = placeLocation.coordinates[0];
          const placeLat = parseFloat(coordinate.latitude);
          const placeLng = parseFloat(coordinate.longitude);
          return calculateDistanceBetweenCoordinates(recordedLat, recordedLng, placeLat, placeLng);
        }
      }
  
      return '-';
    } catch (error) {
      console.error('Error calculating distance:', error);
      return '-';
    }
  }

  // Format distance to show in meters if less than 1km
  const formatDistance = (distance: any) => {
    if (distance === '-') return '-';
  
    const distanceNum = parseFloat(distance);
    
    // If exactly 0, person is inside the area
    if (distanceNum === 0) {
      return t('attendance.distance.inside_area');
    }
    
    if (distanceNum < 1) {
      // Convert to meters and round to nearest meter
      const meters = Math.round(distanceNum * 1000);
      return `${meters} ${t('attendance.distance.meter')}`;
    }
  
    return `${distance} ${t('attendance.distance.km')}`;
  }

  // Get distance color based on the value
  const getDistanceColor = (distance: any) => {
    if (distance === '-') return 'info';
  
    const distanceNum = parseFloat(distance);
    if (distanceNum === 0) return 'success'; // Inside the area
    if (distanceNum < 0.1) return 'success'; // Less than 100 meters
    if (distanceNum < 0.5) return 'warning'; // Less than 500 meters
    return 'error'; // Greater than 500 meters
  };

  return {
    calculateDistanceBetweenCoordinates,
    calculateDistance,
    formatDistance,
    getDistanceColor
  };
};
