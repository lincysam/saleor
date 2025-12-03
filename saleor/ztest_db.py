import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saleor.settings')
import django
django.setup()

from django_tenants.utils import schema_context
from saleor.plugins.manager import get_plugins_manager
from saleor.plugins.email_common import EmailConfig

with schema_context("vendor3"):
    manager = get_plugins_manager(allow_replica=False)
    plugin = manager.get_plugin('mirumee.notifications.user_email', channel_slug="ind_retail")
    
    if plugin:
        print("🔍 Checking what config is passed to Celery tasks:")
        
        # Check what plugin.config contains (this gets passed to tasks)
        print(f"   plugin.config: {plugin.config}")
        print(f"   plugin.config type: {type(plugin.config)}")
        
        # Check what happens when we convert to dict (like in tasks)
        config_dict = {
            "host": plugin.config.host,
            "port": plugin.config.port,
            "username": plugin.config.username,
            "password": plugin.config.password,
            "sender_name": plugin.config.sender_name,
            "sender_address": plugin.config.sender_address,
            "use_tls": plugin.config.use_tls,
            "use_ssl": plugin.config.use_ssl,
        }
        print(f"   Config dict: {config_dict}")
        
        # Test what EmailConfig gets created with
        test_email_config = EmailConfig(**config_dict)
        print(f"   Test EmailConfig: {test_email_config}")