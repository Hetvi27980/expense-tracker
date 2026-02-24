"""
Authentication utilities: Password hashing (Session-based)
"""
import hashlib

# ---------------------- PASSWORD HASHING ---------------------- #
def hash_text(text: str) -> str:
    """SHA256 hashing (keeping original logic)"""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def verify_hash(text: str, hashed: str) -> bool:
    """Verify SHA256 hash"""
    return hash_text(text) == str(hashed)
