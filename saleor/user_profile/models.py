from django.db import models
from django.conf import settings
from saleor.channel.models import Channel
from phonenumber_field.modelfields import PhoneNumber, PhoneNumberField
from saleor.account.validators import validate_possible_number


class PossiblePhoneNumberField(PhoneNumberField):
    """Less strict field for phone numbers written to database."""

    default_validators = [validate_possible_number]

class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    mobile = PossiblePhoneNumberField(blank=True, null=True, db_index=True, default="")
    channels = models.ManyToManyField(
        Channel,
        blank=True,
        related_name="user_profiles",
        help_text="Channels this user has access to.",
    )
    
    def __str__(self):
        return f"{self.user.email} - {self.mobile or 'No mobile'}"
