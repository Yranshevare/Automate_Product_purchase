set -o errorexit

pip install -r requirements.txt

python manage.py migrate