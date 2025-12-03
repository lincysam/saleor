# from saleor.graphql.core.fields import BaseField

# class AuthenticatedUserField(BaseField):
#     """A field accessible by any authenticated (non-staff) user."""

#     def __init__(self, type_, *args, **kwargs):
#         # Remove 'permissions' if present; BaseField handles it internally.
#         kwargs.pop("permissions", None)
#         # Set empty list to bypass Saleor's staff/app enforcement
#         super().__init__(type_, *args, permissions=[], **kwargs)
