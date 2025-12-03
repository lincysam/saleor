# import graphene
# from graphql import GraphQLError
# from saleor.channel.models import Channel
# from saleor.graphql.channel.types import Channel as ChannelType
# from user_profile.models import UserProfile
# from saleor.graphql.core.fields import BaseField

# class CustomerField(BaseField):
#     def __init__(self, type, *args, **kwargs):
#         # Override default permissions
#         kwargs.setdefault("permissions", [])
#         super().__init__(type, *args, **kwargs)

# class UserChannelsQuery(graphene.ObjectType):
#     """Query for all channels accessible by the logged-in user."""

#     user_channels = CustomerField(
#         graphene.List(graphene.NonNull(ChannelType)),
#         description="Get all channels accessible by the logged-in user."
#     )

    # @staticmethod
    # def resolve_user_channels(_root, info):
    #     user = info.context.user
    #     if not user or not user.is_authenticated:
    #         raise GraphQLError("Authentication required.")

    #     # Let staff users also see their own
    #     if user.is_staff:
    #         return Channel.objects.all().order_by("slug")

    #     try:
    #         profile = UserProfile.objects.get(user=user)
    #         return profile.channels.all().order_by("slug")
    #     except UserProfile.DoesNotExist:
    #         return []
# user_profile/graphql/queries.py
import graphene
from graphql import GraphQLError
from saleor.graphql.core.types import NonNullList
from saleor.graphql.core.fields import PermissionsField
from saleor.graphql.core import ResolveInfo
from saleor.permission.auth_filters import AuthorizationFilters
from saleor.graphql.core.doc_category import DOC_CATEGORY_USERS

from user_profile.models import UserProfile
from saleor.graphql.channel.types import Channel


class UserChannelsQuery(graphene.ObjectType):
    """Return the list of channels a logged-in user is linked to."""

    user_channels = PermissionsField(
        NonNullList(Channel),
        description="List of channels accessible by the logged-in user.",
        permissions=[AuthorizationFilters.AUTHENTICATED_USER],
    )

    @staticmethod
    def resolve_user_channels(_root, info: ResolveInfo):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Authentication required.")

        try:
            profile = UserProfile.objects.get(user=user)
            return profile.channels.all().order_by("slug")
        except UserProfile.DoesNotExist:
            return []