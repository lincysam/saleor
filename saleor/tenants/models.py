
from django.db import models
from django_tenants.models import TenantMixin, DomainMixin


class Tenant(TenantMixin):
    name = models.CharField(max_length=100)
    created_on = models.DateField(auto_now_add=True)

    auto_create_schema = True  # Important to auto-create schema on save

    def __str__(self):
        return self.name


class Domain(DomainMixin):
    pass
