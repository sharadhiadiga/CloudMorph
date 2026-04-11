provider "google" {
  project = "{{PROJECT_ID}}"
  region  = "{{REGION}}"
}

resource "google_cloud_run_service" "app" {
  name     = "{{APP_NAME}}"
  location = "{{REGION}}"

  template {
    spec {
      containers {
        image = "{{IMAGE_URL}}"
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
  location = "{{REGION}}"
  role     = "roles/run.invoker"
  member   = "allUsers"
}