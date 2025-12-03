
import graphene
from .queries import UserChannelsQuery


class UserProfileQueries(
    UserChannelsQuery,
    graphene.ObjectType
):
    pass