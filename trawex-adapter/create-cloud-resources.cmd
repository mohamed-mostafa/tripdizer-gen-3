gcloud pubsub topics create hotel-booking-topic
gcloud pubsub subscriptions create hotel-booking-subscription --topic hotel-booking-topic --expiration-period=never
  
gcloud pubsub topics create flight-booking-topic
gcloud pubsub subscriptions create flight-booking-subscription --topic flight-booking-topic --expiration-period=never

gcloud pubsub topics create hotel-booking-confirmation-topic
gcloud pubsub subscriptions create hotel-booking-confirmation-subscription --topic hotel-booking-confirmation-topic --expiration-period=never
  
gcloud pubsub topics create flight-booking-confirmation-topic
gcloud pubsub subscriptions create flight-booking-confirmation-subscription --topic flight-booking-confirmation-topic --expiration-period=never

gcloud pubsub topics create hotel-booking-error-topic
gcloud pubsub subscriptions create hotel-booking-error-subscription --topic hotel-booking-error-topic --expiration-period=never
  
gcloud pubsub topics create flight-booking-error-topic
gcloud pubsub subscriptions create flight-booking-error-subscription --topic flight-booking-error-topic --expiration-period=never



gcloud compute firewall-rules create trawex-adapter-firewall --action allow --target-tags trawex-adapter --source-ranges 0.0.0.0/0 --rules tcp:8085 --enable-logging
gcloud compute firewall-rules create trawex-proxy-firewall --action allow --target-tags trawex-proxy --source-ranges 0.0.0.0/0 --rules tcp:3128 --enable-logging

gcloud beta compute --project=tripdizer-dev instances create-with-container trawex-adapter-instance --zone=europe-west2-a --machine-type=n1-standard-2 --subnet=default --network-tier=PREMIUM --metadata=google-logging-enabled=true --maintenance-policy=MIGRATE --service-account=1004287460562-compute@developer.gserviceaccount.com --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append --tags=trawex-adapter,http-server,https-server --image=cos-stable-78-12499-59-0 --image-project=cos-cloud --boot-disk-size=10GB --boot-disk-type=pd-standard --boot-disk-device-name=trawex-adapter-instance --container-image=gcr.io/tripdizer-dev/trawex-adapter:1bab9b9 --container-restart-policy=always --container-env=PORT=80 --labels=container-vm=cos-stable-78-12499-59-0 --reservation-affinity=any
