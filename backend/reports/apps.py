from django.apps import AppConfig
from django.db import connection
import os

class ReportsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reports'

    def ready(self):
        sql_path = os.path.join(os.path.dirname(__file__), "sql/trigger.sql")

        if os.path.exists(sql_path):
            with connection.cursor() as cursor:
                with open(sql_path, "r") as f:
                    sql = f.read()
                    cursor.execute(sql)
