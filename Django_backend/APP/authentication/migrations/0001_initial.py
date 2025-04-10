# Generated by Django 5.1.6 on 2025-02-12 10:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserModel',
            fields=[
                ('_id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=100, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('profession', models.CharField(max_length=100)),
                ('isEmailVerified', models.BooleanField(default=False)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], default=None, max_length=10)),
                ('mobile', models.CharField(max_length=20)),
                ('process', models.TextField(default='[]')),
            ],
        ),
    ]
