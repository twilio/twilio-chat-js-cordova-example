const PhoneGapPushReParser = {
  getRawPushForFCM: function(data) {
   var rawData = {
     data: data.additionalData
   };
   if (data.message) {
     rawData.data.twi_body = data.message;
   }
    if (data.title) {
      rawData.data.twi_title = data.title;
    }
    if (data.sound) {
      rawData.data.twi_sound = data.sound;
    }
    return rawData;
  },

  getRawPushForAPN: function(data) {
    var rawData = data.additionalData;

    if (!rawData.aps) {
      rawData.aps = {};
    }
    if (!rawData.aps.alert) {
      rawData.aps.alert = {};
    }

    if (data.message) {
      rawData.aps.alert.body = data.message;
    }
    if (data.title) {
      rawData.aps.alert.title = data.title;
    }
    if (data.sound) {
      rawData.aps.sound = data.sound;
    }
    if (data.count) {
      rawData.aps.badge = data.count;
    }
    if (data.image) {
      rawData.aps.image= data.image;
    }

    return rawData;
  }
};
