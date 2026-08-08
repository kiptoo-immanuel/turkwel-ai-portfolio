import os
from django.conf import settings

_mongo_client = None
_mongo_db = None

def get_mongo_db():
    """
    Returns a connected PyMongo database instance if MONGODB_URI is defined,
    otherwise returns None (falling back to Django default ORM models).
    """
    global _mongo_client, _mongo_db
    
    mongo_uri = getattr(settings, 'MONGODB_URI', '') or os.environ.get('MONGODB_URI', '')
    if not mongo_uri:
        return None

    if _mongo_db is not None:
        return _mongo_db

    try:
        from pymongo import MongoClient
        db_name = getattr(settings, 'MONGODB_DB_NAME', 'bimaxisgroup_db') or 'bimaxisgroup_db'
        _mongo_client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        _mongo_db = _mongo_client[db_name]
        return _mongo_db
    except Exception as e:
        print(f"[MongoDB Connection Warning] Could not connect to MongoDB URI: {e}")
        return None
