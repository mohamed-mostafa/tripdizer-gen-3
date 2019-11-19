  gcloud pubsub topics create hotel-booking-topic
  gcloud pubsub subscriptions create hotel-booking-subscription --topic hotel-booking-topic --expiration-period=never
  
  gcloud pubsub topics create flight-booking-topic
  gcloud pubsub subscriptions create flight-booking-subscription --topic flight-booking-topic --expiration-period=never
