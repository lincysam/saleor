import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saleor.settings')
django.setup()

from django_tenants.utils import schema_context
from saleor.plugins.models import PluginConfiguration
from saleor.channel.models import Channel

def check_plugin_with_channel():
    print("🔍 Checking plugin configuration with channel...")
    
    with schema_context("vendor3"):
        # Check all plugin configurations
        plugins = PluginConfiguration.objects.all()
        print(f"📋 Total plugin configurations: {plugins.count()}")
        
        for plugin in plugins:
            channel_name = plugin.channel.name if plugin.channel else "GLOBAL"
            print(f"  - {plugin.identifier} (Channel: {channel_name}) - Active: {plugin.active}")
        
        # Check specific channel
        channel = Channel.objects.filter(slug="ind_retail").first()
        if channel:
            print(f"\n🔍 Checking plugin for channel 'ind_retail':")
            plugin_for_channel = PluginConfiguration.objects.filter(
                identifier='mirumee.notifications.user_email',
                channel=channel
            ).first()
            
            if plugin_for_channel:
                print("✅ UserEmail plugin found for channel 'ind_retail'!")
                config_dict = {item['name']: item['value'] for item in plugin_for_channel.configuration}
                print(f"   sender_address: '{config_dict.get('sender_address')}'")
                print(f"   sender_name: '{config_dict.get('sender_name')}'")
            else:
                print("❌ UserEmail plugin NOT found for channel 'ind_retail'")
        else:
            print("❌ Channel 'ind_retail' not found")

if __name__ == "__main__":
    check_plugin_with_channel()