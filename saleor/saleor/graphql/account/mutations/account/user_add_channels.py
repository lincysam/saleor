# from user_profile.models import UserProfile
# from saleor.channel.models import Channel
# from saleor.graphql.account.types import User
# import graphene
# from graphene import Mutation as BaseMutation
# import logging
# from graphql import GraphQLError

# logger = logging.getLogger(__name__)

# # In your GraphQL mutations
# class UserAddChannels(BaseMutation):
#     class Arguments:
#         email = graphene.String(required=True)
#         channels = graphene.List(graphene.NonNull(graphene.String), required=True)

#     success = graphene.Boolean()
#     channels_added = graphene.List(graphene.String)

#     @classmethod
#     def perform_mutation(cls, root, info, email, channels):
#         try:
#             user = User.objects.get(email=email)
            
#             with transaction.atomic():
#                 profile, created = UserProfile.objects.get_or_create(user=user)
#                 channels_added = []
                
#                 for channel_slug in channels:
#                     try:
#                         channel = Channel.objects.get(slug=channel_slug)
#                         # Use add() - this won't duplicate if already exists
#                         profile.channels.add(channel)
#                         channels_added.append(channel_slug)
#                         logger.info(f"✅ Added channel {channel_slug} to user {email}")
#                     except Channel.DoesNotExist:
#                         logger.warning(f"⚠️ Channel {channel_slug} not found")
                
#                 profile.save()
#                 return UserAddChannels(
#                     success=True, 
#                     channels_added=channels_added
#                 )
                
#         except User.DoesNotExist:
#             raise GraphQLError(f"User with email {email} not found")

# saleor/graphql/account/mutations/user_add_channels.py
# saleor/graphql/account/mutations/account/user_add_channels.py
# saleor/graphql/account/mutations/account/user_add_channels.py
# saleor/graphql/account/mutations/account/user_add_channels.py
# import graphene
# from graphql import GraphQLError
# from saleor.account.models import User
# # from ....account.types import User
# from saleor.channel.models import Channel
# from user_profile.models import UserProfile
# from ....core.types import BaseInputObjectType 
# from ....account.types import User as UserType
# # from ....core.mutations import BaseMutation
# from saleor.graphql.core.mutations import BaseMutation
# from saleor.graphql.account.error_codes import AccountErrorCode
# from saleor.graphql.account.mutations.base import AccountError

import graphene
from graphql import GraphQLError

from saleor.account.models import User
from saleor.channel.models import Channel
from user_profile.models import UserProfile
from saleor.graphql.core.types import BaseInputObjectType
from saleor.graphql.account.types import User as UserType
from saleor.graphql.core.mutations import BaseMutation

from .....account.error_codes import AccountErrorCode
from ....core.types import AccountError

class UserAddChannelsInput(BaseInputObjectType):
    email = graphene.String(required=True, description="Email of the user to update.")
    channel_slugs = graphene.List(
        graphene.String,
        required=True,
        description="List of channel slugs to associate with the user.",
    )


class UserAddChannels(BaseMutation):
    """Mutation to add multiple channels to an existing user."""

    user = graphene.Field(UserType, description="The user with updated channels.")

    class Arguments:
        input = UserAddChannelsInput(required=True)

    class Meta:
        description = "Add one or more channels to a user."
        error_type_class = AccountError
        error_type_field = "account_errors"

    @classmethod
    def perform_mutation(cls, root, info, **data):
        input_data = data["input"]
        email = input_data["email"]
        channel_slugs = input_data["channel_slugs"]

        # 1️⃣ Get user
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise GraphQLError(f"User with email '{email}' not found.")

        # 2️⃣ Get or create profile
        profile, _ = UserProfile.objects.get_or_create(user=user)

        # 3️⃣ Get channels
        channels = list(Channel.objects.filter(slug__in=channel_slugs))
        if len(channels) != len(channel_slugs):
            missing = set(channel_slugs) - {c.slug for c in channels}
            raise GraphQLError(f"Invalid channel(s): {', '.join(missing)}")

        # 4️⃣ Add channels to the profile
        profile.channels.add(*channels)

        return UserAddChannels(user=user)

    @classmethod
    def mutate(cls, root, info, **data):
        return cls.perform_mutation(root, info, **data)