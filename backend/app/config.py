"""
Application configuration.

Loads and validates environment variables using pydantic-settings.
Import `settings` from this module anywhere in the app that needs
configuration values -- never read os.environ directly elsewhere.
"""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Gemini
    gemini_api_key: str = Field(..., alias="GEMINI_API_KEY")
    model: str = Field(default="gemini-2.0-flash", alias="GEMINI_MODEL")

    # App
    app_env: str = Field(default="development", alias="APP_ENV")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")

    # CORS
    frontend_origin: str = Field(
        default="http://localhost:5173", alias="FRONTEND_ORIGIN"
    )

    # Request limits
    request_timeout_seconds: int = Field(
        default=60, alias="REQUEST_TIMEOUT_SECONDS"
    )
    max_notes_length: int = Field(default=20000, alias="MAX_NOTES_LENGTH")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        populate_by_name=True,
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    """
    Returns a cached Settings instance.

    Using lru_cache ensures the .env file is parsed only once per
    process, and every module gets the same Settings object.
    """
    return Settings()


settings = get_settings()