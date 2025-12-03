
from saleor.plugins.base_plugin import BasePlugin
from saleor.checkout.error_codes import CheckoutErrorCode
from django.core.exceptions import ValidationError
from user_profile.models import UserProfile  # ✅ import your new model


class ChannelRestrictionPlugin(BasePlugin):
    PLUGIN_ID = "custom.channel.restriction"
    PLUGIN_NAME = "Channel Restriction Plugin"
    DEFAULT_ACTIVE = True
    PLUGIN_DESCRIPTION = (
        "Restricts users from creating checkouts or orders in channels "
        "they are not linked to."
    )

    def checkout_created(self, checkout, previous_value, **kwargs):
        """Called after checkout creation."""
        print("✅ Inside create_checkout function")
        user = checkout.user
        channel = checkout.channel

        # Allow guest checkouts
        if not user:
            return previous_value

       
        try:
            profile = user.profile  
        except UserProfile.DoesNotExist:
            
            raise ValidationError(
                {
                    "channel": ValidationError(
                        "You do not have  access in this channel",
                        code=CheckoutErrorCode.INVALID.value,
                    )
                }
            )
        if not profile.channels.filter(id=channel.id).exists():
            raise ValidationError(
                {
                    "channel": ValidationError(
                        f"You are not allowed to create a checkout in channel '{channel.slug}'.",
                        code=CheckoutErrorCode.INVALID.value,
                    )
                }
            )

        return previous_value

