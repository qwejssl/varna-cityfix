from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Varna CityFix API"
    app_env: str = "development"

    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "andrei"
    db_password: str = ""
    db_name: str = "varna_cityfix"

    database_url: str = ""

    # NEW — секрет для JWT
    secret_key: str = "CHANGE_ME_SUPER_SECRET"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    def get_database_url(self) -> str:
        if self.database_url:
            return self.database_url

        if self.db_password:
            return (
                f"postgresql+psycopg2://{self.db_user}:{self.db_password}"
                f"@{self.db_host}:{self.db_port}/{self.db_name}"
            )

        return (
            f"postgresql+psycopg2://{self.db_user}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )


settings = Settings()