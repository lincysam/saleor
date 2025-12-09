from django.core.management.base import BaseCommand
from tenants.models import Tenant, Domain
from django_tenants.utils import schema_context


class Command(BaseCommand):
    help = "Create a new tenant (schema + domain) for Saleor with default setup."

    def add_arguments(self, parser):
        parser.add_argument("schema_name", type=str, help="Schema name (e.g. tenant1)")
        parser.add_argument("host", type=str, help="Domain (e.g. tenant1.localhost)")
        parser.add_argument("name", type=str, help="Display name for the tenant")

    def handle(self, *args, **options):
        schema_name = options["schema_name"]
        domain_url = options["host"]
        name = options["name"]

        # ✅ Step 1: Create tenant and domain
        tenant = Tenant(schema_name=schema_name, name=name)
        tenant.save()

        domain = Domain(domain=domain_url, tenant=tenant, is_primary=True)
        domain.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Tenant '{name}' created with schema '{schema_name}' and domain '{domain_url}'"
            )
        )

        # ✅ Step 2: Setup default Saleor data within tenant schema
        with schema_context(schema_name):
            # 🏬 Default Channel
            from saleor.channel.models import Channel
            if not Channel.objects.filter(slug="default-channel").exists():
                Channel.objects.create(
                    slug="default-channel",
                    name="Default Channel",
                    currency_code="INR",
                    is_active=True,
                )
                self.stdout.write(self.style.SUCCESS("✅ Created default channel"))

            # 🏢 Default Warehouse (requires address)
            from saleor.warehouse.models import Warehouse
            from saleor.account.models import Address

            if not Warehouse.objects.exists():
                address = Address.objects.create(
                    first_name="Warehouse",
                    last_name="Admin",
                    street_address_1="123 Demo Street",
                    city="DemoCity",
                    postal_code="12345",
                    country="US",  # ISO 3166-1 alpha-2 code (e.g. "IN", "US")
                )

                Warehouse.objects.create(
                    name="Main Warehouse",
                    slug="main-warehouse",
                    address=address,
                )
                self.stdout.write(self.style.SUCCESS("✅ Created default warehouse"))

            # 🛒 Default Product Type
            from saleor.product.models import ProductType
            if not ProductType.objects.exists():
                ProductType.objects.create(
                    name="Default Product Type",
                    slug="default-product-type",
                    has_variants=False,
                    is_shipping_required=True,
                )
                self.stdout.write(self.style.SUCCESS("✅ Created product type"))

            # 🧭 Default Category
            from saleor.product.models import Category
            if not Category.objects.exists():
                Category.objects.create(
                    name="Default Category",
                    slug="default-category",
                )
                self.stdout.write(self.style.SUCCESS("✅ Created category"))

            # 👤 Default Admin User
            from saleor.account.models import User
            # Create superuser
            if not User.objects.filter(email="admin@localhost").exists():
                 User.objects.create_superuser( email="admin@localhost", password="admin1234" ) 
                 self.stdout.write( self.style.SUCCESS("✅ Created admin user (admin@localhost / admin1234)") )

            from django.contrib.sites.models import Site
            from saleor.site.models import SiteSettings

            site, _ = Site.objects.get_or_create(id=1)
            site.domain = f"{domain_url}:8000"
            site.name = schema_name
            site.save()

            SiteSettings.objects.get_or_create(site=site)

            self.stdout.write(
                self.style.SUCCESS(f"✅ Configured Site + SiteSettings for '{schema_name}'")
            )

        self.stdout.write(
            self.style.SUCCESS(f"🎉 Tenant '{name}' successfully initialized and ready!")
        )
