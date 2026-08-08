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


def sync_team_to_mongo(member, action='save'):
    """
    Syncs Django TeamMember ORM model instance directly to MongoDB 'team_members' collection.
    """
    db = get_mongo_db()
    if db is None:
        return
    try:
        col = db['team_members']
        if action == 'delete':
            col.delete_one({'django_id': member.id if hasattr(member, 'id') else member})
        else:
            doc = {
                'django_id': member.id,
                'name': member.name,
                'position': member.position,
                'biography': member.biography,
                'email': member.email,
                'phone': member.phone,
                'linkedin': member.linkedin,
                'website': member.website,
                'profile_image': member.profile_image,
                'profile_pdf': member.profile_pdf,
                'profile_pdf_name': member.profile_pdf_name,
                'skills': member.skills,
                'qualifications': member.qualifications,
                'is_published': member.is_published,
            }
            col.update_one({'django_id': member.id}, {'$set': doc}, upsert=True)
    except Exception as e:
        print(f"[MongoDB Sync Warning] Team member sync error: {e}")


def sync_casestudy_to_mongo(case, action='save'):
    """
    Syncs Django CaseStudy ORM model instance directly to MongoDB 'performance_metrics' collection.
    """
    db = get_mongo_db()
    if db is None:
        return
    try:
        col = db['performance_metrics']
        case_id = case.id if hasattr(case, 'id') else case
        if action == 'delete':
            col.delete_one({'django_id': case_id})
        else:
            doc = {
                'django_id': case.id,
                'title': case.title,
                'category': case.category,
                'description': case.description,
                'performance_gain': case.performance_gain,
                'benchmark_outcome': case.benchmark_outcome,
                'tags': case.tags,
                'icon_name': case.icon_name,
                'color': case.color,
                'is_published': case.is_published,
                'order': case.order,
            }
            col.update_one({'django_id': case.id}, {'$set': doc}, upsert=True)
    except Exception as e:
        print(f"[MongoDB Sync Warning] CaseStudy sync error: {e}")


