
from saleor.plugins.base_plugin import BasePlugin
from django.db import transaction
from django_tenants.utils import schema_context
from user_profile.models import UserProfile
from saleor.channel.models import Channel
from django.core.exceptions import ValidationError
from saleor.account.validators import validate_possible_number
import logging

logger = logging.getLogger(__name__)

class UserProfilePlugin(BasePlugin):
    PLUGIN_ID = "plugin.user_profile_extension"
    PLUGIN_NAME = "User Profile Extension"
    DEFAULT_ACTIVE = True
    CONFIGURATION_PER_CHANNEL = False

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def account_created(self, user, input_data, request=None, **kwargs):
        """
        Custom hook: called after accountRegister mutation.
        Raises exception if profile creation fails to trigger rollback.
        """
        try:
            metadata = self._extract_metadata(input_data)
            mobile = metadata.get("mobile")

            # Gather all channels: input.channel + metadata.channels
            channel_slugs = []
            if 'channel' in input_data and input_data['channel']:
                channel_slugs.append(input_data['channel'])
            channel_slugs += metadata.get("channels", [])

            # Remove duplicates
            channel_slugs = list(set(channel_slugs))

            # Validate mobile number
            if mobile:
                try:
                    validate_possible_number(mobile)
                except ValidationError as e:
                    logger.error(f"Invalid mobile number '{mobile}' for user {user.email}: {e}")
                    raise ValidationError(f"Invalid mobile number: {mobile}") from e

            schema_name = self._get_schema_name(request)

            with schema_context(schema_name), transaction.atomic():
                self._create_or_update_user_profile(user, mobile, channel_slugs)

        except Exception as e:
            logger.error(f"UserProfilePlugin.account_created failed for {user.email}: {e}")
            raise

    def _extract_metadata(self, input_data):
        """Extract metadata with safe dictionary comprehension"""
        if not input_data:
            return {}

        metadata = {}

        try:
            metadata_list = input_data.get("metadata", [])
            metadata.update(
                {
                    item["key"]: item["value"]
                    for item in metadata_list
                    if isinstance(item, dict) and item.get("key") and item.get("value") is not None
                }
            )

            # Ensure 'channels' is always a list
            if "channels" in metadata:
                if isinstance(metadata["channels"], str):
                    # Assume comma-separated string of channels
                    metadata["channels"] = [slug.strip() for slug in metadata["channels"].split(",")]
                elif not isinstance(metadata["channels"], list):
                    metadata["channels"] = [metadata["channels"]]

        except Exception as e:
            logger.warning(f"Error extracting metadata: {e}")

        return metadata

    def _get_schema_name(self, request):
        """Get the current schema name"""
        if request and hasattr(request, 'tenant') and request.tenant:
            return request.tenant.schema_name
        return "public"

    def _create_or_update_user_profile(self, user, mobile, channel_slugs):
        """Create user profile - raises exception on any failure"""
        try:
            if user.pk is None:
                user.save()

            profile, created = UserProfile.objects.get_or_create(user=user)

            if mobile:
                profile.mobile = mobile

            # Add multiple channels
            for slug in channel_slugs:
                try:
                    channel = Channel.objects.get(slug=slug)
                    profile.channels.add(channel)
                except Channel.DoesNotExist:
                    raise ValidationError(f"Channel '{slug}' does not exist")

            profile.save()
            logger.info(f"✅ User profile created for {user.email} with channels {channel_slugs}")

        except Exception as e:
            logger.error(f"Failed to create user profile for {user.email}: {e}")
            raise
