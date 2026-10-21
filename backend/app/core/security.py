from enum import Enum
from typing import Optional

class UserRole(str, Enum):
    GUEST = "guest"
    USER = "user"
    STUDENT = "student"
    TEACHER = "teacher"
    SCHOLAR = "scholar"
    ADMIN = "admin"

class CurrentUser:
    def __init__(self, user_id: int = 1, username: str = "guest_user", role: UserRole = UserRole.USER):
        self.user_id = user_id
        self.username = username
        self.role = role

    def can_edit_canonical_text(self) -> bool:
        # Sacred text is immutable: even admins cannot edit text directly without formal audited review ticket
        return False

    def can_review_tafsir(self) -> bool:
        return self.role in [UserRole.SCHOLAR, UserRole.ADMIN]

    def can_manage_users(self) -> bool:
        return self.role == UserRole.ADMIN

def get_current_user() -> CurrentUser:
    # Default to user with standard permissions
    return CurrentUser(user_id=1, username="seeker_of_truth", role=UserRole.USER)
