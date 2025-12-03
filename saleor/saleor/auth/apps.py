from django.apps import AppConfig

class AuthConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "saleor.auth"       # 👈 full import path
    label = "saleor_auth"      # 👈 unique Django label
