provider "google" {
  project = "cloud-hackathon-493005"
  region  = "asia-south1"
}

resource "google_cloud_run_service" "app" {
  name     = "test-app"
  location = "asia-south1"

  template {
    spec {
      containers {
        image = "gcr.io/cloud-hackathon-493005/test-app"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_member" "invoker" {
  service  = google_cloud_run_service.app.name
  location = "asia-south1"
  role     = "roles/run.invoker"
  member   = "allUsers"
}