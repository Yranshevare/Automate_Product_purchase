# Generated by Django 5.1.6 on 2025-03-07 10:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('process', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ApprovalModel',
            fields=[
                ('_id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('email', models.EmailField(max_length=100)),
                ('status', models.CharField(choices=[('Incomplete', 'Incomplete'), ('Pending', 'Pending'), ('Complete', 'Complete')], default='Incomplete', max_length=20)),
                ('type', models.CharField(choices=[('Primary', 'Primary'), ('Final', 'Final')], default='Primary', max_length=20)),
                ('process', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='process.processmodel')),
            ],
        ),
    ]
