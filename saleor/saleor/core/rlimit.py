
try:
    import resource
except ImportError:
    resource = None

from django.core.exceptions import ImproperlyConfigured

RLIMIT_TYPE = getattr(resource, "RLIMIT_DATA", None)


def is_soft_limit_set_without_hard_limit(soft_limit_in_MB, hard_limit_in_MB):
    return soft_limit_in_MB is not None and hard_limit_in_MB is None


def is_hard_limit_set_without_soft_limit(soft_limit_in_MB, hard_limit_in_MB):
    return soft_limit_in_MB is None and hard_limit_in_MB is not None


def validate_and_set_rlimit(soft_limit_in_MB, hard_limit_in_MB):
    if resource is None:
        return

    try:
        soft_limit_in_MB = int(soft_limit_in_MB) if soft_limit_in_MB else None
        hard_limit_in_MB = int(hard_limit_in_MB) if hard_limit_in_MB else None
    except ValueError as e:
        raise ImproperlyConfigured("Memory limits must be integers.") from e

    if (
        is_soft_limit_set_without_hard_limit(soft_limit_in_MB, hard_limit_in_MB)
        or is_hard_limit_set_without_soft_limit(soft_limit_in_MB, hard_limit_in_MB)
    ):
        raise ImproperlyConfigured("Both soft and hard memory limits must be set.")

    soft_memory_limit = (
        soft_limit_in_MB * 1000 * 1000 if soft_limit_in_MB else resource.RLIM_INFINITY
    )
    hard_memory_limit = (
        hard_limit_in_MB * 1000 * 1000 if hard_limit_in_MB else resource.RLIM_INFINITY
    )

    if soft_memory_limit > hard_memory_limit:
        raise ImproperlyConfigured("Soft limit cannot exceed hard limit.")

    if soft_memory_limit < 0 or hard_memory_limit < 0:
        raise ImproperlyConfigured("Memory limits cannot be negative.")

    resource.setrlimit(RLIMIT_TYPE, (soft_memory_limit, hard_memory_limit))
