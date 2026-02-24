import os
from dotenv import load_dotenv

load_dotenv()

# Database Configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 3306))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "expense_tracker")

# Session Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
SESSION_EXPIRE_MINUTES = 60 * 24  # 24 hours

# API Configuration
API_PORT = int(os.getenv("API_PORT", 3000))
API_HOST = os.getenv("API_HOST", "localhost")

# Database URL
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
