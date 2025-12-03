import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saleor.settings')
django.setup()

from django_tenants.utils import schema_context
from saleor.plugins.models import PluginConfiguration

def setup_user_email_plugin_simple():
    print("🔧 Setting up UserEmail plugin in vendor3 schema (simplified)...")
    
    with schema_context("vendor3"):
        try:
            # Basic configuration for Mailpit - using the essential fields from test fixture
            configuration = [
                {"name": "host", "value": "127.0.0.1"},
                {"name": "port", "value": "1025"},
                {"name": "username", "value": ""},
                {"name": "password", "value": ""},
                {"name": "sender_name", "value": "Saleor"},
                {"name": "sender_address", "value": "admin@example.com"},  # Critical: valid email
                {"name": "use_tls", "value": "false"},
                {"name": "use_ssl", "value": "false"},
                # Essential template fields for account registration
                {"name": "account_confirmation_template", "value": "confirm.html"},
                {"name": "account_confirmation_subject", "value": "Account confirmation e-mail"},
                {"name": "account_password_reset_template", "value": "password_reset.html"},
                {"name": "account_password_reset_subject", "value": "Password reset e-mail"},
                {"name": "account_set_customer_password_template", "value": "set_customer_password.html"},
                {"name": "account_set_customer_password_subject", "value": "Hello from {{ site_name }}!"},
            ]
            
            plugin, created = PluginConfiguration.objects.update_or_create(
                identifier='mirumee.notifications.user_email',
                defaults={
                    'name': 'User emails',
                    'description': 'Plugin for sending user emails',
                    'active': True,
                    'configuration': configuration
                }
            )
            
            if created:
                print("✅ Plugin created successfully in vendor3 schema!")
            else:
                print("✅ Plugin updated successfully in vendor3 schema!")
                
            # Verify the configuration
            print("📋 Current configuration:")
            for config_item in plugin.configuration:
                if config_item['name'] in ['sender_address', 'sender_name', 'host', 'port']:
                    print(f"  {config_item['name']}: {config_item['value']}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    setup_user_email_plugin_simple()