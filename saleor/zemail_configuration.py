import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saleor.settings')
django.setup()

from django_tenants.utils import schema_context
from saleor.plugins.models import PluginConfiguration

def complete_plugin_reset():
    print("🔧 Complete plugin configuration reset...")
    
    with schema_context("vendor3"):
        # Delete existing plugin configuration
        PluginConfiguration.objects.filter(identifier='mirumee.notifications.user_email').delete()
        
        # Create complete configuration with ALL required fields
        configuration = [
            # SMTP Configuration (CRITICAL - these are missing)
            {"name": "host", "value": "127.0.0.1"},
            {"name": "port", "value": "1025"},
            {"name": "username", "value": ""},
            {"name": "password", "value": ""},
            {"name": "sender_name", "value": "Saleor"},
            {"name": "sender_address", "value": "noreply@example.com"},  # MUST NOT BE EMPTY
            {"name": "use_tls", "value": "false"},
            {"name": "use_ssl", "value": "false"},
            
            # Email Templates (you already have these)
            {"name": "account_confirmation_subject", "value": "Account confirmation e-mail"},
            {"name": "account_confirmation", "value": "DEFAULT"},
            {"name": "account_set_customer_password_subject", "value": "Hello from {{ site_name }}!"},
            {"name": "account_set_customer_password", "value": "DEFAULT"},
            {"name": "account_delete_subject", "value": "Delete your account"},
            {"name": "account_delete", "value": "DEFAULT"},
            {"name": "account_change_email_confirm_subject", "value": "Email change e-mail"},
            {"name": "account_change_email_confirm", "value": "DEFAULT"},
            {"name": "account_change_email_request_subject", "value": "Email change e-mail"},
            {"name": "account_change_email_request", "value": "DEFAULT"},
            {"name": "account_password_reset_subject", "value": "Password reset e-mail"},
            {"name": "account_password_reset", "value": "DEFAULT"},
            {"name": "invoice_ready_subject", "value": "Invoice"},
            {"name": "invoice_ready", "value": "DEFAULT"},
            {"name": "order_confirmation_subject", "value": "Order #{{ order.number }} details"},
            {"name": "order_confirmation", "value": "DEFAULT"},
            {"name": "order_confirmed_subject", "value": "Order #{{ order.number }} confirmed"},
            {"name": "order_confirmed", "value": "DEFAULT"},
            {"name": "order_fulfillment_confirmation_subject", "value": "Your order {{ order.number }} has been fulfilled"},
            {"name": "order_fulfillment_confirmation", "value": "DEFAULT"},
            {"name": "order_fulfillment_update_subject", "value": "Shipping update for order {{ order.number }}"},
            {"name": "order_fulfillment_update", "value": "DEFAULT"},
            {"name": "order_payment_confirmation_subject", "value": "Order {{ order.number }} payment details"},
            {"name": "order_payment_confirmation", "value": "DEFAULT"},
            {"name": "order_canceled_subject", "value": "Order {{ order.number }} canceled"},
            {"name": "order_canceled", "value": "DEFAULT"},
            {"name": "order_refund_confirmation_subject", "value": "Order {{ order.number }} refunded"},
            {"name": "order_refund_confirmation", "value": "DEFAULT"},
            {"name": "send_gift_card_subject", "value": "Gift card for {{ site_name }}"},
            {"name": "send_gift_card", "value": "DEFAULT"},
        ]
        
        plugin = PluginConfiguration(
            identifier='mirumee.notifications.user_email',
            name='User emails',
            description='Plugin for sending user emails',
            active=True,
            configuration=configuration
        )
        plugin.save()
        
        print("✅ Plugin completely reset with ALL configuration!")
        
        # Verify the critical fields
        saved_plugin = PluginConfiguration.objects.get(identifier='mirumee.notifications.user_email')
        config_dict = {item['name']: item['value'] for item in saved_plugin.configuration}
        print("📋 Critical configuration verified:")
        print(f"   sender_address: '{config_dict.get('sender_address')}'")
        print(f"   sender_name: '{config_dict.get('sender_name')}'")
        print(f"   host: '{config_dict.get('host')}'")
        print(f"   port: '{config_dict.get('port')}'")

if __name__ == "__main__":
    complete_plugin_reset()