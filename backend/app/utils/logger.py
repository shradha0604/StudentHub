"""
Centralized logging configuration.

Import `get_logger(__name__)` in any module that needs to log.
This ensures consistent formatting and a single configured
logging pipeline across the whole app.
"""

import logging
import sys

from app.config import settings

_LOG_FORMAT = (
    "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
)
_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

_configured = False


def _configure_root_logger() -> None:
    """
    Configures the root logger exactly once per process.
    Subsequent calls are no-ops thanks to the module-level flag.
    """
    global _configured
    if _configured:
        return

    root_logger = logging.getLogger()
    root_logger.setLevel(settings.log_level.upper())

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(_LOG_FORMAT, datefmt=_DATE_FORMAT))

    # Avoid duplicate handlers if this module is imported multiple times
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    _configured = True


def get_logger(name: str) -> logging.Logger:
    """
    Returns a named logger, ensuring the root logger is configured first.

    Usage:
        logger = get_logger(__name__)
        logger.info("Something happened")
    """
    _configure_root_logger()
    return logging.getLogger(name)
