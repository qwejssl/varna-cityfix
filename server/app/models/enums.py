import enum


class UserRole(str, enum.Enum):
    CITIZEN = "CITIZEN"
    ADMIN = "ADMIN"


class ReportCategory(str, enum.Enum):
    ROAD = "ROAD"
    PAVEMENT = "PAVEMENT"
    STREETLIGHT = "STREETLIGHT"
    BUILDING = "BUILDING"
    WASTE = "WASTE"
    PARK = "PARK"
    OTHER = "OTHER"


class ReportStatus(str, enum.Enum):
    NEW = "NEW"
    UNDER_REVIEW = "UNDER_REVIEW"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    REJECTED = "REJECTED"


class VarnaDistrict(str, enum.Enum):
    ASPARUHOVO = "ASPARUHOVO"
    PRIMORSKI = "PRIMORSKI"
    ODESSOS = "ODESSOS"
    MLADOST = "MLADOST"
    VLADISLAV_VARNENCHIK = "VLADISLAV_VARNENCHIK"