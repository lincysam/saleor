
from django.core.management.base import BaseCommand
from django.contrib.contenttypes.models import ContentType
from django_tenants.utils import  schema_context
from tenants.models import Tenant
from saleor.permission.models import Permission as SaleorPermission
from saleor.permission.enums import get_permissions_enum_list
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Grant all Saleor permissions to each tenant's superuser"

    def handle(self, *args, **options):
       
        User = get_user_model()

        for tenant in Tenant.objects.all():
            self.stdout.write(self.style.NOTICE(f"Processing tenant: {tenant.schema_name}"))
            with schema_context(tenant.schema_name):
                superuser = User.objects.filter(is_superuser=True).first()
                if not superuser:
                    self.stdout.write(self.style.WARNING(f"No superuser found in {tenant.schema_name}. Skipping..."))
                    continue

                for name, value in get_permissions_enum_list():
                    app_label, codename = value.split(".")
                    model = "user"  # could be any, we just need a valid ContentType

                    content_type, _ = ContentType.objects.get_or_create(
                        app_label=app_label,
                        model=model,
                    )

                    perm, _ = SaleorPermission.objects.get_or_create(
                        codename=codename,
                        content_type=content_type,
                        defaults={"name": name},
                    )

                    superuser.user_permissions.add(perm)

                superuser.save()
                self.stdout.write(self.style.SUCCESS(f"✅ All permissions granted to superuser in {tenant.schema_name}."))
