import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saleor.settings')
django.setup()

from django_tenants.utils import schema_context
from saleor.plugins.manager import get_plugins_manager
from saleor.plugins.email_common import send_email

def test_email_sending():
    print("🧪 Testing email sending after complete fix...")
    
    with schema_context("vendor3"):
        manager = get_plugins_manager(allow_replica=False)
        plugin = manager.get_plugin('mirumee.notifications.user_email', channel_slug="ind_retail")
        
        if plugin:
            print("✅ Plugin found, testing email sending...")
            
            try:
                send_email(
                    config=plugin.config,
                    recipient_list=["test@yopmail.com"],
                    context={"site_name": "Saleor", "user": {"email": "test@yopmail.com"}},
                    subject="Test Email - Plugin Fixed",
                    template_str="<p>This is a test email to verify the plugin is working correctly.</p>"
                )
                print("✅ Email sent successfully! Check Mailpit at http://localhost:8025")
            except Exception as e:
                print(f"❌ Email sending failed: {e}")
                import traceback
                traceback.print_exc()
        else:
            print("❌ Plugin not found")

if __name__ == "__main__":
    test_email_sending()